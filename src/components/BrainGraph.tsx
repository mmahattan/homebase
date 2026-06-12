"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

type Node = { id: string; count: number; x?: number; y?: number };
type Link = { source: string; target: string; strength: number };
type GraphData = { nodes: Node[]; links: Link[] };

export default function BrainGraph() {
  const [graphData, setGraphData]       = useState<GraphData>({ nodes: [], links: [] });
  const [hoveredNode, setHoveredNode]   = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [dimensions, setDimensions]     = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef     = useRef<any>(null);

  useEffect(() => {
    fetch("/brain-graph.json").then((r) => r.json()).then(setGraphData);
  }, []);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const connectedIds = useCallback((nodeId: string) => {
    const ids = new Set<string>();
    graphData.links.forEach((l) => {
      const src = typeof l.source === "object" ? (l.source as Node).id : l.source;
      const tgt = typeof l.target === "object" ? (l.target as Node).id : l.target;
      if (src === nodeId) ids.add(tgt);
      if (tgt === nodeId) ids.add(src);
    });
    return ids;
  }, [graphData]);

  const activeNode      = selectedNode ?? hoveredNode;
  const activeConnected = activeNode ? connectedIds(activeNode) : new Set<string>();

  const drawLabel = useCallback((
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    r: number,
    zoom: number,
    primary: boolean,
  ) => {
    const screenSize = primary ? 15 : 13;
    const fontSize   = screenSize / zoom;
    const pad        = 5 / zoom;
    const gap        = 8 / zoom;
    const labelY     = y - r - gap;

    ctx.font = `${primary ? 600 : 500} ${fontSize}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = "center";

    const textW = ctx.measureText(text).width;
    const boxH  = fontSize + 4 / zoom;

    ctx.fillStyle = primary ? "rgba(10,10,10,0.8)" : "rgba(10,10,10,0.65)";
    ctx.beginPath();
    ctx.roundRect(x - textW / 2 - pad, labelY - fontSize, textW + pad * 2, boxH + pad, 3 / zoom);
    ctx.fill();

    ctx.fillStyle = primary ? "#ffffff" : "rgba(255,255,255,0.8)";
    ctx.fillText(text, x, labelY);
  }, []);

  const paintNode = useCallback((node: Node, ctx: CanvasRenderingContext2D) => {
    const id   = node.id;
    const x    = node.x ?? 0;
    const y    = node.y ?? 0;
    const r    = 4 + Math.sqrt(node.count) * 1.2;
    const zoom = ctx.getTransform().a;

    const isActive    = id === activeNode;
    const isConnected = activeNode ? activeConnected.has(id) : false;
    const isDimmed    = !!activeNode && !isActive && !isConnected;

    if (isActive) {
      const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
      glow.addColorStop(0, "rgba(45,212,191,0.45)");
      glow.addColorStop(1, "rgba(45,212,191,0)");
      ctx.beginPath();
      ctx.arc(x, y, r * 5, 0, 2 * Math.PI);
      ctx.fillStyle = glow;
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = isDimmed
      ? "rgba(80,80,80,0.25)"
      : isActive
      ? "#2dd4bf"
      : isConnected
      ? "rgba(45,212,191,0.55)"
      : "rgba(45,212,191,0.35)";
    ctx.fill();

    if (isActive) {
      drawLabel(ctx, id, x, y, r, zoom, true);
    }

    if (isConnected && selectedNode) {
      drawLabel(ctx, id, x, y, r, zoom, false);
    }
  }, [activeNode, activeConnected, selectedNode, drawLabel]);

  const paintLink = useCallback((link: Link, ctx: CanvasRenderingContext2D) => {
    const src = link.source as unknown as Node;
    const tgt = link.target as unknown as Node;
    if (!src?.x || !tgt?.x) return;

    const srcId    = src.id;
    const tgtId    = tgt.id;
    const isActive = activeNode && (srcId === activeNode || tgtId === activeNode);

    ctx.beginPath();
    ctx.moveTo(src.x, src.y ?? 0);
    ctx.lineTo(tgt.x, tgt.y ?? 0);
    ctx.strokeStyle = isActive
      ? "rgba(45,212,191,0.55)"
      : activeNode
      ? "rgba(255,255,255,0.03)"
      : "rgba(255,255,255,0.08)";
    ctx.lineWidth = isActive ? 1.5 : 0.5;
    ctx.stroke();
  }, [activeNode]);

  const zoomToNode = useCallback((node: Node) => {
    const id      = node.id;
    const connected = connectedIds(id);
    const related   = [node, ...graphData.nodes.filter((nd) => connected.has(nd.id))];

    const xs = related.map((nd) => nd.x ?? 0);
    const ys = related.map((nd) => nd.y ?? 0);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const pad  = 80;
    const spanX = Math.max(maxX - minX, 1);
    const spanY = Math.max(maxY - minY, 1);
    const k = Math.min(
      (dimensions.width  - pad * 2) / spanX,
      (dimensions.height - pad * 2) / spanY,
      6,
    );

    graphRef.current?.centerAt((minX + maxX) / 2, (minY + maxY) / 2, 400);
    graphRef.current?.zoom(Math.max(0.5, k), 400);
  }, [connectedIds, graphData.nodes, dimensions]);

  return (
    <div ref={containerRef} className="w-full h-full">
      {graphData.nodes.length > 0 && (
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="transparent"
          nodeCanvasObject={paintNode as never}
          linkCanvasObject={paintLink as never}
          nodeCanvasObjectMode={() => "replace"}
          linkCanvasObjectMode={() => "replace"}
          onNodeHover={(node) => setHoveredNode(node ? (node as Node).id : null)}
          onNodeClick={(node) => {
            const id = (node as Node).id;
            if (selectedNode === id) {
              setSelectedNode(null);
              graphRef.current?.zoomToFit(400, 60);
            } else {
              setSelectedNode(id);
              zoomToNode(node as Node);
            }
          }}
          onBackgroundClick={() => {
            setSelectedNode(null);
            graphRef.current?.zoomToFit(400, 60);
          }}
          nodeLabel={() => ""}
          cooldownTicks={120}
          linkDirectionalParticles={(link) => {
            const l   = link as Link;
            const src = typeof l.source === "object" ? (l.source as Node).id : l.source;
            const tgt = typeof l.target === "object" ? (l.target as Node).id : l.target;
            return selectedNode && (src === selectedNode || tgt === selectedNode) ? 3 : 0;
          }}
          linkDirectionalParticleWidth={2}
          linkDirectionalParticleColor={() => "#2dd4bf"}
          linkDirectionalParticleSpeed={0.005}
        />
      )}
    </div>
  );
}

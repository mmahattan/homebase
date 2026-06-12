"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

type Node = { id: string; count: number; x?: number; y?: number };
type Link = { source: string; target: string; strength: number };
type GraphData = { nodes: Node[]; links: Link[] };

export default function BrainGraph() {
  const [graphData, setGraphData]     = useState<GraphData>({ nodes: [], links: [] });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [dimensions, setDimensions]   = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Active node is selected node (if any), otherwise hovered
  const activeNode = selectedNode ?? hoveredNode;
  const activeConnected = activeNode ? connectedIds(activeNode) : new Set<string>();

  const paintNode = useCallback((node: Node, ctx: CanvasRenderingContext2D) => {
    const id    = node.id;
    const x     = node.x ?? 0;
    const y     = node.y ?? 0;
    const r     = 4 + Math.sqrt(node.count) * 1.2;

    const isActive    = id === activeNode;
    const isConnected = activeNode ? activeConnected.has(id) : false;
    const isDimmed    = !!activeNode && !isActive && !isConnected;

    // Glow for active node only
    if (isActive) {
      const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
      glow.addColorStop(0, "rgba(45,212,191,0.45)");
      glow.addColorStop(1, "rgba(45,212,191,0)");
      ctx.beginPath();
      ctx.arc(x, y, r * 5, 0, 2 * Math.PI);
      ctx.fillStyle = glow;
      ctx.fill();
    }

    // Node circle
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

    // Label: only on active node (hover or selected)
    if (isActive) {
      const fontSize = 12;
      ctx.font = `600 ${fontSize}px ui-sans-serif, system-ui, sans-serif`;
      ctx.textAlign = "center";
      // Background pill for readability
      const textW = ctx.measureText(id).width;
      const pad   = 5;
      const labelY = y - r - 10;
      ctx.fillStyle = "rgba(10,10,10,0.75)";
      ctx.beginPath();
      ctx.roundRect(x - textW / 2 - pad, labelY - fontSize, textW + pad * 2, fontSize + 6, 4);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.fillText(id, x, labelY);
    }

    // Labels for connected nodes only when a node is selected (clicked)
    if (isConnected && selectedNode) {
      const fontSize = 10;
      ctx.font = `500 ${fontSize}px ui-sans-serif, system-ui, sans-serif`;
      ctx.textAlign = "center";
      const textW = ctx.measureText(id).width;
      const pad   = 4;
      const labelY = y - r - 8;
      ctx.fillStyle = "rgba(10,10,10,0.65)";
      ctx.beginPath();
      ctx.roundRect(x - textW / 2 - pad, labelY - fontSize, textW + pad * 2, fontSize + 5, 3);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillText(id, x, labelY);
    }
  }, [activeNode, activeConnected, selectedNode]);

  const paintLink = useCallback((link: Link, ctx: CanvasRenderingContext2D) => {
    const src = link.source as unknown as Node;
    const tgt = link.target as unknown as Node;
    if (!src?.x || !tgt?.x) return;

    const srcId = src.id;
    const tgtId = tgt.id;
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

  return (
    <div ref={containerRef} className="w-full h-full">
      {graphData.nodes.length > 0 && (
        <ForceGraph2D
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
            setSelectedNode((prev) => (prev === id ? null : id));
          }}
          onBackgroundClick={() => setSelectedNode(null)}
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

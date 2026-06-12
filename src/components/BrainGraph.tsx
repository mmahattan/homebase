"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

type Node = { id: string; count: number; x?: number; y?: number };
type Link = { source: string; target: string; strength: number };
type GraphData = { nodes: Node[]; links: Link[] };

export default function BrainGraph() {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/brain-graph.json")
      .then((r) => r.json())
      .then(setGraphData);
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

  const paintNode = useCallback((node: Node, ctx: CanvasRenderingContext2D) => {
    const id = node.id;
    const isHovered = id === hoveredNode;
    const isConnected = hoveredNode ? connectedIds(hoveredNode).has(id) : false;
    const isActive = isHovered || isConnected;
    const isDimmed = hoveredNode && !isActive;

    const radius = 3 + Math.sqrt(node.count) * 1.5;
    const x = node.x ?? 0;
    const y = node.y ?? 0;

    // Glow
    if (isActive) {
      const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 4);
      glow.addColorStop(0, isHovered ? "rgba(45,212,191,0.5)" : "rgba(45,212,191,0.2)");
      glow.addColorStop(1, "rgba(45,212,191,0)");
      ctx.beginPath();
      ctx.arc(x, y, radius * 4, 0, 2 * Math.PI);
      ctx.fillStyle = glow;
      ctx.fill();
    }

    // Node
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = isDimmed
      ? "rgba(100,100,100,0.2)"
      : isHovered
      ? "#2dd4bf"
      : isConnected
      ? "rgba(45,212,191,0.7)"
      : "rgba(45,212,191,0.4)";
    ctx.fill();

    // Label on hover or connected
    if (isActive) {
      ctx.font = `${isHovered ? 13 : 10}px ui-monospace, monospace`;
      ctx.fillStyle = isHovered ? "#fff" : "rgba(255,255,255,0.7)";
      ctx.textAlign = "center";
      ctx.fillText(id, x, y - radius - 5);
    }
  }, [hoveredNode, connectedIds]);

  const paintLink = useCallback((link: Link, ctx: CanvasRenderingContext2D) => {
    const src = link.source as unknown as Node;
    const tgt = link.target as unknown as Node;
    if (!src?.x || !tgt?.x) return;

    const srcId = src.id;
    const tgtId = tgt.id;
    const isActive = hoveredNode && (srcId === hoveredNode || tgtId === hoveredNode);

    ctx.beginPath();
    ctx.moveTo(src.x, src.y ?? 0);
    ctx.lineTo(tgt.x, tgt.y ?? 0);
    ctx.strokeStyle = isActive
      ? "rgba(45,212,191,0.6)"
      : hoveredNode
      ? "rgba(255,255,255,0.03)"
      : "rgba(255,255,255,0.07)";
    ctx.lineWidth = isActive ? 1.5 : 0.5;
    ctx.stroke();
  }, [hoveredNode]);

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
          nodeLabel={() => ""}
          cooldownTicks={120}
          linkDirectionalParticles={(link) => {
            const l = link as Link;
            const src = typeof l.source === "object" ? (l.source as Node).id : l.source;
            const tgt = typeof l.target === "object" ? (l.target as Node).id : l.target;
            return hoveredNode && (src === hoveredNode || tgt === hoveredNode) ? 3 : 0;
          }}
          linkDirectionalParticleWidth={2}
          linkDirectionalParticleColor={() => "#2dd4bf"}
          linkDirectionalParticleSpeed={0.006}
        />
      )}
    </div>
  );
}

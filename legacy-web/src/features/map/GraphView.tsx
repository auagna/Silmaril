"use client";

import { useMemo } from "react";
import ReactFlow, {
  Background, Controls, MiniMap,
  type Node, type Edge,
} from "reactflow";
import "reactflow/dist/style.css";

import { connections, threads } from "@/lib/dummy";

export function GraphView({ visibleIds }: { visibleIds?: Set<string> }) {
  const { nodes, edges } = useMemo(() => buildGraph(visibleIds), [visibleIds]);

  return (
    <div className="h-[70vh] border border-ink-200 rounded-xl2 bg-white overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        proOptions={{ hideAttribution: true }}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
      >
        <Background gap={24} size={1} color="#e7e6e2" />
        <MiniMap pannable zoomable maskColor="rgba(250,250,249,0.85)" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

function buildGraph(visibleIds?: Set<string>) {
  const visible = visibleIds ?? new Set(threads.map((t) => t.id));

  // simple radial-ish layout: spread threads on a circle.
  const visibleThreads = threads.filter((t) => visible.has(t.id));
  const n = Math.max(visibleThreads.length, 1);
  const R = 320;
  const cx = 400;
  const cy = 280;

  const nodes: Node[] = visibleThreads.map((t, i) => {
    const angle = (i / n) * Math.PI * 2;
    return {
      id: t.id,
      position: { x: cx + Math.cos(angle) * R, y: cy + Math.sin(angle) * R },
      data: { label: t.title },
      style: {
        padding: "8px 12px",
        borderRadius: 12,
        border: "1px solid #cfcec9",
        background: "#ffffff",
        fontSize: 12,
        color: "#1a1a17",
        fontFamily: "ui-serif, Iowan Old Style, serif",
      },
    };
  });

  const edges: Edge[] = connections
    .filter((c) => visible.has(c.from_thread) && visible.has(c.to_thread))
    .map((c) => ({
      id: c.id,
      source: c.from_thread,
      target: c.to_thread,
      label: c.relation,
      labelStyle: { fontSize: 10, fill: "#6b6b66" },
      style: { stroke: "#cfcec9" },
    }));

  return { nodes, edges };
}

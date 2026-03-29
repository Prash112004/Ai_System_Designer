import { useState } from "react";
import axios from "axios";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [explanation, setExplanation] = useState(null);

  const generateDesign = async () => {
    if (!prompt) return;

    try {
      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:8000/api/v1/designs/generate",
        { prompt }
      );

      const data = res.data;
      setExplanation(data.explanations);

      const newNodes = data.components.map((comp, index) => ({
        id: comp.id,
        data: { label: comp.label },
        position: { x: (index % 3) * 280, y: Math.floor(index / 3) * 180 },
        style: {
          background: "#1e293b",
          color: "#e2e8f0",
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #334155",
          width: 180,
          textAlign: "center",
          cursor: "pointer",
        },
      }));

      const newEdges = data.connections.map((conn, index) => ({
        id: "e" + index,
        source: conn.source,
        target: conn.target,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#38bdf8" },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#38bdf8",
        },
      }));

      setNodes(newNodes);
      setEdges(newEdges);
      setSelectedNode(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      {/* 🔥 NAVBAR */}
      <div
        style={{
          height: "60px",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          background: "#020617",
          borderBottom: "1px solid #1e293b",
          color: "white",
          fontWeight: "600",
        }}
      >
        🚀 AI System Designer
      </div>

      {/* 🔥 MAIN LAYOUT */}
      <div style={{ flex: 1, display: "flex" }}>

        {/* 🔥 SIDEBAR */}
        <div
          style={{
            width: "260px",
            background: "#020617",
            borderRight: "1px solid #1e293b",
            padding: "16px",
            color: "white",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>Generate Design</h3>

          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Design Netflix system..."
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              borderRadius: "6px",
              border: "1px solid #334155",
              background: "#020617",
              color: "white",
            }}
          />

          <button
            onClick={generateDesign}
            style={{
              width: "100%",
              padding: "10px",
              background: "#38bdf8",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {loading ? "Generating..." : "Generate"}
          </button>

          {explanation && (
            <div style={{ marginTop: "20px", fontSize: "13px", color: "#94a3b8" }}>
              <h4>Overview</h4>
              <p>{explanation.overview}</p>
            </div>
          )}
        </div>

        {/* 🔥 DIAGRAM */}
        <div style={{ flex: 1 }}>
          {nodes.length === 0 && (
            <div
              style={{
                textAlign: "center",
                marginTop: "120px",
                color: "#64748b",
              }}
            >
              <h2>Generate a system design</h2>
              <p>Try: Uber, Netflix, Chat App</p>
            </div>
          )}

          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            onNodeClick={(e, node) => setSelectedNode(node)}
          >
            <Background color="#0f172a" gap={20} />
            <Controls />
          </ReactFlow>
        </div>

        {/* 🔥 RIGHT PANEL */}
        {selectedNode && (
          <div
            style={{
              width: "260px",
              background: "#020617",
              borderLeft: "1px solid #1e293b",
              padding: "16px",
              color: "white",
            }}
          >
            <h3>{selectedNode.data.label}</h3>

            <p style={{ fontSize: "13px", color: "#94a3b8" }}>
              This component handles part of the system architecture.
            </p>

            <button
              onClick={() => setSelectedNode(null)}
              style={{
                marginTop: "15px",
                padding: "8px",
                background: "#38bdf8",
                border: "none",
                borderRadius: "6px",
              }}
            >
              Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
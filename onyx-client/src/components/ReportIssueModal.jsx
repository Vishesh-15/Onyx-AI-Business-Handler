import { useState } from "react";

const CATEGORIES = [
  "Agent not responding",
  "Data not loading",
  "UI/Display issue",
  "Feature not working",
  "Other",
];

export default function ReportIssueModal({ onClose, currentPage }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const pageLabel = {
    dashboard: "Dashboard",
    clients: "Clients",
    deadlines: "Deadlines",
    documents: "Documents",
    reminders: "Reminders",
    settings: "Settings",
  }[currentPage] || currentPage;

  const handleSubmit = () => {
    if (!title || !description) return;
    // TODO: POST to backend /api/issues
    console.log("Issue reported:", { title, category, description, page: currentPage });
    setSubmitted(true);
  };

  const overlay = {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000,
  };

  const modal = {
    background: "#fff",
    borderRadius: 12,
    width: 480,
    padding: 28,
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  };

  const label = { fontSize: 11, color: "#888", letterSpacing: "0.08em", marginBottom: 6, display: "block" };
  const input = { width: "100%", border: "1px solid #e5e5e5", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#111", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };

  if (submitted) {
    return (
      <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
        <div style={{ ...modal, textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 8 }}>Report Submitted</div>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>We'll look into it and get back to you shortly.</div>
          <button onClick={onClose} style={{ background: "#3a9e75", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={modal}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>Report an Issue</div>
            <div style={{ fontSize: 12, color: "#aaa", marginTop: 3 }}>We'll notify the developer immediately</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: 20, lineHeight: 1 }}>×</button>
        </div>

        {/* Page badge */}
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 11, color: "#888" }}>Reported from: </span>
          <span style={{ fontSize: 11, background: "#f0f0f0", color: "#555", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>
            {pageLabel}
          </span>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <span style={label}>CATEGORY</span>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...input, cursor: "pointer" }}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <span style={label}>ISSUE TITLE</span>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Brief summary of the issue" style={input} />
          </div>

          <div>
            <span style={label}>DESCRIPTION</span>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What happened? What were you trying to do?"
              style={{ ...input, minHeight: 100, resize: "vertical" }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ background: "none", border: "1px solid #e5e5e5", color: "#888", padding: "9px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title || !description}
            style={{ background: title && description ? "#3a9e75" : "#ddd", color: title && description ? "#fff" : "#aaa", border: "none", padding: "9px 20px", borderRadius: 8, cursor: title && description ? "pointer" : "not-allowed", fontSize: 13, fontWeight: 600 }}
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { createClient } from '../api/api';

const modules = [
  { id: "gst", label: "GST Tracker", icon: "ti-file-invoice" },
  { id: "deadlines", label: "Deadlines", icon: "ti-calendar" },
  { id: "documents", label: "Documents", icon: "ti-folder" },
  { id: "reminders", label: "Reminders", icon: "ti-bell" },
  { id: "clients", label: "Clients", icon: "ti-users" },
];


function generateUID(clientName) {
  const prefix = clientName
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "CL";
  const num = Math.floor(1000 + Math.random() * 9000);
  const suffix = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `${prefix}-${num}-${suffix}`;
}

function generatePassword() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$";
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function AddClientModal({ onClose, onSave }) {
  const [step, setStep] = useState(1);
  const [clientName, setClientName] = useState("");
  const [clientType, setClientType] = useState("CA Firm");
  const [theme] = useState("#3a9e75");
  const [enabledModules, setEnabledModules] = useState(["gst", "deadlines", "reminders"]);
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState("");

  const toggleModule = (id) => {
    setEnabledModules(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleGenerateUID = () => {
    setUid(generateUID(clientName));
  };

  const handleGeneratePassword = () => {
    setPassword(generatePassword());
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleCreate = async () => {
   try {
    const result = await createClient({
       uid,
       clientName,
       clientType,
       password,
       modules: enabledModules,
     });
     if (result.uid) {
       onSave(result);
       onClose();
     } else {
       alert(result.detail || "Error creating client");
     }
   // eslint-disable-next-line no-unused-vars
   } catch (err) {
      alert("Backend se connect nahi ho pa raha");
   }
  };

  const overlay = {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000
  };

  const modal = {
    background: "#131315",
    border: "0.5px solid #2a2a2e",
    borderRadius: "12px",
    width: "520px",
    maxHeight: "90vh",
    overflowY: "auto",
    padding: "28px",
  };

  const label = { fontSize: "11px", color: "#555", letterSpacing: "1px", marginBottom: "8px", display: "block" };
  const input = {
    width: "100%", background: "#0e0e10",
    border: "0.5px solid #2a2a2e", color: "#e8e8e6",
    padding: "10px 12px", borderRadius: "6px",
    fontSize: "13px", outline: "none", boxSizing: "border-box"
  };
  const btn = (bg, color) => ({
    background: bg, color, border: "none",
    padding: "10px 20px", borderRadius: "6px",
    fontSize: "13px", fontWeight: "500",
    cursor: "pointer"
  });

  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={modal}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "600", color: "#e8e8e6" }}>Add New Client</div>
            <div style={{ fontSize: "12px", color: "#555", marginTop: "3px" }}>Step {step} of 3</div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#555", cursor: "pointer", fontSize: "20px" }}>
            <i className="ti ti-x" />
          </button>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "28px" }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              flex: 1, height: "3px", borderRadius: "2px",
              background: s <= step ? theme : "#2a2a2e",
              transition: "background 0.3s"
            }} />
          ))}
        </div>

        {/* Step 1 — Basic Info */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <span style={label}>CLIENT NAME</span>
              <input style={input} value={clientName} onChange={e => setClientName(e.target.value)} placeholder="e.g. Sharma & Associates" />
            </div>
            <div>
              <span style={label}>CLIENT TYPE</span>
              <select style={{ ...input, cursor: "pointer" }} value={clientType} onChange={e => setClientType(e.target.value)}>
                <option>CA Firm</option>
                <option>Real Estate</option>
                <option>Design Agency</option>
                <option>Startup</option>
                <option>Other</option>
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
              <button style={btn(theme, "#fff")} onClick={() => setStep(2)} disabled={!clientName}>
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Modules */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: "16px", fontSize: "13px", color: "#888" }}>
              Select which modules this client can access
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
              {modules.map(m => {
                const enabled = enabledModules.includes(m.id);
                return (
                  <div key={m.id} onClick={() => toggleModule(m.id)} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px", borderRadius: "8px",
                    background: enabled ? `${theme}18` : "#0e0e10",
                    border: `0.5px solid ${enabled ? theme : "#2a2a2e"}`,
                    cursor: "pointer", transition: "all 0.2s"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <i className={`ti ${m.icon}`} style={{ color: enabled ? theme : "#555", fontSize: "16px" }} />
                      <span style={{ fontSize: "13px", color: enabled ? "#e8e8e6" : "#666" }}>{m.label}</span>
                    </div>
                    <div style={{
                      width: "36px", height: "20px", borderRadius: "10px",
                      background: enabled ? theme : "#333",
                      position: "relative", transition: "background 0.2s"
                    }}>
                      <div style={{
                        width: "14px", height: "14px", borderRadius: "50%",
                        background: "#fff", position: "absolute",
                        top: "3px", left: enabled ? "19px" : "3px",
                        transition: "left 0.2s"
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button style={btn("#1a1a1c", "#888")} onClick={() => setStep(1)}>← Back</button>
              <button style={btn(theme, "#fff")} onClick={() => setStep(3)} disabled={enabledModules.length === 0}>Next →</button>
            </div>
          </div>
        )}

        {/* Step 3 — Credentials */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{
              background: "#0e0e10", border: `0.5px solid ${theme}44`,
              borderRadius: "8px", padding: "14px", marginBottom: "4px"
            }}>
              <div style={{ fontSize: "12px", color: "#555", marginBottom: "6px" }}>SUMMARY</div>
              <div style={{ fontSize: "13px", color: "#e8e8e6" }}>{clientName} · {clientType}</div>
              <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                {enabledModules.length} modules enabled
              </div>
            </div>

            <div>
              <span style={label}>CLIENT UID</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <input style={{ ...input, flex: 1, fontFamily: "monospace" }} value={uid} onChange={e => setUid(e.target.value)} placeholder="Auto generate or type" />
                <button onClick={handleGenerateUID} style={btn(theme, "#fff")}>Generate</button>
                {uid && <button onClick={() => copyToClipboard(uid, "uid")} style={btn("#1a1a1c", copied === "uid" ? theme : "#888")}>
                  <i className={`ti ${copied === "uid" ? "ti-check" : "ti-copy"}`} />
                </button>}
              </div>
            </div>

            <div>
              <span style={label}>PASSWORD</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <input style={{ ...input, fontFamily: "monospace", paddingRight: "36px" }}
                    type={showPassword ? "text" : "password"}
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Auto generate or type" />
                  <button onClick={() => setShowPassword(!showPassword)} style={{
                    position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", color: "#555", cursor: "pointer"
                  }}>
                    <i className={`ti ${showPassword ? "ti-eye-off" : "ti-eye"}`} />
                  </button>
                </div>
                <button onClick={handleGeneratePassword} style={btn(theme, "#fff")}>Generate</button>
                {password && <button onClick={() => copyToClipboard(password, "pwd")} style={btn("#1a1a1c", copied === "pwd" ? theme : "#888")}>
                  <i className={`ti ${copied === "pwd" ? "ti-check" : "ti-copy"}`} />
                </button>}
              </div>
            </div>

            <div style={{ fontSize: "11px", color: "#555", marginTop: "4px" }}>
              Save these credentials — password cannot be recovered after creation.
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
              <button style={btn("#1a1a1c", "#888")} onClick={() => setStep(2)}>← Back</button>
              <button
                style={btn(theme, "#fff")}
                onClick={handleCreate}
                disabled={!uid || !password}
              >
                Create Client
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
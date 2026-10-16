import { useState } from "react";

const Toggle = ({ value, onChange }) => (
  <div onClick={() => onChange(!value)} style={{ width: "44px", height: "24px", borderRadius: "12px", background: value ? "#22c55e" : "#ccc", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
    <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#fff", position: "absolute", top: "3px", left: value ? "23px" : "3px", transition: "left 0.2s" }} />
  </div>
);

const Section = ({ title, children, t }) => (
  <div style={{ background: t.bg, border: `0.5px solid ${t.border}`, borderRadius: "10px", marginBottom: "16px", overflow: "hidden" }}>
    <div style={{ padding: "14px 20px", borderBottom: `0.5px solid ${t.border}`, fontSize: "11px", color: t.sectionLabel, letterSpacing: "1px" }}>{title}</div>
    <div style={{ padding: "4px 0" }}>{children}</div>
  </div>
);

const Row = ({ label, sub, children, t }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: `0.5px solid ${t.rowBorder}` }}>
    <div>
      <div style={{ fontSize: "13px", color: t.labelText }}>{label}</div>
      {sub && <div style={{ fontSize: "11px", color: t.subText, marginTop: "2px" }}>{sub}</div>}
    </div>
    {children}
  </div>
);

export default function Settings({ darkMode, onDarkModeChange }) {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [escalationEmail, setEscalationEmail] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [language, setLanguage] = useState("english");

  const t = {
    bg:           darkMode ? "#131315" : "#ffffff",
    border:       darkMode ? "#1f1f22" : "#e0e0e0",
    rowBorder:    darkMode ? "#111113" : "#eeeeee",
    sectionLabel: darkMode ? "#555555" : "#999999",
    labelText:    darkMode ? "#d4d4d0" : "#111111",
    subText:      darkMode ? "#555555" : "#888888",
    inputBg:      darkMode ? "#0e0e10" : "#f5f5f5",
    inputBorder:  darkMode ? "#2a2a2e" : "#d0d0d0",
    inputText:    darkMode ? "#e8e8e6" : "#111111",
    btnBorder:    darkMode ? "#3a3a3e" : "#d0d0d0",
    btnText:      darkMode ? "#888888" : "#444444",
    saveBg:       darkMode ? "#e8e8e6" : "#111111",
    saveText:     darkMode ? "#0a0a0c" : "#ffffff",
    eyeBtnBorder: darkMode ? "#2a2a2e" : "#d0d0d0",
    eyeBtnColor:  darkMode ? "#666666" : "#888888",
  };

  const inputStyle = {
    background: t.inputBg,
    border: `0.5px solid ${t.inputBorder}`,
    color: t.inputText,
    padding: "6px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    width: "160px",
  };

  return (
    <div style={{ width: "100%", height: "100%", overflowY: "auto", padding: "24px", boxSizing: "border-box" }}>
      <Section title="PROFILE" t={t}>
        <Row label="Name" sub="Your display name" t={t}><input defaultValue="Vishesh" style={inputStyle} /></Row>
        <Row label="Email" sub="Used for escalation reports" t={t}><input defaultValue="admin@onyx.app" style={inputStyle} /></Row>
      </Section>

      <Section title="SYSTEM" t={t}>
        <Row label="Dark mode" sub="Toggle light/dark theme" t={t}>
          <Toggle value={darkMode} onChange={onDarkModeChange} />
        </Row>
        <Row label="Language" sub="Interface language" t={t}>
          <select value={language} onChange={e => setLanguage(e.target.value)} style={inputStyle}>
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
          </select>
        </Row>
      </Section>

      <Section title="API & INTEGRATIONS" t={t}>
        <Row label="Claude API Key" sub="Used for all agent operations" t={t}>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <input type={showApiKey ? "text" : "password"} value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-ant-..." style={inputStyle} />
            <button onClick={() => setShowApiKey(!showApiKey)} style={{ background: "transparent", border: `0.5px solid ${t.eyeBtnBorder}`, color: t.eyeBtnColor, padding: "6px 8px", borderRadius: "6px", cursor: "pointer" }}>
              <i className={`ti ${showApiKey ? "ti-eye-off" : "ti-eye"}`} />
            </button>
          </div>
        </Row>
        <Row label="Escalation Email" sub="Issues get mailed here" t={t}>
          <input value={escalationEmail} onChange={e => setEscalationEmail(e.target.value)} placeholder="you@email.com" style={inputStyle} />
        </Row>
      </Section>

      <Section title="NOTIFICATIONS" t={t}>
        <Row label="Email alerts" sub="Get notified on new issues" t={t}>
          <Toggle value={emailAlerts} onChange={setEmailAlerts} />
        </Row>
        <Row label="Critical issues only" sub="Only alert on high severity" t={t}>
          <Toggle value={criticalOnly} onChange={setCriticalOnly} />
        </Row>
      </Section>

      <Section title="DANGER ZONE" t={t}>
        <Row label="Rollback last update" sub="Revert to previous stable version" t={t}>
          <button style={{ background: "transparent", border: `0.5px solid ${t.btnBorder}`, color: t.btnText, padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>Rollback</button>
        </Row>
        <Row label="Clear cache" sub="Reset local data and force refresh" t={t}>
          <button style={{ background: "transparent", border: "0.5px solid #3a1f1f", color: "#e24b4a", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>Clear</button>
        </Row>
      </Section>

      <button style={{ background: t.saveBg, color: t.saveText, border: "none", padding: "10px 24px", borderRadius: "6px", fontWeight: "500", fontSize: "13px", cursor: "pointer", marginBottom: "32px" }}>
        Save changes
      </button>
    </div>
  );
}
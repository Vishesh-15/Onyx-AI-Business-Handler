import { useState } from 'react';
import clientConfig from '../config/clientConfig';

const Toggle = ({ value, onChange }) => (
  <div onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 12, background: value ? '#22c55e' : '#ccc', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
    <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: value ? 23 : 3, transition: 'left 0.2s' }} />
  </div>
);

const Section = ({ title, children, t }) => (
  <div style={{ background: t.card, border: `0.5px solid ${t.border}`, borderRadius: 10, marginBottom: 16, overflow: 'hidden' }}>
    <div style={{ padding: '14px 20px', borderBottom: `0.5px solid ${t.border}`, fontSize: 11, color: t.sectionLabel, letterSpacing: '1px' }}>{title}</div>
    <div style={{ padding: '4px 0' }}>{children}</div>
  </div>
);

const Row = ({ label, sub, children, t }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `0.5px solid ${t.rowBorder}` }}>
    <div>
      <div style={{ fontSize: 13, color: t.labelText }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: t.subText, marginTop: 2 }}>{sub}</div>}
    </div>
    {children}
  </div>
);

export default function Settings({ darkMode, onDarkModeChange, accent }) {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);
  const [language, setLanguage] = useState('english');

  const t = {
    bg:           darkMode ? '#0e0e10' : '#f0f0f0',
    card:         darkMode ? '#131315' : '#ffffff',
    border:       darkMode ? '#1f1f22' : '#e0e0e0',
    rowBorder:    darkMode ? '#111113' : '#eeeeee',
    sectionLabel: darkMode ? '#555555' : '#999999',
    labelText:    darkMode ? '#d4d4d0' : '#111111',
    subText:      darkMode ? '#555555' : '#888888',
    inputBg:      darkMode ? '#0e0e10' : '#f5f5f5',
    inputBorder:  darkMode ? '#2a2a2e' : '#d0d0d0',
    inputText:    darkMode ? '#e8e8e6' : '#111111',
    saveBg:       darkMode ? '#e8e8e6' : '#111111',
    saveText:     darkMode ? '#0a0a0c' : '#ffffff',
  };

  const inputStyle = {
    background: t.inputBg,
    border: `0.5px solid ${t.inputBorder}`,
    color: t.inputText,
    padding: '6px 10px',
    borderRadius: 6,
    fontSize: 12,
    width: 180,
    outline: 'none',
  };

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto', padding: 24, boxSizing: 'border-box', background: t.bg }}>
      <Section title="PROFILE" t={t}>
        <Row label="Firm Name" sub="Your CA firm name" t={t}>
          <input defaultValue={clientConfig.clientName} style={inputStyle} />
        </Row>
        <Row label="Owner Name" sub="Primary contact" t={t}>
          <input defaultValue={clientConfig.owner.name} style={inputStyle} />
        </Row>
        <Row label="Email" sub="Used for alerts and reports" t={t}>
          <input defaultValue={clientConfig.owner.email} style={inputStyle} />
        </Row>
      </Section>

      <Section title="APPEARANCE" t={t}>
        <Row label="Dark mode" sub="Toggle light/dark theme" t={t}>
          <Toggle value={darkMode} onChange={onDarkModeChange} />
        </Row>
        <Row label="Language" sub="Interface language" t={t}>
          <select value={language} onChange={e => setLanguage(e.target.value)} style={inputStyle}>
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
          </select>
        </Row>
        <Row label="Accent Color" sub="Your brand color" t={t}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: accent, border: `1px solid ${t.inputBorder}` }} />
            <span style={{ fontSize: 12, color: t.subText, fontFamily: 'monospace' }}>{accent}</span>
          </div>
        </Row>
      </Section>

      <Section title="NOTIFICATIONS" t={t}>
        <Row label="Email alerts" sub="Get notified on new issues" t={t}>
          <Toggle value={emailNotifs} onChange={setEmailNotifs} />
        </Row>
        <Row label="Deadline alerts" sub="Reminder before due dates" t={t}>
          <Toggle value={deadlineAlerts} onChange={setDeadlineAlerts} />
        </Row>
      </Section>

      <Section title="ACCOUNT" t={t}>
        <Row label="Client UID" sub="Your unique identifier" t={t}>
          <span style={{ fontSize: 12, fontFamily: 'monospace', color: accent, background: `${accent}18`, padding: '4px 10px', borderRadius: 4 }}>
            {clientConfig.uid}
          </span>
        </Row>
        <Row label="Plan" sub="Current subscription" t={t}>
          <span style={{ fontSize: 12, color: t.labelText, textTransform: 'capitalize' }}>{clientConfig.plan}</span>
        </Row>
        <Row label="Active Modules" sub="Enabled features" t={t}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 220, justifyContent: 'flex-end' }}>
            {clientConfig.modules.map(m => (
              <span key={m} style={{ background: `${accent}18`, color: accent, fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, textTransform: 'capitalize' }}>{m}</span>
            ))}
          </div>
        </Row>
      </Section>

      <button style={{ background: t.saveBg, color: t.saveText, border: 'none', padding: '10px 24px', borderRadius: 6, fontWeight: 500, fontSize: 13, cursor: 'pointer', marginBottom: 32 }}>
        Save changes
      </button>
    </div>
  );
}
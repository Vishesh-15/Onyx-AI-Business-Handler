export default function Topbar({ title, subtitle, accent, clientName, collapsed, onToggle, darkMode, onReportIssue }) {
  const border   = darkMode ? '#1f1f22' : '#e0e0e0';
  const textMain = darkMode ? '#e8e8e6' : '#111111';
  const textMuted= darkMode ? '#555555' : '#888888';
  const bg       = darkMode ? '#0e0e10' : '#ffffff';

  return (
    <div style={{
      height: 64,
      borderBottom: `1px solid ${border}`,
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
      flexShrink: 0,
      background: bg,
    }}>
      <button onClick={onToggle} style={{ background: 'none', border: 'none', color: textMain, cursor: 'pointer', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <i className="ti ti-menu-2" style={{ fontSize: 20 }} />
      </button>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 17, fontWeight: 600, color: textMain }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: textMuted }}>{subtitle}</div>}
      </div>

      <button
        onClick={onReportIssue}
        style={{ background: 'transparent', border: '1px solid #3a1f1f', color: '#e24b4a', padding: '7px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}
      >
        <i className="ti ti-alert-circle" style={{ fontSize: 15 }} />
        Report Issue
      </button>

      <div style={{ background: `${accent}18`, border: `1px solid ${accent}44`, color: accent, padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, letterSpacing: '0.5px' }}>
        {clientName}
      </div>
    </div>
  );
}
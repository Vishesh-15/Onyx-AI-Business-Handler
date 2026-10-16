const moduleIcons = {
  dashboard: 'ti-layout-dashboard',
  clients:   'ti-users',
  deadlines: 'ti-calendar-due',
  documents: 'ti-file-check',
  reminders: 'ti-bell',
  settings:  'ti-settings',
};

const moduleLabels = {
  dashboard: 'Dashboard',
  clients:   'Clients',
  deadlines: 'Deadlines',
  documents: 'Documents',
  reminders: 'Reminders',
  settings:  'Settings',
};

export default function Sidebar({ config, accent, currentPage, onNavigate, collapsed, darkMode }) {
  const bg        = darkMode ? '#0a0a0c' : '#ffffff';
  const border    = darkMode ? '#1f1f22' : '#e0e0e0';
  const textMuted = darkMode ? '#555555' : '#888888';
  const textMain  = darkMode ? '#e8e8e6' : '#111111';
  const navHover  = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  const allModules = [...config.modules, 'settings'];

  return (
    <div style={{
      width: collapsed ? 48 : 200,
      background: bg,
      borderRight: `1px solid ${border}`,
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 16px', borderBottom: `1px solid ${border}` }}>
        {!collapsed ? (
          <>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 4, color: textMain }}>ONYX</div>
            <div style={{ fontSize: 9, letterSpacing: 2, color: textMuted, fontWeight: 500, marginTop: 4 }}>
              {config.clientName.toUpperCase()}
            </div>
          </>
        ) : (
          <div style={{ fontSize: 16, fontWeight: 700, color: textMain, textAlign: 'center' }}>O</div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
        {allModules.map(mod => {
          const isActive = currentPage === mod;
          return (
            <div
              key={mod}
              onClick={() => onNavigate(mod)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: collapsed ? '10px 0' : '10px 16px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                cursor: 'pointer',
                fontSize: 14,
                color: isActive ? accent : textMain,
                background: isActive ? `${accent}18` : 'transparent',
                borderLeft: isActive ? `2px solid ${accent}` : '2px solid transparent',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = navHover; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <i className={`ti ${moduleIcons[mod] || 'ti-circle'}`} style={{ fontSize: 18, width: 18, textAlign: 'center', flexShrink: 0 }} />
              {!collapsed && <span style={{ fontWeight: isActive ? 600 : 400 }}>{moduleLabels[mod] || mod}</span>}
            </div>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: 16, borderTop: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#fff', flexShrink: 0 }}>
          {config.owner.name.charAt(0)}
        </div>
        {!collapsed && (
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: textMain, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{config.owner.name}</div>
            <div style={{ fontSize: 11, color: textMuted }}>{config.plan}</div>
          </div>
        )}
      </div>
    </div>
  );
}
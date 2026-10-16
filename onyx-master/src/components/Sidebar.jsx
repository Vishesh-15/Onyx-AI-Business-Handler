export const Sidebar = ({ collapsed, currentPage, onNavigate }) => {
  const navItems = [
    {
      section: 'OVERVIEW',
      items: [
        { id: 'dashboard', icon: 'ti-layout-dashboard', label: 'Dashboard' },
        { id: 'clients', icon: 'ti-users', label: 'Clients' }
      ]
    },
    {
      section: 'SYSTEM',
      items: [
        { id: 'agents', icon: 'ti-robot', label: 'Agents' },
        { id: 'reports', icon: 'ti-file-text', label: 'Reports', badge: 3 },
        { id: 'logs', icon: 'ti-list-details', label: 'Logs' }
      ]
    },
    {
      section: 'ACCOUNT',
      items: [
        { id: 'billing', icon: 'ti-credit-card', label: 'Billing' },
        { id: 'settings', icon: 'ti-settings', label: 'Settings' }
      ]
    }
  ];

  return (
    <div className={`onyx-sidebar ${collapsed ? 'collapsed' : 'expanded'}`}>
      <div className="onyx-logo">
        <div className="onyx-logo-text">ONYX</div>
        <div className="onyx-logo-subtitle">MASTER CONTROL</div>
      </div>

      <div className="onyx-nav">
        {navItems.map((section, idx) => (
          <div key={idx} className="onyx-nav-section">
            <div className="onyx-nav-heading">{section.section}</div>
            {section.items.map((item) => (
              <div
                key={item.id}
                className={`onyx-nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
                data-testid={`nav-${item.id}`}
              >
                <i className={`ti ${item.icon}`}></i>
                <span>{item.label}</span>
                {item.badge && <span className="onyx-nav-badge">{item.badge}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="onyx-user">
        <div className="onyx-user-avatar">V</div>
        <div className="onyx-user-info">
          <div className="onyx-user-name">Vishesh</div>
          <div className="onyx-user-role">Admin</div>
        </div>
      </div>
    </div>
  );
};
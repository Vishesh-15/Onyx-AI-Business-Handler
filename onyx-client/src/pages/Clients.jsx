import { useState, useMemo } from 'react';
import { caClients } from '../caData';

const statusColor = { filed: '#3a9e75', pending: '#e0952a', in_progress: '#3a9e75', overdue: '#e24b4a' };
const statusLabel = { filed: 'Filed', pending: 'Pending', in_progress: 'In Progress', overdue: 'Overdue' };

export default function Clients({ accent, darkMode }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selected, setSelected] = useState(null);

  const t = {
    bg:       darkMode ? '#0e0e10' : '#f0f0f0',
    card:     darkMode ? '#131315' : '#ffffff',
    border:   darkMode ? '#1f1f22' : '#e0e0e0',
    text:     darkMode ? '#e8e8e6' : '#111111',
    muted:    darkMode ? '#555555' : '#888888',
    input:    darkMode ? '#0e0e10' : '#f5f5f5',
    inputBorder: darkMode ? '#2a2a2e' : '#d0d0d0',
    theadBg:  darkMode ? '#0a0a0c' : '#f8f8f8',
    rowHover: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
  };

  const filtered = useMemo(() => {
    return caClients.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.pan && c.pan.toLowerCase().includes(search.toLowerCase()));
      const matchStatus = filterStatus === 'all' || c.status === filterStatus;
      const matchType   = filterType === 'all'   || c.type === filterType;
      return matchSearch && matchStatus && matchType;
    });
  }, [search, filterStatus, filterType]);

  const selectStyle = {
    background: t.input, border: `1px solid ${t.inputBorder}`,
    color: t.text, padding: '7px 12px', borderRadius: 6, fontSize: 13, cursor: 'pointer', outline: 'none',
  };

  if (selected) {
    const client = caClients.find(c => c.id === selected);
    return (
      <div style={{ padding: 24, background: t.bg, minHeight: '100%' }}>
        <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: 'none', color: t.muted, cursor: 'pointer', fontSize: 13, padding: 0, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
          <i className="ti ti-arrow-left" /> Back to Clients
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: `${accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: accent }}>
            {client.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: t.text }}>{client.name}</div>
            <div style={{ fontSize: 12, color: t.muted }}>{client.type} · {client.email}</div>
          </div>
          <span style={{ marginLeft: 'auto', background: `${statusColor[client.status]}18`, color: statusColor[client.status], fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 6 }}>
            {statusLabel[client.status]}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${t.border}`, fontSize: 13, fontWeight: 600, color: t.text }}>Contact Info</div>
            {[
              { label: 'Phone', value: client.phone, icon: 'ti-phone' },
              { label: 'Email', value: client.email, icon: 'ti-mail' },
              { label: 'PAN', value: client.pan, icon: 'ti-id-badge' },
              { label: 'GST No.', value: client.gstNo || 'Not registered', icon: 'ti-receipt' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: `1px solid ${t.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: t.muted, fontSize: 13 }}>
                  <i className={`ti ${row.icon}`} style={{ fontSize: 15 }} /> {row.label}
                </div>
                <span style={{ fontSize: 13, color: t.text, fontFamily: row.label === 'PAN' || row.label === 'GST No.' ? 'monospace' : 'inherit' }}>{row.value}</span>
              </div>
            ))}
          </div>
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${t.border}`, fontSize: 13, fontWeight: 600, color: t.text }}>Filing Status</div>
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${statusColor[client.status]}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="ti ti-file-text" style={{ fontSize: 20, color: statusColor[client.status] }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>ITR / GST Status</div>
                  <div style={{ fontSize: 13, color: statusColor[client.status], fontWeight: 500 }}>{statusLabel[client.status]}</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: t.muted }}>
                Pending Documents: <span style={{ color: client.pendingDocs > 0 ? '#e0952a' : '#3a9e75', fontWeight: 600 }}>{client.pendingDocs > 0 ? `${client.pendingDocs} pending` : 'All received'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, background: t.bg, minHeight: '100%' }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: t.input, border: `1px solid ${t.inputBorder}`, borderRadius: 6, padding: '7px 12px', flex: 1, minWidth: 180 }}>
          <i className="ti ti-search" style={{ color: t.muted, fontSize: 15 }} />
          <input placeholder="Search by name, email, PAN..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ background: 'none', border: 'none', color: t.text, fontSize: 13, outline: 'none', width: '100%' }} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selectStyle}>
          <option value="all">All Status</option>
          <option value="filed">Filed</option>
          <option value="in_progress">In Progress</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} style={selectStyle}>
          <option value="all">All Types</option>
          <option value="Individual">Individual</option>
          <option value="Business">Business</option>
        </select>
      </div>

      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: t.text }}>Clients</span>
          <span style={{ fontSize: 12, color: t.muted }}>{filtered.length} of {caClients.length}</span>
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: t.muted, fontSize: 13 }}>
            <i className="ti ti-search" style={{ fontSize: 32, display: 'block', marginBottom: 12, opacity: 0.4 }} />
            No clients found
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: t.theadBg }}>
                {['Client', 'Type', 'PAN', 'GST Registered', 'Status', 'Pending Docs', 'Action'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '11px 20px', fontSize: 11, fontWeight: 600, color: t.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => (
                <tr key={client.id}
                  style={{ borderTop: `1px solid ${t.border}`, transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = t.rowHover}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{client.name}</div>
                    <div style={{ fontSize: 11, color: t.muted }}>{client.email}</div>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: t.muted }}>{client.type}</td>
                  <td style={{ padding: '14px 20px', fontSize: 12, fontFamily: 'monospace', color: t.muted }}>{client.pan}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: client.gstNo ? '#3a9e75' : t.muted }}>
                    {client.gstNo ? '✓ Yes' : '✗ No'}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ background: `${statusColor[client.status]}18`, color: statusColor[client.status], fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 5, width: 'fit-content' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor[client.status] }} />
                      {statusLabel[client.status]}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    {client.pendingDocs > 0
                      ? <span style={{ color: '#e0952a', fontWeight: 600, fontSize: 13 }}>{client.pendingDocs} pending</span>
                      : <span style={{ color: '#3a9e75', fontSize: 13 }}>✓ Complete</span>}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <button onClick={() => setSelected(client.id)}
                      style={{ background: 'transparent', border: `1px solid ${t.border}`, color: t.text, padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <i className="ti ti-eye" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
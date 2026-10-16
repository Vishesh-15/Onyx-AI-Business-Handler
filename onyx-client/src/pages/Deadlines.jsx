import { useState, useMemo } from 'react';
import { deadlines } from '../caData';

const statusColor = { upcoming: '#3a9e75', due_today: '#e0952a', overdue: '#e24b4a' };
const statusLabel = { upcoming: 'Upcoming', due_today: 'Due Today', overdue: 'Overdue' };
const typeColor   = { GST: '#6c63ff', ITR: '#3a9e75', TDS: '#e0952a', Tax: '#e24b4a' };

export default function Deadlines({ accent, darkMode }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType]     = useState('all');
  const [search, setSearch]             = useState('');
  const [localDeadlines, setLocalDeadlines] = useState(deadlines);

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
    dateBg:   darkMode ? '#0a0a0c' : '#ebebeb',
  };

  const filtered = useMemo(() => {
    return localDeadlines.filter(d => {
      const matchStatus = filterStatus === 'all' || d.status === filterStatus;
      const matchType   = filterType === 'all'   || d.type === filterType;
      const matchSearch = !search ||
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.client.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchType && matchSearch;
    });
  }, [localDeadlines, filterStatus, filterType, search]);

  const markDone = (id) => {
    setLocalDeadlines(prev => prev.map(d => d.id === id ? { ...d, status: 'upcoming', title: d.title + ' ✓' } : d));
  };

  const selectStyle = {
    background: t.input, border: `1px solid ${t.inputBorder}`,
    color: t.text, padding: '7px 12px', borderRadius: 6, fontSize: 13, cursor: 'pointer', outline: 'none',
  };

  const overdueCount  = localDeadlines.filter(d => d.status === 'overdue').length;
  const dueTodayCount = localDeadlines.filter(d => d.status === 'due_today').length;
  const upcomingCount = localDeadlines.filter(d => d.status === 'upcoming').length;

  return (
    <div style={{ padding: 24, background: t.bg, minHeight: '100%' }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Overdue', value: overdueCount, icon: 'ti-alert-circle', color: '#e24b4a' },
          { label: 'Due Today', value: dueTodayCount, icon: 'ti-clock', color: '#e0952a' },
          { label: 'Upcoming', value: upcomingCount, icon: 'ti-calendar', color: '#3a9e75' },
        ].map(s => (
          <div key={s.label} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className={`ti ${s.icon}`} style={{ fontSize: 22, color: s.color }} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: t.muted, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: t.text }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: t.input, border: `1px solid ${t.inputBorder}`, borderRadius: 6, padding: '7px 12px', flex: 1, minWidth: 180 }}>
          <i className="ti ti-search" style={{ color: t.muted, fontSize: 15 }} />
          <input placeholder="Search by title or client..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ background: 'none', border: 'none', color: t.text, fontSize: 13, outline: 'none', width: '100%' }} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selectStyle}>
          <option value="all">All Status</option>
          <option value="overdue">Overdue</option>
          <option value="due_today">Due Today</option>
          <option value="upcoming">Upcoming</option>
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} style={selectStyle}>
          <option value="all">All Types</option>
          <option value="GST">GST</option>
          <option value="ITR">ITR</option>
          <option value="TDS">TDS</option>
          <option value="Tax">Tax</option>
        </select>
      </div>

      {/* Deadlines Table */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: t.text }}>Filing Deadlines</span>
          <span style={{ fontSize: 12, color: t.muted }}>{filtered.length} deadlines</span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: t.muted, fontSize: 13 }}>
            <i className="ti ti-calendar-check" style={{ fontSize: 36, display: 'block', marginBottom: 12, opacity: 0.3 }} />
            No deadlines found
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: t.theadBg }}>
                {['Filing', 'Client', 'Type', 'Due Date', 'Status', 'Action'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '11px 20px', fontSize: 11, fontWeight: 600, color: t.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id}
                  style={{ borderTop: `1px solid ${t.border}`, transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = t.rowHover}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: d.status === 'overdue' ? '#e24b4a' : t.text }}>{d.title}</div>
                    <div style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>{d.description}</div>
                  </td>

                  <td style={{ padding: '14px 20px', fontSize: 13, color: t.text }}>{d.client}</td>

                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ background: `${typeColor[d.type] || accent}18`, color: typeColor[d.type] || accent, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 4 }}>
                      {d.type}
                    </span>
                  </td>

                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: 13, fontFamily: 'monospace', color: d.status === 'overdue' ? '#e24b4a' : t.text, fontWeight: d.status === 'overdue' ? 600 : 400 }}>
                      {d.dueDate}
                    </span>
                  </td>

                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ background: `${statusColor[d.status]}18`, color: statusColor[d.status], fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 5, width: 'fit-content' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor[d.status] }} />
                      {statusLabel[d.status]}
                    </span>
                  </td>

                  <td style={{ padding: '14px 20px' }}>
                    <button onClick={() => markDone(d.id)}
                      style={{ background: 'transparent', border: `1px solid #3a9e75`, color: '#3a9e75', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
                      <i className="ti ti-check" /> Mark Done
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
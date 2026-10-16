import { useState, useMemo } from 'react';
import { issues, clients } from '../dummyData';

const severityColor = { critical: '#e24b4a', warning: '#e0952a', info: '#3a9e75' };
const priorityColor = { P1: '#e24b4a', P2: '#e0952a', P3: '#3a9e75' };
const statusColor = { open: '#e0952a', resolved: '#3a9e75' };

export default function Reports({ darkMode }) {
  const [localIssues, setLocalIssues] = useState(issues);
  const [filterClient, setFilterClient] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const t = {
    bg:      darkMode ? '#0e0e10' : '#f0f0f0',
    card:    darkMode ? '#131315' : '#ffffff',
    border:  darkMode ? '#1f1f22' : '#e0e0e0',
    text:    darkMode ? '#e8e8e6' : '#111111',
    muted:   darkMode ? '#555555' : '#888888',
    input:   darkMode ? '#0e0e10' : '#f5f5f5',
    inputBorder: darkMode ? '#2a2a2e' : '#d0d0d0',
    rowHover: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    theadBg: darkMode ? '#0a0a0c' : '#f8f8f8',
  };

  const clientOptions = useMemo(() => {
    const unique = [...new Set(localIssues.map(i => i.clientUid))];
    return unique.map(uid => ({ uid, name: clients.find(c => c.uid === uid)?.name || uid }));
  }, [localIssues]);

  const filtered = useMemo(() => {
    return localIssues.filter(issue => {
      const matchClient = filterClient === 'all' || issue.clientUid === filterClient;
      const matchStatus = filterStatus === 'all' || issue.status === filterStatus;
      const matchPriority = filterPriority === 'all' || issue.priority === filterPriority;
      const matchSearch = issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.client.toLowerCase().includes(searchQuery.toLowerCase());
      return matchClient && matchStatus && matchPriority && matchSearch;
    });
  }, [localIssues, filterClient, filterStatus, filterPriority, searchQuery]);

  const markResolved = (id) => {
    setLocalIssues(prev => prev.map(i => i.id === id ? { ...i, status: 'resolved' } : i));
  };

  const exportCSV = () => {
    const headers = ['UID', 'Client', 'Client UID', 'Description', 'Severity', 'Priority', 'Status', 'Assigned To', 'Time'];
    const rows = filtered.map(i => [i.uid, i.client, i.clientUid, `"${i.description}"`, i.severity, i.priority, i.status, i.assignedTo, i.time]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'onyx-issues-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectStyle = {
    background: t.input, border: `1px solid ${t.inputBorder}`, color: t.text,
    padding: '7px 12px', borderRadius: 6, fontSize: 13, cursor: 'pointer', outline: 'none',
  };

  const openCount = localIssues.filter(i => i.status === 'open').length;
  const p1Count = localIssues.filter(i => i.priority === 'P1' && i.status === 'open').length;
  const resolvedCount = localIssues.filter(i => i.status === 'resolved').length;

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto', padding: 24, boxSizing: 'border-box', background: t.bg }}>

      {/* Stats Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Issues', value: localIssues.length, icon: 'ti-file-report', color: '#3a9e75' },
          { label: 'Open Issues', value: openCount, icon: 'ti-alert-circle', color: '#e0952a' },
          { label: 'P1 Critical Open', value: p1Count, icon: 'ti-flame', color: '#e24b4a' },
          { label: 'Resolved', value: resolvedCount, icon: 'ti-circle-check', color: '#3a9e75' },
        ].map(s => (
          <div key={s.label} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <i className={`ti ${s.icon}`} style={{ color: s.color, fontSize: 16 }} />
              <span style={{ fontSize: 12, color: t.muted }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: t.text }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters + Export */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, padding: '16px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: t.input, border: `1px solid ${t.inputBorder}`, borderRadius: 6, padding: '7px 12px', flex: 1, minWidth: 200 }}>
          <i className="ti ti-search" style={{ color: t.muted, fontSize: 15 }} />
          <input
            placeholder="Search issues..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ background: 'none', border: 'none', color: t.text, fontSize: 13, outline: 'none', width: '100%' }}
          />
        </div>

        {/* Client Filter */}
        <select value={filterClient} onChange={e => setFilterClient(e.target.value)} style={selectStyle}>
          <option value="all">All Clients</option>
          {clientOptions.map(c => <option key={c.uid} value={c.uid}>{c.name}</option>)}
        </select>

        {/* Status Filter */}
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selectStyle}>
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>

        {/* Priority Filter */}
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={selectStyle}>
          <option value="all">All Priority</option>
          <option value="P1">P1 — Critical</option>
          <option value="P2">P2 — High</option>
          <option value="P3">P3 — Normal</option>
        </select>

        {/* Export */}
        <button onClick={exportCSV} style={{ background: '#3a9e75', border: 'none', color: '#fff', padding: '7px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <i className="ti ti-download" /> Export CSV
        </button>
      </div>

      {/* Issues Table */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: t.text }}>Issues</span>
          <span style={{ fontSize: 12, color: t.muted }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: t.muted, fontSize: 13 }}>
            <i className="ti ti-search" style={{ fontSize: 32, display: 'block', marginBottom: 12, opacity: 0.4 }} />
            No issues match your filters
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: t.theadBg }}>
                {['Issue', 'Client', 'Severity', 'Priority', 'Assigned To', 'Time', 'Status', 'Action'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '11px 20px', fontSize: 11, fontWeight: 600, color: t.muted, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((issue) => (
                <tr key={issue.id}
                  style={{ borderTop: `1px solid ${t.border}`, transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = t.rowHover}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                  {/* Issue UID + Description */}
                  <td style={{ padding: '14px 20px', maxWidth: 260 }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 11, color: severityColor[issue.severity], fontWeight: 700, marginBottom: 4 }}>{issue.uid}</div>
                    <div style={{ fontSize: 13, color: t.text, lineHeight: 1.4 }}>{issue.description}</div>
                  </td>

                  {/* Client */}
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontSize: 13, color: t.text, fontWeight: 500 }}>{issue.client}</div>
                    <div style={{ fontSize: 11, fontFamily: 'monospace', color: t.muted }}>{issue.clientUid}</div>
                  </td>

                  {/* Severity Badge */}
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ background: `${severityColor[issue.severity]}18`, color: severityColor[issue.severity], fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {issue.severity}
                    </span>
                  </td>

                  {/* Priority */}
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ background: `${priorityColor[issue.priority]}18`, color: priorityColor[issue.priority], fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 4 }}>
                      {issue.priority}
                    </span>
                  </td>

                  {/* Assigned To */}
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%',
                        background: issue.assignedTo === 'Vishesh' ? '#3a9e75' : issue.assignedTo === 'Omm' ? '#6c63ff' : '#444',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                        {issue.assignedTo === 'Vishesh' ? 'V' : issue.assignedTo === 'Omm' ? 'O' : 'A'}
                      </div>
                      <span style={{ fontSize: 13, color: t.text }}>{issue.assignedTo}</span>
                    </div>
                  </td>

                  {/* Time */}
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: 12, color: t.muted }}>{issue.time}</span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ background: `${statusColor[issue.status]}18`, color: statusColor[issue.status], fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 5, width: 'fit-content' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor[issue.status] }} />
                      {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                    </span>
                  </td>

                  {/* Action */}
                  <td style={{ padding: '14px 20px' }}>
                    {issue.status === 'open' ? (
                      <button
                        onClick={() => markResolved(issue.id)}
                        style={{ background: 'transparent', border: `1px solid #3a9e75`, color: '#3a9e75', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
                        <i className="ti ti-check" /> Resolve
                      </button>
                    ) : (
                      <span style={{ fontSize: 12, color: t.muted, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <i className="ti ti-circle-check" style={{ color: '#3a9e75' }} /> Done
                      </span>
                    )}
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
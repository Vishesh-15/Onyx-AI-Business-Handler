import { useState, useMemo } from 'react';
import { logs, clients } from '../dummyData';

const typeColor = { success: '#3a9e75', warning: '#e0952a', error: '#e24b4a' };
const typeIcon  = { success: 'ti-circle-check', warning: 'ti-alert-triangle', error: 'ti-circle-x' };
const typeBg    = { success: 'rgba(58,158,117,0.12)', warning: 'rgba(224,149,42,0.12)', error: 'rgba(226,75,74,0.12)' };

function formatTimestamp(ts) {
  const d = new Date(ts);
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true });
}

function toDateOnly(ts) {
  return ts.split('T')[0];
}

export default function Logs({ darkMode }) {
  const [localLogs, setLocalLogs] = useState(logs);
  const [filterClient, setFilterClient] = useState('all');
  const [filterType, setFilterType]     = useState('all');
  const [filterAgent, setFilterAgent]   = useState('all');
  const [searchQuery, setSearchQuery]   = useState('');
  const [dateFrom, setDateFrom]         = useState('');
  const [dateTo, setDateTo]             = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const t = {
    bg:          darkMode ? '#0e0e10' : '#f0f0f0',
    card:        darkMode ? '#131315' : '#ffffff',
    border:      darkMode ? '#1f1f22' : '#e0e0e0',
    text:        darkMode ? '#e8e8e6' : '#111111',
    muted:       darkMode ? '#555555' : '#888888',
    input:       darkMode ? '#0e0e10' : '#f5f5f5',
    inputBorder: darkMode ? '#2a2a2e' : '#d0d0d0',
    timelineLine:darkMode ? '#1f1f22' : '#e0e0e0',
    dateBg:      darkMode ? '#0a0a0c' : '#ebebeb',
  };

  const agentOptions = useMemo(() => [...new Set(logs.map(l => l.agent))], []);
  const clientOptions = useMemo(() => clients.map(c => ({ uid: c.uid, name: c.name })), []);

  const filtered = useMemo(() => {
    return localLogs.filter(log => {
      const matchClient = filterClient === 'all' || log.clientUid === filterClient;
      const matchType   = filterType === 'all'   || log.type === filterType;
      const matchAgent  = filterAgent === 'all'  || log.agent === filterAgent;
      const matchSearch = !searchQuery ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.clientUid.toLowerCase().includes(searchQuery.toLowerCase());
      const logDate = toDateOnly(log.timestamp);
      const matchFrom = !dateFrom || logDate >= dateFrom;
      const matchTo   = !dateTo   || logDate <= dateTo;
      return matchClient && matchType && matchAgent && matchSearch && matchFrom && matchTo;
    });
  }, [localLogs, filterClient, filterType, filterAgent, searchQuery, dateFrom, dateTo]);

  // Group by date for timeline
  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach(log => {
      const date = toDateOnly(log.timestamp);
      if (!groups[date]) groups[date] = [];
      groups[date].push(log);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const clearLogs = () => {
    setLocalLogs([]);
    setShowClearConfirm(false);
  };

  const selectStyle = {
    background: t.input, border: `1px solid ${t.inputBorder}`,
    color: t.text, padding: '7px 12px', borderRadius: 6, fontSize: 13, cursor: 'pointer', outline: 'none',
  };

  const inputStyle = {
    background: t.input, border: `1px solid ${t.inputBorder}`,
    color: t.text, padding: '7px 12px', borderRadius: 6, fontSize: 13, outline: 'none',
  };

  // Stats
  const successCount = localLogs.filter(l => l.type === 'success').length;
  const warningCount = localLogs.filter(l => l.type === 'warning').length;
  const errorCount   = localLogs.filter(l => l.type === 'error').length;

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto', padding: 24, boxSizing: 'border-box', background: t.bg }}>

      {/* Stats Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Logs', value: localLogs.length, icon: 'ti-list', color: '#3a9e75' },
          { label: 'Success', value: successCount, icon: 'ti-circle-check', color: '#3a9e75' },
          { label: 'Warnings', value: warningCount, icon: 'ti-alert-triangle', color: '#e0952a' },
          { label: 'Errors', value: errorCount, icon: 'ti-circle-x', color: '#e24b4a' },
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

      {/* Filters */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, padding: '16px 20px', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>

          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: t.input, border: `1px solid ${t.inputBorder}`, borderRadius: 6, padding: '7px 12px', flex: 1, minWidth: 180 }}>
            <i className="ti ti-search" style={{ color: t.muted, fontSize: 15 }} />
            <input placeholder="Search logs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ background: 'none', border: 'none', color: t.text, fontSize: 13, outline: 'none', width: '100%' }} />
          </div>

          {/* Client */}
          <select value={filterClient} onChange={e => setFilterClient(e.target.value)} style={selectStyle}>
            <option value="all">All Clients</option>
            {clientOptions.map(c => <option key={c.uid} value={c.uid}>{c.name}</option>)}
          </select>

          {/* Type */}
          <select value={filterType} onChange={e => setFilterType(e.target.value)} style={selectStyle}>
            <option value="all">All Types</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>

          {/* Agent */}
          <select value={filterAgent} onChange={e => setFilterAgent(e.target.value)} style={selectStyle}>
            <option value="all">All Agents</option>
            {agentOptions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>

          {/* Date From */}
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={inputStyle} />

          {/* Date To */}
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={inputStyle} />

          {/* Clear Logs */}
          {!showClearConfirm ? (
            <button onClick={() => setShowClearConfirm(true)}
              style={{ background: 'transparent', border: '1px solid #3a1f1f', color: '#e24b4a', padding: '7px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <i className="ti ti-trash" /> Clear Logs
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: t.muted }}>Sure?</span>
              <button onClick={clearLogs}
                style={{ background: '#e24b4a', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                Yes, clear
              </button>
              <button onClick={() => setShowClearConfirm(false)}
                style={{ background: 'transparent', border: `1px solid ${t.inputBorder}`, color: t.muted, padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Active filter count */}
        <div style={{ marginTop: 10, fontSize: 12, color: t.muted }}>
          Showing {filtered.length} of {localLogs.length} log{localLogs.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Timeline */}
      {localLogs.length === 0 ? (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, padding: 60, textAlign: 'center', color: t.muted }}>
          <i className="ti ti-list" style={{ fontSize: 40, display: 'block', marginBottom: 12, opacity: 0.3 }} />
          <p style={{ fontSize: 14, margin: 0 }}>Logs cleared</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, padding: 60, textAlign: 'center', color: t.muted }}>
          <i className="ti ti-search" style={{ fontSize: 40, display: 'block', marginBottom: 12, opacity: 0.3 }} />
          <p style={{ fontSize: 14, margin: 0 }}>No logs match your filters</p>
        </div>
      ) : (
        grouped.map(([date, dateLogs]) => (
          <div key={date} style={{ marginBottom: 24 }}>
            {/* Date separator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ height: 1, flex: 1, background: t.border }} />
              <span style={{ background: t.dateBg, border: `1px solid ${t.border}`, color: t.muted, fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20, letterSpacing: '0.5px' }}>
                {new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <div style={{ height: 1, flex: 1, background: t.border }} />
            </div>

            {/* Log entries */}
            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden' }}>
              {dateLogs.map((log, i) => (
                <div key={log.id} style={{ display: 'flex', gap: 0, borderBottom: i < dateLogs.length - 1 ? `1px solid ${t.border}` : 'none' }}>

                  {/* Color bar */}
                  <div style={{ width: 3, background: typeColor[log.type], flexShrink: 0 }} />

                  {/* Content */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 20px', flex: 1 }}>

                    {/* Icon */}
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: typeBg[log.type], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <i className={`ti ${typeIcon[log.type]}`} style={{ fontSize: 16, color: typeColor[log.type] }} />
                    </div>

                    {/* Main */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{log.agent}</span>
                        <span style={{ fontSize: 11, color: t.muted }}>•</span>
                        <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#3a9e75' }}>{log.clientUid}</span>
                        <span style={{ fontSize: 11, color: t.muted }}>{log.client}</span>
                        <span style={{ background: typeBg[log.type], color: typeColor[log.type], fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.5px', marginLeft: 'auto' }}>
                          {log.type}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: log.type === 'error' ? '#e24b4a' : log.type === 'warning' ? '#e0952a' : t.text, lineHeight: 1.5 }}>
                        {log.action}
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div style={{ fontSize: 11, color: t.muted, flexShrink: 0, fontFamily: 'monospace', marginTop: 2 }}>
                      {formatTimestamp(log.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
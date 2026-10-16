import { useState, useMemo } from 'react';

const agentsData = [
  { id: 1, name: 'Analytics Agent', status: 'healthy', client: 'TechCorp Industries', clientUid: 'TC-8492-X', lastActive: '2 min ago', uptime: '99.9%', version: 'v2.4.1' },
  { id: 2, name: 'Automation Agent', status: 'healthy', client: 'TechCorp Industries', clientUid: 'TC-8492-X', lastActive: '5 min ago', uptime: '99.7%', version: 'v2.4.1' },
  { id: 3, name: 'Security Agent', status: 'degraded', client: 'TechCorp Industries', clientUid: 'TC-8492-X', lastActive: '18 min ago', uptime: '91.2%', version: 'v2.3.8' },
  { id: 4, name: 'Analytics Agent', status: 'healthy', client: 'StartupHub', clientUid: 'SH-2847-A', lastActive: '1 min ago', uptime: '98.5%', version: 'v2.4.1' },
  { id: 5, name: 'Support Agent', status: 'healthy', client: 'StartupHub', clientUid: 'SH-2847-A', lastActive: '8 min ago', uptime: '99.1%', version: 'v2.4.0' },
  { id: 6, name: 'Analytics Agent', status: 'healthy', client: 'Global Solutions', clientUid: 'GS-9201-F', lastActive: '3 min ago', uptime: '97.8%', version: 'v2.4.1' },
  { id: 7, name: 'Automation Agent', status: 'degraded', client: 'Global Solutions', clientUid: 'GS-9201-F', lastActive: '42 min ago', uptime: '88.3%', version: 'v2.3.8' },
  { id: 8, name: 'Support Agent', status: 'healthy', client: 'Global Solutions', clientUid: 'GS-9201-F', lastActive: '6 min ago', uptime: '99.4%', version: 'v2.4.0' },
  { id: 9, name: 'Security Agent', status: 'critical', client: 'Global Solutions', clientUid: 'GS-9201-F', lastActive: '2 hrs ago', uptime: '61.0%', version: 'v2.3.5' },
  { id: 10, name: 'Automation Agent', status: 'healthy', client: 'CloudSync', clientUid: 'CS-3756-M', lastActive: '4 min ago', uptime: '99.2%', version: 'v2.4.1' },
  { id: 11, name: 'Security Agent', status: 'healthy', client: 'CloudSync', clientUid: 'CS-3756-M', lastActive: '11 min ago', uptime: '98.9%', version: 'v2.4.0' },
  { id: 12, name: 'Monitoring Agent', status: 'critical', client: 'DataVault Inc', clientUid: 'DV-1029-P', lastActive: '3 hrs ago', uptime: '42.1%', version: 'v2.3.2' },
  { id: 13, name: 'Analytics Agent', status: 'healthy', client: 'NextGen Systems', clientUid: 'NG-4821-R', lastActive: '7 min ago', uptime: '99.6%', version: 'v2.4.1' },
  { id: 14, name: 'Automation Agent', status: 'healthy', client: 'NextGen Systems', clientUid: 'NG-4821-R', lastActive: '9 min ago', uptime: '99.3%', version: 'v2.4.1' },
  { id: 15, name: 'Support Agent', status: 'healthy', client: 'Innovate Labs', clientUid: 'IL-6734-W', lastActive: '15 min ago', uptime: '97.1%', version: 'v2.4.0' },
];

const statusConfig = {
  healthy:  { color: '#3a9e75', bg: 'rgba(58,158,117,0.12)',  border: 'rgba(58,158,117,0.2)',  label: 'Healthy' },
  degraded: { color: '#e0952a', bg: 'rgba(224,149,42,0.12)', border: 'rgba(224,149,42,0.2)',  label: 'Degraded' },
  critical: { color: '#e24b4a', bg: 'rgba(226,75,74,0.12)',  border: 'rgba(226,75,74,0.2)',   label: 'Critical' },
};

export default function Agents({ darkMode }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [agentStates, setAgentStates] = useState({}); // per-agent: 'restarting' | 'disabled'
  const [bulkModal, setBulkModal] = useState(false);
  const [bulkMode, setBulkMode] = useState(null); // 'all' | 'selected'
  const [restartingAll, setRestartingAll] = useState(new Set());

  const t = {
    bg:     darkMode ? '#0e0e10' : '#f4f4f6',
    card:   darkMode ? '#131315' : '#ffffff',
    card2:  darkMode ? '#0a0a0c' : '#f0f0f2',
    border: darkMode ? '#1f1f22' : '#e0e0e0',
    text:   darkMode ? '#e8e8e6' : '#111111',
    muted:  darkMode ? '#666666' : '#888888',
    hover:  darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    input:  darkMode ? '#0a0a0c' : '#f8f8f8',
  };

  const filtered = useMemo(() => {
    return agentsData.filter(a => {
      const matchFilter = filter === 'all' || a.status === filter;
      const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
                          a.client.toLowerCase().includes(search.toLowerCase()) ||
                          a.clientUid.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [filter, search]);

  const counts = useMemo(() => ({
    all:      agentsData.length,
    healthy:  agentsData.filter(a => a.status === 'healthy').length,
    degraded: agentsData.filter(a => a.status === 'degraded').length,
    critical: agentsData.filter(a => a.status === 'critical').length,
  }), []);

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleRestart = (id) => {
    setAgentStates(prev => ({ ...prev, [id]: 'restarting' }));
    setTimeout(() => setAgentStates(prev => ({ ...prev, [id]: null })), 2500);
  };

  const handleDisable = (id) => {
    setAgentStates(prev => ({ ...prev, [id]: prev[id] === 'disabled' ? null : 'disabled' }));
  };

  const handleBulkRestart = () => {
    const targets = bulkMode === 'all'
      ? filtered.map(a => a.id)
      : [...selected];
    setRestartingAll(new Set(targets));
    targets.forEach(id => {
      setAgentStates(prev => ({ ...prev, [id]: 'restarting' }));
      setTimeout(() => setAgentStates(prev => ({ ...prev, [id]: null })), 2500);
    });
    setTimeout(() => setRestartingAll(new Set()), 2500);
    setSelected(new Set());
    setBulkModal(false);
  };

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto', padding: 24, boxSizing: 'border-box', background: t.bg }}>

      {/* Stats Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Agents',    value: counts.all,      color: '#7b8cde', icon: 'ti-robot' },
          { label: 'Healthy',         value: counts.healthy,  color: '#3a9e75', icon: 'ti-circle-check' },
          { label: 'Degraded',        value: counts.degraded, color: '#e0952a', icon: 'ti-alert-triangle' },
          { label: 'Critical',        value: counts.critical, color: '#e24b4a', icon: 'ti-alert-circle' },
        ].map(s => (
          <div key={s.label} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <i className={`ti ${s.icon}`} style={{ fontSize: 16, color: s.color }} />
              <span style={{ fontSize: 12, color: t.muted }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: t.text }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: t.card, border: `1px solid ${t.border}`, borderRadius: 6, padding: '7px 12px' }}>
            <i className="ti ti-search" style={{ fontSize: 13, color: t.muted }} />
            <input
              type="text"
              placeholder="Search agents or clients..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: t.text, fontSize: 13, width: 200 }}
            />
          </div>
          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 4, background: t.card, border: `1px solid ${t.border}`, borderRadius: 6, padding: 3 }}>
            {['all', 'healthy', 'degraded', 'critical'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? (f === 'all' ? '#1f1f22' : `${statusConfig[f]?.color}22`) : 'transparent',
                  border: filter === f ? `1px solid ${f === 'all' ? t.border : statusConfig[f]?.border}` : '1px solid transparent',
                  color: filter === f ? (f === 'all' ? t.text : statusConfig[f]?.color) : t.muted,
                  padding: '5px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12,
                  fontWeight: filter === f ? 600 : 400, transition: 'all 0.15s', textTransform: 'capitalize',
                }}
              >
                {f} {f !== 'all' && <span style={{ opacity: 0.7 }}>({counts[f]})</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Restart Button */}
        <button
          onClick={() => setBulkModal(true)}
          style={{ background: 'rgba(123,140,222,0.1)', border: '1px solid rgba(123,140,222,0.3)', color: '#7b8cde', padding: '7px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <i className="ti ti-refresh" /> Bulk Restart
        </button>
      </div>

      {/* Selected bar */}
      {selected.size > 0 && (
        <div style={{ background: 'rgba(123,140,222,0.08)', border: '1px solid rgba(123,140,222,0.2)', borderRadius: 8, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: '#7b8cde' }}>{selected.size} agent{selected.size > 1 ? 's' : ''} selected</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setSelected(new Set())} style={{ background: 'transparent', border: `1px solid ${t.border}`, color: t.muted, padding: '4px 12px', borderRadius: 5, cursor: 'pointer', fontSize: 12 }}>
              Clear
            </button>
            <button
              onClick={() => { setBulkMode('selected'); setBulkModal(true); }}
              style={{ background: '#7b8cde', border: 'none', color: '#fff', padding: '4px 14px', borderRadius: 5, cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <i className="ti ti-refresh" /> Restart Selected
            </button>
          </div>
        </div>
      )}

      {/* Agent Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
        {filtered.map(agent => {
          const sc = statusConfig[agent.status];
          const state = agentStates[agent.id];
          const isSelected = selected.has(agent.id);
          const isDisabled = state === 'disabled';
          const isRestarting = state === 'restarting';

          return (
            <div
              key={agent.id}
              onClick={() => toggleSelect(agent.id)}
              style={{
                background: t.card,
                border: `1px solid ${isSelected ? '#7b8cde' : t.border}`,
                borderRadius: 10,
                padding: 18,
                cursor: 'pointer',
                transition: 'all 0.15s',
                opacity: isDisabled ? 0.5 : 1,
                boxShadow: isSelected ? '0 0 0 2px rgba(123,140,222,0.2)' : 'none',
                position: 'relative',
              }}
            >
              {/* Checkbox */}
              <div style={{
                position: 'absolute', top: 14, right: 14,
                width: 16, height: 16, borderRadius: 4,
                border: `1.5px solid ${isSelected ? '#7b8cde' : t.border}`,
                background: isSelected ? '#7b8cde' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}>
                {isSelected && <i className="ti ti-check" style={{ fontSize: 10, color: '#fff' }} />}
              </div>

              {/* Agent Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, paddingRight: 24 }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: `${sc.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="ti ti-robot" style={{ fontSize: 18, color: sc.color }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agent.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: isRestarting ? '#e0952a' : sc.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: isRestarting ? '#e0952a' : sc.color, fontWeight: 600 }}>
                      {isRestarting ? 'Restarting...' : isDisabled ? 'Disabled' : sc.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Meta */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
                {[
                  { icon: 'ti-building', label: agent.client },
                  { icon: 'ti-fingerprint', label: agent.clientUid, mono: true },
                  { icon: 'ti-clock', label: `Last active: ${agent.lastActive}` },
                  { icon: 'ti-activity', label: `Uptime: ${agent.uptime}` },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className={`ti ${row.icon}`} style={{ fontSize: 13, color: t.muted, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: t.muted, fontFamily: row.mono ? 'monospace' : 'inherit' }}>{row.label}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => handleRestart(agent.id)}
                  disabled={isRestarting || isDisabled}
                  style={{
                    flex: 1, background: isRestarting ? 'rgba(224,149,42,0.1)' : 'rgba(58,158,117,0.1)',
                    border: `1px solid ${isRestarting ? 'rgba(224,149,42,0.3)' : 'rgba(58,158,117,0.3)'}`,
                    color: isRestarting ? '#e0952a' : '#3a9e75',
                    padding: '7px 0', borderRadius: 6, cursor: isRestarting || isDisabled ? 'not-allowed' : 'pointer',
                    fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    transition: 'all 0.15s',
                  }}
                >
                  <i className={`ti ${isRestarting ? 'ti-loader-2' : 'ti-refresh'}`} style={isRestarting ? { animation: 'spin 1s linear infinite' } : {}} />
                  {isRestarting ? 'Restarting' : 'Restart'}
                </button>
                <button
                  onClick={() => handleDisable(agent.id)}
                  style={{
                    flex: 1, background: isDisabled ? 'rgba(226,75,74,0.1)' : 'transparent',
                    border: `1px solid ${isDisabled ? 'rgba(226,75,74,0.3)' : t.border}`,
                    color: isDisabled ? '#e24b4a' : t.muted,
                    padding: '7px 0', borderRadius: 6, cursor: 'pointer',
                    fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    transition: 'all 0.15s',
                  }}
                >
                  <i className={`ti ${isDisabled ? 'ti-player-play' : 'ti-player-stop'}`} />
                  {isDisabled ? 'Enable' : 'Disable'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: 60, textAlign: 'center', color: t.muted }}>
          <i className="ti ti-robot-off" style={{ fontSize: 36, display: 'block', marginBottom: 10 }} />
          <p style={{ fontSize: 13 }}>No agents found.</p>
        </div>
      )}

      {/* Spin animation */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Bulk Restart Modal */}
      {bulkModal && (
        <div
          onClick={() => { setBulkModal(false); setBulkMode(null); }}
          style={{ position: 'fixed', inset: 0, background: darkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: darkMode ? '#131315' : '#fff', border: `1px solid ${t.border}`, borderRadius: 12, padding: 28, width: 420, boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(123,140,222,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ti ti-refresh" style={{ fontSize: 20, color: '#7b8cde' }} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>Bulk Restart</div>
                <div style={{ fontSize: 12, color: t.muted }}>Choose what to restart</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {/* Restart All */}
              <div
                onClick={() => setBulkMode('all')}
                style={{ background: bulkMode === 'all' ? 'rgba(123,140,222,0.1)' : t.card2, border: `1px solid ${bulkMode === 'all' ? 'rgba(123,140,222,0.4)' : t.border}`, borderRadius: 8, padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <i className="ti ti-refresh-alert" style={{ fontSize: 18, color: bulkMode === 'all' ? '#7b8cde' : t.muted }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Restart All</div>
                    <div style={{ fontSize: 11, color: t.muted }}>Restart all {filtered.length} visible agents</div>
                  </div>
                </div>
              </div>

              {/* Restart Selected */}
              <div
                onClick={() => selected.size > 0 && setBulkMode('selected')}
                style={{ background: bulkMode === 'selected' ? 'rgba(123,140,222,0.1)' : t.card2, border: `1px solid ${bulkMode === 'selected' ? 'rgba(123,140,222,0.4)' : t.border}`, borderRadius: 8, padding: '14px 16px', cursor: selected.size > 0 ? 'pointer' : 'not-allowed', opacity: selected.size > 0 ? 1 : 0.4, transition: 'all 0.15s' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <i className="ti ti-checks" style={{ fontSize: 18, color: bulkMode === 'selected' ? '#7b8cde' : t.muted }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Restart Selected</div>
                    <div style={{ fontSize: 11, color: t.muted }}>
                      {selected.size > 0 ? `${selected.size} agent${selected.size > 1 ? 's' : ''} selected` : 'No agents selected — click cards to select'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setBulkModal(false); setBulkMode(null); }}
                style={{ background: 'transparent', border: `1px solid ${t.border}`, color: t.muted, padding: '8px 18px', borderRadius: 7, cursor: 'pointer', fontSize: 13 }}
              >
                Cancel
              </button>
              <button
                onClick={handleBulkRestart}
                disabled={!bulkMode}
                style={{ background: bulkMode ? '#7b8cde' : t.card2, border: 'none', color: bulkMode ? '#fff' : t.muted, padding: '8px 20px', borderRadius: 7, cursor: bulkMode ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s' }}
              >
                <i className="ti ti-refresh" /> Confirm Restart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
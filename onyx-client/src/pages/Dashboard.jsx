import { useState } from 'react';
import { caStats, deadlines, caClients } from '../caData';

const statusColor = { filed: '#3a9e75', pending: '#e0952a', in_progress: '#3a9e75', overdue: '#e24b4a' };
const statusLabel = { filed: 'Filed', pending: 'Pending', in_progress: 'In Progress', overdue: 'Overdue' };
const deadlineStatusColor = { upcoming: '#3a9e75', due_today: '#e0952a', overdue: '#e24b4a' };
const deadlineStatusLabel = { upcoming: 'Upcoming', due_today: 'Due Today', overdue: 'Overdue' };

const agentsList = [
  { id: 1, name: 'Reminder Agent',   icon: 'ti-bell',         task: 'Sending reminders to pending clients' },
  { id: 2, name: 'Deadline Tracker', icon: 'ti-calendar-due', task: 'Monitoring GST/ITR deadlines' },
  { id: 3, name: 'Doc Checker',      icon: 'ti-file-check',   task: 'Checking missing documents' },
  { id: 4, name: 'Report Agent',     icon: 'ti-chart-bar',    task: 'Generating client status reports' },
];

const feedColor = { success: '#3a9e75', warning: '#e0952a', error: '#e24b4a' };

export default function Dashboard({ accent, darkMode }) {
  const [activeAgents, setActiveAgents] = useState(new Set());
  const [launchingAgents, setLaunchingAgents] = useState(new Set());
  const [activityFeed, setActivityFeed] = useState([]);

  const t = {
    bg:     darkMode ? '#0e0e10' : '#f0f0f0',
    card:   darkMode ? '#131315' : '#ffffff',
    border: darkMode ? '#1f1f22' : '#e0e0e0',
    text:   darkMode ? '#e8e8e6' : '#111111',
    muted:  darkMode ? '#555555' : '#888888',
  };

  const overdueDeadlines  = deadlines.filter(d => d.status === 'overdue');
  const upcomingDeadlines = deadlines.filter(d => d.status !== 'overdue').slice(0, 3);
  const recentClients     = caClients.slice(0, 5);

  const addActivity = (agent, icon, text, type) => {
    setActivityFeed(prev => [{
      id: Date.now() + Math.random(),
      agent, icon, text, type,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }, ...prev.slice(0, 19)]);
  };

  const activateAgent = (agent) => {
    if (activeAgents.has(agent.id) || launchingAgents.has(agent.id)) return;
    setLaunchingAgents(prev => new Set([...prev, agent.id]));
    setTimeout(() => {
      setLaunchingAgents(prev => { const n = new Set(prev); n.delete(agent.id); return n; });
      setActiveAgents(prev => new Set([...prev, agent.id]));
      addActivity(agent.name, agent.icon, `${agent.name} activated — ${agent.task}`, 'success');
    }, 1200);
  };

  const deactivateAgent = (agent) => {
    setActiveAgents(prev => { const n = new Set(prev); n.delete(agent.id); return n; });
    addActivity(agent.name, agent.icon, `${agent.name} stopped by user`, 'warning');
  };

  const goLive = () => {
    const inactive = agentsList.filter(a => !activeAgents.has(a.id) && !launchingAgents.has(a.id));
    if (inactive.length === 0) return;
    inactive.forEach((agent, i) => {
      setTimeout(() => activateAgent(agent), i * 500);
    });
  };

  const stopAll = () => {
    setActiveAgents(new Set());
    setLaunchingAgents(new Set());
    addActivity('System', 'ti-player-stop', 'All agents stopped by user', 'warning');
  };

  const allLive = agentsList.every(a => activeAgents.has(a.id));
  const anyLive = agentsList.some(a => activeAgents.has(a.id) || launchingAgents.has(a.id));

  return (
    <div style={{ padding: 24, background: t.bg, minHeight: '100%' }}>

      {/* GO LIVE BANNER */}
      <div style={{
        background: allLive ? `linear-gradient(135deg, ${accent}22, ${accent}08)` : t.card,
        border: `1px solid ${allLive ? accent : t.border}`,
        borderRadius: 12, padding: '20px 24px', marginBottom: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
        transition: 'all 0.4s',
      }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 4 }}>
            {allLive ? '✦ All agents are live and working' : anyLive ? '⚡ Some agents active' : 'Ready to activate your AI agents?'}
          </div>
          <div style={{ fontSize: 13, color: t.muted }}>
            {allLive
              ? `${activeAgents.size} agents active — tracking deadlines, sending reminders, checking documents`
              : 'One click — all agents activate and start managing your clients automatically'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          {anyLive && (
            <button onClick={stopAll} style={{ background: 'transparent', border: '1px solid #3a1f1f', color: '#e24b4a', padding: '10px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="ti ti-player-stop" /> Stop All
            </button>
          )}
          <button onClick={goLive} disabled={allLive} style={{
            background: allLive ? `${accent}33` : accent,
            border: 'none', color: allLive ? accent : '#fff',
            padding: '12px 28px', borderRadius: 8,
            cursor: allLive ? 'not-allowed' : 'pointer',
            fontSize: 15, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: allLive ? 'none' : `0 4px 20px ${accent}44`,
            transition: 'all 0.3s',
          }}>
            <i className={`ti ${allLive ? 'ti-check' : 'ti-rocket'}`} />
            {allLive ? 'All Live' : 'Go Live'}
          </button>
        </div>
      </div>

      {/* Agent Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {agentsList.map(agent => {
          const isActive    = activeAgents.has(agent.id);
          const isLaunching = launchingAgents.has(agent.id);
          return (
            <div key={agent.id} style={{
              background: t.card,
              border: `1px solid ${isActive ? accent + '55' : t.border}`,
              borderRadius: 10, padding: '16px',
              transition: 'all 0.3s',
              display: 'flex', flexDirection: 'column', gap: 12,
            }}>
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: isActive ? `${accent}22` : darkMode ? '#1a1a1d' : '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                  <i className={`ti ${agent.icon}`} style={{ fontSize: 17, color: isActive ? accent : t.muted }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: isActive ? t.text : t.muted }}>{agent.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: isActive ? '#3a9e75' : isLaunching ? '#e0952a' : t.muted, boxShadow: isActive ? '0 0 6px #3a9e75' : 'none', transition: 'all 0.3s', flexShrink: 0 }} />
                    <span style={{ fontSize: 10, color: isActive ? '#3a9e75' : isLaunching ? '#e0952a' : t.muted }}>
                      {isLaunching ? 'Activating...' : isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Task */}
              <div style={{ fontSize: 11, color: t.muted, lineHeight: 1.4 }}>
                {isActive ? agent.task : 'Not running'}
              </div>

              {/* Button */}
              {isActive ? (
                <button onClick={() => deactivateAgent(agent)} style={{
                  background: 'transparent', border: '1px solid #3a1f1f',
                  color: '#e24b4a', padding: '6px 0', borderRadius: 6,
                  cursor: 'pointer', fontSize: 11, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                }}>
                  <i className="ti ti-player-stop" style={{ fontSize: 12 }} /> Stop
                </button>
              ) : (
                <button onClick={() => activateAgent(agent)} disabled={isLaunching} style={{
                  background: isLaunching ? 'transparent' : `${accent}18`,
                  border: `1px solid ${isLaunching ? t.border : accent + '55'}`,
                  color: isLaunching ? t.muted : accent,
                  padding: '6px 0', borderRadius: 6,
                  cursor: isLaunching ? 'not-allowed' : 'pointer',
                  fontSize: 11, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  transition: 'all 0.2s',
                }}>
                  <i className={`ti ${isLaunching ? 'ti-loader-2' : 'ti-player-play'}`}
                    style={{ fontSize: 12, ...(isLaunching ? { animation: 'spin 1s linear infinite' } : {}) }} />
                  {isLaunching ? 'Starting...' : 'Activate'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Stats Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Clients',    value: caStats.totalClients,   icon: 'ti-users',        color: accent },
          { label: 'Filed This Month', value: caStats.filedThisMonth, icon: 'ti-circle-check', color: '#3a9e75' },
          { label: 'Pending Filings',  value: caStats.pendingFilings, icon: 'ti-clock',         color: '#e0952a' },
          { label: 'Overdue',          value: caStats.overdueFilings, icon: 'ti-alert-circle',  color: '#e24b4a' },
          { label: 'Docs Awaited',     value: caStats.docsAwaited,    icon: 'ti-file-unknown',  color: '#e0952a' },
        ].map(s => (
          <div key={s.label} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <i className={`ti ${s.icon}`} style={{ color: s.color, fontSize: 16 }} />
              <span style={{ fontSize: 11, color: t.muted }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: t.text }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Overdue */}
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Overdue Filings</span>
            <span style={{ background: 'rgba(226,75,74,0.15)', color: '#e24b4a', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>{overdueDeadlines.length}</span>
          </div>
          {overdueDeadlines.length === 0
            ? <div style={{ padding: 24, textAlign: 'center', color: t.muted, fontSize: 13 }}>All caught up 🎉</div>
            : overdueDeadlines.map((d, i) => (
              <div key={d.id} style={{ padding: '12px 20px', borderBottom: i < overdueDeadlines.length - 1 ? `1px solid ${t.border}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#e24b4a', marginBottom: 2 }}>{d.title}</div>
                  <div style={{ fontSize: 11, color: t.muted }}>{d.client} · Due {d.dueDate}</div>
                </div>
                <span style={{ background: 'rgba(226,75,74,0.12)', color: '#e24b4a', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4 }}>{d.type}</span>
              </div>
            ))}
        </div>

        {/* Upcoming */}
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${t.border}` }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Upcoming Deadlines</span>
          </div>
          {upcomingDeadlines.map((d, i) => (
            <div key={d.id} style={{ padding: '12px 20px', borderBottom: i < upcomingDeadlines.length - 1 ? `1px solid ${t.border}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 2 }}>{d.title}</div>
                <div style={{ fontSize: 11, color: t.muted }}>{d.client} · Due {d.dueDate}</div>
              </div>
              <span style={{ background: `${deadlineStatusColor[d.status]}18`, color: deadlineStatusColor[d.status], fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4 }}>
                {deadlineStatusLabel[d.status]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Client Table + Activity Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${t.border}` }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Client Status Overview</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: darkMode ? '#0a0a0c' : '#f8f8f8' }}>
                {['Client', 'Type', 'Status', 'Pending Docs'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 20px', fontSize: 11, fontWeight: 600, color: t.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentClients.map(c => (
                <tr key={c.id} style={{ borderTop: `1px solid ${t.border}` }}>
                  <td style={{ padding: '12px 20px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: t.muted }}>{c.email}</div>
                  </td>
                  <td style={{ padding: '12px 20px', fontSize: 13, color: t.muted }}>{c.type}</td>
                  <td style={{ padding: '12px 20px' }}>
                    <span style={{ background: `${statusColor[c.status]}18`, color: statusColor[c.status], fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 5, width: 'fit-content' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor[c.status] }} />
                      {statusLabel[c.status]}
                    </span>
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    {c.pendingDocs > 0
                      ? <span style={{ color: '#e0952a', fontWeight: 600, fontSize: 13 }}>{c.pendingDocs} pending</span>
                      : <span style={{ color: '#3a9e75', fontSize: 13 }}>✓ Complete</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Activity Feed */}
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: 340 }}>
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Agent Activity</span>
            {anyLive && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3a9e75', boxShadow: '0 0 6px #3a9e75' }} />}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
            {activityFeed.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: t.muted, fontSize: 12 }}>
                <i className="ti ti-robot" style={{ fontSize: 28, display: 'block', marginBottom: 8, opacity: 0.3 }} />
                Activate agents to see activity
              </div>
            ) : activityFeed.map(entry => (
              <div key={entry.id} style={{ display: 'flex', gap: 10, padding: '10px 14px', borderBottom: `1px solid ${t.border}` }}>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: `${feedColor[entry.type]}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={`ti ${entry.icon}`} style={{ fontSize: 13, color: feedColor[entry.type] }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: feedColor[entry.type], marginBottom: 2 }}>{entry.agent}</div>
                  <div style={{ fontSize: 11, color: t.text, lineHeight: 1.4 }}>{entry.text}</div>
                </div>
                <div style={{ fontSize: 10, color: t.muted, flexShrink: 0 }}>{entry.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
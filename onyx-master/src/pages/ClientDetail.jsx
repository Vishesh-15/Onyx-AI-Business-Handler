import { useState } from 'react';
import { clients } from '../dummyData';

const clientDetails = {
  'TC-8492-X': {
    contact: 'rajesh.sharma@techcorp.in',
    phone: '+91 98200 11234',
    plan: 'Enterprise Pro',
    since: 'Jan 2024',
    revenue: '₹1,24,000/mo',
    deployments: 3,
    uptime: '99.8%',
    lastActive: '2 min ago',
    issues: [
      { uid: 'ISS-2847', text: 'Agent deployment failed on prod-server-03', time: '5m ago', severity: 'critical' },
      { uid: 'ISS-2831', text: 'Webhook timeout on automation pipeline', time: '2h ago', severity: 'warning' },
    ],
    agents: [
      { name: 'Analytics Agent', status: 'healthy', uptime: '99.9%' },
      { name: 'Automation Agent', status: 'healthy', uptime: '99.7%' },
      { name: 'Security Agent', status: 'degraded', uptime: '91.2%' },
    ],
    logs: [
      { time: '13:04', text: 'Analytics report generated successfully', type: 'success' },
      { time: '12:58', text: 'Security scan completed — 0 threats', type: 'success' },
      { time: '12:31', text: 'Automation pipeline webhook timed out', type: 'error' },
    ],
  },
  'SH-2847-A': {
    contact: 'admin@startuphub.io',
    phone: '+91 99300 88712',
    plan: 'SMB Standard',
    since: 'Mar 2024',
    revenue: '₹28,000/mo',
    deployments: 1,
    uptime: '98.1%',
    lastActive: '18 min ago',
    issues: [
      { uid: 'ISS-2846', text: 'High memory usage detected', time: '12m ago', severity: 'warning' },
    ],
    agents: [
      { name: 'Analytics Agent', status: 'healthy', uptime: '98.5%' },
      { name: 'Support Agent', status: 'healthy', uptime: '99.1%' },
    ],
    logs: [
      { time: '12:51', text: 'Support agent resolved 3 tickets', type: 'success' },
      { time: '12:44', text: 'Memory usage spike detected — auto-scaled', type: 'warning' },
    ],
  },
};

const fallbackDetail = {
  contact: 'contact@client.com', phone: '+91 00000 00000', plan: 'Standard',
  since: 'N/A', revenue: '—', deployments: 1, uptime: '—', lastActive: '—',
  issues: [], agents: [], logs: [],
};

const statusColor = { active: '#3a9e75', warning: '#e0952a', inactive: '#555', healthy: '#3a9e75', degraded: '#e0952a', critical: '#e24b4a' };
const severityColor = { critical: '#e24b4a', warning: '#e0952a', info: '#3a9e75' };
const logTypeColor = { success: '#3a9e75', warning: '#e0952a', error: '#e24b4a', info: '#888' };

export default function ClientDetail({ uid, darkMode, onBack }) {
  const [activeTab, setActiveTab] = useState('overview');

  const client = clients.find(c => c.uid === uid);
  const detail = clientDetails[uid] || fallbackDetail;

  const t = {
    bg: darkMode ? '#0e0e10' : '#f0f0f0',
    card: darkMode ? '#131315' : '#ffffff',
    border: darkMode ? '#1f1f22' : '#e0e0e0',
    text: darkMode ? '#e8e8e6' : '#111111',
    muted: darkMode ? '#555555' : '#888888',
    rowHover: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    tabActive: darkMode ? '#131315' : '#ffffff',
    tabBg: darkMode ? '#0a0a0c' : '#ebebeb',
  };

  if (!client) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: t.muted, flexDirection: 'column', gap: 12 }}>
        <i className="ti ti-alert-circle" style={{ fontSize: 40 }} />
        <p style={{ fontSize: 14 }}>Client not found</p>
        <button onClick={onBack} style={{ background: 'transparent', border: `1px solid ${t.border}`, color: t.text, padding: '6px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
          ← Back to Clients
        </button>
      </div>
    );
  }

  const tabs = ['overview', 'agents', 'issues', 'logs'];

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto', padding: 24, boxSizing: 'border-box', background: t.bg }}>

      {/* Back + Header */}
      <div style={{ marginBottom: 24 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: t.muted, cursor: 'pointer', fontSize: 13, padding: 0, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <i className="ti ti-arrow-left" /> Back
        </button>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: t.text, margin: 0 }}>{client.name}</h1>
              <span style={{ background: `${statusColor[client.status]}22`, color: statusColor[client.status], fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor[client.status], display: 'inline-block' }} />
                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: t.muted }}>
              <span>{client.type}</span>
              <span style={{ fontFamily: 'monospace' }}>{client.uid}</span>
              <span>Since {detail.since}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ background: 'transparent', border: `1px solid ${t.border}`, color: t.text, padding: '7px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="ti ti-mail" /> Contact
            </button>
            <button style={{ background: '#3a9e75', border: 'none', color: '#fff', padding: '7px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="ti ti-settings" /> Manage
            </button>
          </div>
        </div>
      </div>

      {/* Stats Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Monthly Revenue', value: detail.revenue, icon: 'ti-currency-rupee' },
          { label: 'Deployments', value: detail.deployments, icon: 'ti-server' },
          { label: 'Uptime', value: detail.uptime, icon: 'ti-activity' },
          { label: 'Last Active', value: detail.lastActive, icon: 'ti-clock' },
        ].map(s => (
          <div key={s.label} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <i className={`ti ${s.icon}`} style={{ color: '#3a9e75', fontSize: 16 }} />
              <span style={{ fontSize: 12, color: t.muted }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: t.text }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, background: t.tabBg, borderRadius: 8, padding: 4, marginBottom: 20, width: 'fit-content' }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            background: activeTab === tab ? t.tabActive : 'transparent',
            border: activeTab === tab ? `1px solid ${t.border}` : '1px solid transparent',
            color: activeTab === tab ? t.text : t.muted,
            padding: '6px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 13,
            fontWeight: activeTab === tab ? 600 : 400, transition: 'all 0.15s', textTransform: 'capitalize',
          }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${t.border}`, fontSize: 13, fontWeight: 600, color: t.text }}>Contact Info</div>
            <div style={{ padding: '4px 0' }}>
              {[
                { label: 'Email', value: detail.contact, icon: 'ti-mail' },
                { label: 'Phone', value: detail.phone, icon: 'ti-phone' },
                { label: 'Plan', value: detail.plan, icon: 'ti-package' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: `1px solid ${t.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: t.muted, fontSize: 13 }}>
                    <i className={`ti ${row.icon}`} style={{ fontSize: 15 }} /> {row.label}
                  </div>
                  <span style={{ fontSize: 13, color: t.text }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${t.border}`, fontSize: 13, fontWeight: 600, color: t.text }}>Active Modules</div>
            <div style={{ padding: 20, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {client.modules.map(mod => (
                <span key={mod} style={{ background: 'rgba(58,158,117,0.12)', color: '#3a9e75', border: '1px solid rgba(58,158,117,0.25)', padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: 500 }}>{mod}</span>
              ))}
            </div>
          </div>

          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${t.border}`, fontSize: 13, fontWeight: 600, color: t.text }}>Recent Issues</div>
            <div style={{ padding: '4px 0' }}>
              {detail.issues.length === 0
                ? <div style={{ padding: 24, textAlign: 'center', color: t.muted, fontSize: 13 }}>No issues 🎉</div>
                : detail.issues.map(iss => (
                  <div key={iss.uid} style={{ padding: '12px 20px', borderBottom: `1px solid ${t.border}` }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 11, color: severityColor[iss.severity], fontWeight: 600 }}>{iss.uid}</span>
                      <span style={{ fontSize: 11, color: t.muted }}>{iss.time}</span>
                    </div>
                    <div style={{ fontSize: 13, color: t.text }}>{iss.text}</div>
                  </div>
                ))}
            </div>
          </div>

          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${t.border}`, fontSize: 13, fontWeight: 600, color: t.text }}>Agent Health</div>
            <div style={{ padding: '4px 0' }}>
              {detail.agents.map(ag => (
                <div key={ag.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: `1px solid ${t.border}` }}>
                  <span style={{ fontSize: 13, color: t.text }}>{ag.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11, color: t.muted }}>{ag.uptime}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: statusColor[ag.status], fontWeight: 500 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: statusColor[ag.status] }} />
                      {ag.status.charAt(0).toUpperCase() + ag.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Agents */}
      {activeTab === 'agents' && (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${t.border}`, fontSize: 13, fontWeight: 600, color: t.text }}>Deployed Agents</div>
          {detail.agents.length === 0
            ? <div style={{ padding: 40, textAlign: 'center', color: t.muted, fontSize: 13 }}>No agents deployed</div>
            : detail.agents.map((ag, i) => (
              <div key={ag.name}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: i < detail.agents.length - 1 ? `1px solid ${t.border}` : 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = t.rowHover}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: `${statusColor[ag.status]}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="ti ti-robot" style={{ fontSize: 18, color: statusColor[ag.status] }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{ag.name}</div>
                    <div style={{ fontSize: 11, color: t.muted }}>Uptime: {ag.uptime}</div>
                  </div>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: statusColor[ag.status], fontWeight: 500 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: statusColor[ag.status] }} />
                  {ag.status.charAt(0).toUpperCase() + ag.status.slice(1)}
                </span>
              </div>
            ))}
        </div>
      )}

      {/* Issues */}
      {activeTab === 'issues' && (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${t.border}`, fontSize: 13, fontWeight: 600, color: t.text }}>All Issues</div>
          {detail.issues.length === 0
            ? <div style={{ padding: 40, textAlign: 'center', color: t.muted, fontSize: 13 }}>No issues reported 🎉</div>
            : detail.issues.map((iss, i) => (
              <div key={iss.uid} style={{ padding: '16px 20px', borderBottom: i < detail.issues.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 12, color: severityColor[iss.severity], fontWeight: 700 }}>{iss.uid}</span>
                  <span style={{ background: `${severityColor[iss.severity]}18`, color: severityColor[iss.severity], fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase' }}>{iss.severity}</span>
                  <span style={{ fontSize: 11, color: t.muted, marginLeft: 'auto' }}>{iss.time}</span>
                </div>
                <div style={{ fontSize: 14, color: t.text }}>{iss.text}</div>
              </div>
            ))}
        </div>
      )}

      {/* Logs */}
      {activeTab === 'logs' && (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${t.border}`, fontSize: 13, fontWeight: 600, color: t.text }}>Activity Logs</div>
          {detail.logs.length === 0
            ? <div style={{ padding: 40, textAlign: 'center', color: t.muted, fontSize: 13 }}>No logs available</div>
            : detail.logs.map((log, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 20px', borderBottom: i < detail.logs.length - 1 ? `1px solid ${t.border}` : 'none', fontFamily: 'monospace' }}>
                <span style={{ fontSize: 11, color: t.muted, flexShrink: 0, marginTop: 1 }}>{log.time}</span>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: logTypeColor[log.type], flexShrink: 0, marginTop: 4 }} />
                <span style={{ fontSize: 13, color: t.text }}>{log.text}</span>
              </div>
            ))}
        </div>
      )}

    </div>
  );
}
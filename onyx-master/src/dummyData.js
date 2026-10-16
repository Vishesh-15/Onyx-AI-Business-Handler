export const clients = [
  { id: 1, name: 'TechCorp Industries', type: 'Enterprise', status: 'active', modules: ['Analytics', 'Automation', 'Security'], uid: 'TC-8492-X' },
  { id: 2, name: 'StartupHub', type: 'SMB', status: 'active', modules: ['Analytics', 'Support'], uid: 'SH-2847-A' },
  { id: 3, name: 'Global Solutions', type: 'Enterprise', status: 'warning', modules: ['Analytics', 'Automation', 'Support', 'Security'], uid: 'GS-9201-F' },
  { id: 4, name: 'CloudSync', type: 'SMB', status: 'active', modules: ['Automation', 'Security'], uid: 'CS-3756-M' },
  { id: 5, name: 'DataVault Inc', type: 'Enterprise', status: 'inactive', modules: ['Security'], uid: 'DV-1029-P' },
  { id: 6, name: 'NextGen Systems', type: 'SMB', status: 'active', modules: ['Analytics', 'Automation'], uid: 'NG-4821-R' },
  { id: 7, name: 'Innovate Labs', type: 'Startup', status: 'active', modules: ['Support'], uid: 'IL-6734-W' },
  { id: 8, name: 'Enterprise Pro', type: 'Enterprise', status: 'warning', modules: ['Analytics', 'Security'], uid: 'EP-5632-B' }
];

export const issues = [
  { id: 1, uid: 'ISS-2847', clientUid: 'TC-8492-X', client: 'TechCorp Industries', description: 'Agent deployment failed on prod-server-03', severity: 'critical', priority: 'P1', status: 'open', assignedTo: 'Vishesh', time: '5m ago', timestamp: '2025-05-24T12:55:00' },
  { id: 2, uid: 'ISS-2846', clientUid: 'SH-2847-A', client: 'StartupHub', description: 'High memory usage detected on analytics pod', severity: 'warning', priority: 'P2', status: 'open', assignedTo: 'Vishesh', time: '12m ago', timestamp: '2025-05-24T12:48:00' },
  { id: 3, uid: 'ISS-2845', clientUid: 'GS-9201-F', client: 'Global Solutions', description: 'Connection timeout to analytics module', severity: 'warning', priority: 'P2', status: 'open', assignedTo: 'Auto', time: '23m ago', timestamp: '2025-05-24T12:37:00' },
  { id: 4, uid: 'ISS-2844', clientUid: 'TC-8492-X', client: 'TechCorp Industries', description: 'Webhook timeout on automation pipeline', severity: 'warning', priority: 'P2', status: 'resolved', assignedTo: 'Vishesh', time: '2h ago', timestamp: '2025-05-24T11:00:00' },
  { id: 5, uid: 'ISS-2843', clientUid: 'EP-5632-B', client: 'Enterprise Pro', description: 'Security agent not responding — health check failed', severity: 'critical', priority: 'P1', status: 'open', assignedTo: 'Vishesh', time: '3h ago', timestamp: '2025-05-24T10:00:00' },
  { id: 6, uid: 'ISS-2842', clientUid: 'CS-3756-M', client: 'CloudSync', description: 'Automation pipeline stalled at step 3', severity: 'info', priority: 'P3', status: 'resolved', assignedTo: 'Omm', time: '5h ago', timestamp: '2025-05-24T08:00:00' },
  { id: 7, uid: 'ISS-2841', clientUid: 'NG-4821-R', client: 'NextGen Systems', description: 'Analytics report generation delayed by 18 minutes', severity: 'info', priority: 'P3', status: 'open', assignedTo: 'Auto', time: '6h ago', timestamp: '2025-05-24T07:00:00' },
  { id: 8, uid: 'ISS-2840', clientUid: 'GS-9201-F', client: 'Global Solutions', description: 'Disk usage above 85% on secondary node', severity: 'warning', priority: 'P2', status: 'open', assignedTo: 'Vishesh', time: '8h ago', timestamp: '2025-05-24T05:00:00' },
  { id: 9, uid: 'ISS-2839', clientUid: 'IL-6734-W', client: 'Innovate Labs', description: 'Support agent failed to escalate ticket ISS-2831', severity: 'info', priority: 'P3', status: 'resolved', assignedTo: 'Auto', time: '1d ago', timestamp: '2025-05-23T13:00:00' },
  { id: 10, uid: 'ISS-2838', clientUid: 'DV-1029-P', client: 'DataVault Inc', description: 'Security scan returned 2 unresolved vulnerabilities', severity: 'critical', priority: 'P1', status: 'open', assignedTo: 'Omm', time: '1d ago', timestamp: '2025-05-23T10:00:00' },
];

export const agents = [
  { id: 1, name: 'Analytics Agent', status: 'healthy' },
  { id: 2, name: 'Automation Agent', status: 'healthy' },
  { id: 3, name: 'Security Agent', status: 'degraded' },
  { id: 4, name: 'Support Agent', status: 'healthy' },
  { id: 5, name: 'Monitoring Agent', status: 'critical' }
];

export const stats = {
  totalClients: 24,
  activeAgents: 18,
  openIssues: 3,
  monthlyRevenue: '$84.2K'
};

export const logs = [
  { id: 1,  timestamp: '2025-05-24T13:04:00', clientUid: 'TC-8492-X', client: 'TechCorp Industries', agent: 'Analytics Agent',    action: 'Analytics report generated successfully',                type: 'success' },
  { id: 2,  timestamp: '2025-05-24T12:58:00', clientUid: 'TC-8492-X', client: 'TechCorp Industries', agent: 'Security Agent',     action: 'Security scan completed — 0 threats found',              type: 'success' },
  { id: 3,  timestamp: '2025-05-24T12:55:00', clientUid: 'TC-8492-X', client: 'TechCorp Industries', agent: 'Automation Agent',   action: 'Agent deployment failed on prod-server-03',              type: 'error'   },
  { id: 4,  timestamp: '2025-05-24T12:48:00', clientUid: 'SH-2847-A', client: 'StartupHub',          agent: 'Analytics Agent',    action: 'High memory usage detected — threshold exceeded 85%',    type: 'warning' },
  { id: 5,  timestamp: '2025-05-24T12:37:00', clientUid: 'GS-9201-F', client: 'Global Solutions',    agent: 'Analytics Agent',    action: 'Connection timeout to analytics module',                  type: 'error'   },
  { id: 6,  timestamp: '2025-05-24T12:20:00', clientUid: 'CS-3756-M', client: 'CloudSync',           agent: 'Automation Agent',   action: 'Automation pipeline resumed after manual override',       type: 'success' },
  { id: 7,  timestamp: '2025-05-24T11:45:00', clientUid: 'EP-5632-B', client: 'Enterprise Pro',      agent: 'Monitoring Agent',   action: 'Health check failed — agent not responding',             type: 'error'   },
  { id: 8,  timestamp: '2025-05-24T11:00:00', clientUid: 'TC-8492-X', client: 'TechCorp Industries', agent: 'Automation Agent',   action: 'Webhook timeout on automation pipeline — retrying',       type: 'warning' },
  { id: 9,  timestamp: '2025-05-24T10:30:00', clientUid: 'NG-4821-R', client: 'NextGen Systems',     agent: 'Analytics Agent',    action: 'Report generation delayed — queue overloaded',            type: 'warning' },
  { id: 10, timestamp: '2025-05-24T10:00:00', clientUid: 'EP-5632-B', client: 'Enterprise Pro',      agent: 'Security Agent',     action: 'Security agent restarted by watchdog',                    type: 'warning' },
  { id: 11, timestamp: '2025-05-24T09:15:00', clientUid: 'GS-9201-F', client: 'Global Solutions',    agent: 'Support Agent',      action: 'Client query handled and resolved',                       type: 'success' },
  { id: 12, timestamp: '2025-05-24T08:00:00', clientUid: 'CS-3756-M', client: 'CloudSync',           agent: 'Automation Agent',   action: 'Pipeline stalled at step 3 — manual intervention needed', type: 'error'   },
  { id: 13, timestamp: '2025-05-24T07:30:00', clientUid: 'DV-1029-P', client: 'DataVault Inc',       agent: 'Security Agent',     action: 'Vulnerability scan initiated',                            type: 'success' },
  { id: 14, timestamp: '2025-05-24T07:00:00', clientUid: 'NG-4821-R', client: 'NextGen Systems',     agent: 'Analytics Agent',    action: 'Scheduled report run started',                            type: 'success' },
  { id: 15, timestamp: '2025-05-24T06:00:00', clientUid: 'IL-6734-W', client: 'Innovate Labs',       agent: 'Support Agent',      action: 'Ticket escalation to Vishesh failed — email bounced',    type: 'error'   },
  { id: 16, timestamp: '2025-05-23T18:00:00', clientUid: 'SH-2847-A', client: 'StartupHub',          agent: 'Analytics Agent',    action: 'Daily analytics sync completed',                          type: 'success' },
  { id: 17, timestamp: '2025-05-23T15:30:00', clientUid: 'GS-9201-F', client: 'Global Solutions',    agent: 'Automation Agent',   action: 'Disk usage warning — 85% on secondary node',             type: 'warning' },
  { id: 18, timestamp: '2025-05-23T13:00:00', clientUid: 'IL-6734-W', client: 'Innovate Labs',       agent: 'Support Agent',      action: 'Support agent failed to escalate ticket ISS-2831',       type: 'error'   },
  { id: 19, timestamp: '2025-05-23T10:00:00', clientUid: 'DV-1029-P', client: 'DataVault Inc',       agent: 'Security Agent',     action: 'Scan returned 2 unresolved vulnerabilities',             type: 'error'   },
  { id: 20, timestamp: '2025-05-23T08:00:00', clientUid: 'TC-8492-X', client: 'TechCorp Industries', agent: 'Monitoring Agent',   action: 'All systems nominal — routine check passed',              type: 'success' },
];

export const billingData = [
  { id: 1, clientId: 1, client: 'TechCorp Industries', uid: 'TC-8492-X', type: 'Enterprise', plan: 'Enterprise Pro', amount: 1480, dueDate: '2025-05-01', paidDate: '2025-05-01', status: 'paid', email: 'rajesh.sharma@techcorp.in', invoice: 'INV-2025-041', lineItems: [{ description: 'Enterprise Pro Plan — May 2025', qty: 1, rate: 1200, total: 1200 }, { description: 'Analytics Agent Module', qty: 1, rate: 180, total: 180 }, { description: 'Security Agent Module', qty: 1, rate: 100, total: 100 }] },
  { id: 2, clientId: 2, client: 'StartupHub', uid: 'SH-2847-A', type: 'SMB', plan: 'SMB Standard', amount: 340, dueDate: '2025-05-05', paidDate: null, status: 'overdue', email: 'admin@startuphub.io', invoice: 'INV-2025-042', lineItems: [{ description: 'SMB Standard Plan — May 2025', qty: 1, rate: 280, total: 280 }, { description: 'Support Agent Module', qty: 1, rate: 60, total: 60 }] },
  { id: 3, clientId: 3, client: 'Global Solutions', uid: 'GS-9201-F', type: 'Enterprise', plan: 'Enterprise Pro', amount: 1480, dueDate: '2025-05-10', paidDate: null, status: 'pending', email: 'billing@globalsolutions.com', invoice: 'INV-2025-043', lineItems: [{ description: 'Enterprise Pro Plan — May 2025', qty: 1, rate: 1200, total: 1200 }, { description: 'Analytics Agent Module', qty: 1, rate: 180, total: 180 }, { description: 'Automation Agent Module', qty: 1, rate: 100, total: 100 }] },
  { id: 4, clientId: 4, client: 'CloudSync', uid: 'CS-3756-M', type: 'SMB', plan: 'SMB Standard', amount: 340, dueDate: '2025-05-08', paidDate: '2025-05-07', status: 'paid', email: 'accounts@cloudsync.io', invoice: 'INV-2025-044', lineItems: [{ description: 'SMB Standard Plan — May 2025', qty: 1, rate: 280, total: 280 }, { description: 'Automation Agent Module', qty: 1, rate: 60, total: 60 }] },
  { id: 5, clientId: 5, client: 'DataVault Inc', uid: 'DV-1029-P', type: 'Enterprise', plan: 'Enterprise Pro', amount: 1480, dueDate: '2025-05-12', paidDate: null, status: 'pending', email: 'finance@datavault.in', invoice: 'INV-2025-045', lineItems: [{ description: 'Enterprise Pro Plan — May 2025', qty: 1, rate: 1200, total: 1200 }, { description: 'Security Agent Module', qty: 1, rate: 280, total: 280 }] },
  { id: 6, clientId: 6, client: 'NextGen Systems', uid: 'NG-4821-R', type: 'SMB', plan: 'SMB Standard', amount: 340, dueDate: '2025-04-28', paidDate: null, status: 'overdue', email: 'admin@nextgensystems.in', invoice: 'INV-2025-046', lineItems: [{ description: 'SMB Standard Plan — April 2025', qty: 1, rate: 280, total: 280 }, { description: 'Analytics Agent Module', qty: 1, rate: 60, total: 60 }] },
  { id: 7, clientId: 7, client: 'Innovate Labs', uid: 'IL-6734-W', type: 'Startup', plan: 'Startup Plan', amount: 180, dueDate: '2025-05-15', paidDate: '2025-05-14', status: 'paid', email: 'hello@innovatelabs.io', invoice: 'INV-2025-047', lineItems: [{ description: 'Startup Plan — May 2025', qty: 1, rate: 120, total: 120 }, { description: 'Support Agent Module', qty: 1, rate: 60, total: 60 }] },
  { id: 8, clientId: 8, client: 'Enterprise Pro', uid: 'EP-5632-B', type: 'Enterprise', plan: 'Enterprise Pro', amount: 1480, dueDate: '2025-05-20', paidDate: null, status: 'pending', email: 'billing@enterprisepro.com', invoice: 'INV-2025-048', lineItems: [{ description: 'Enterprise Pro Plan — May 2025', qty: 1, rate: 1200, total: 1200 }, { description: 'Analytics Agent Module', qty: 1, rate: 180, total: 180 }, { description: 'Security Agent Module', qty: 1, rate: 100, total: 100 }] },
];
import { useState } from 'react';
import { billingData } from '../dummyData';

const statusConfig = {
  paid:    { color: '#3a9e75', bg: 'rgba(58,158,117,0.12)', border: 'rgba(58,158,117,0.25)', label: 'Paid' },
  pending: { color: '#e0952a', bg: 'rgba(224,149,42,0.12)', border: 'rgba(224,149,42,0.25)', label: 'Pending' },
  overdue: { color: '#e24b4a', bg: 'rgba(226,75,74,0.12)',  border: 'rgba(226,75,74,0.25)',  label: 'Overdue' },
};

export default function Billing({ darkMode, onOpenInvoice }) {
  const [filter, setFilter] = useState('all');
  const [reminderModal, setReminderModal] = useState(null); // client object
  const [sentReminders, setSentReminders] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const t = {
    bg:      darkMode ? '#0e0e10' : '#f4f4f6',
    card:    darkMode ? '#131315' : '#ffffff',
    card2:   darkMode ? '#0a0a0c' : '#f0f0f2',
    border:  darkMode ? '#1f1f22' : '#e0e0e0',
    text:    darkMode ? '#e8e8e6' : '#111111',
    muted:   darkMode ? '#666666' : '#888888',
    muted2:  darkMode ? '#444444' : '#bbbbbb',
    hover:   darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    input:   darkMode ? '#0a0a0c' : '#f8f8f8',
    modalBg: darkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)',
  };

  const totalRevenue    = billingData.filter(b => b.status === 'paid').reduce((s, b) => s + b.amount, 0);
  const pendingRevenue  = billingData.filter(b => b.status === 'pending').reduce((s, b) => s + b.amount, 0);
  const overdueRevenue  = billingData.filter(b => b.status === 'overdue').reduce((s, b) => s + b.amount, 0);
  const totalClients    = billingData.length;

  const filtered = billingData.filter(b => {
    const matchFilter = filter === 'all' || b.status === filter;
    const matchSearch = b.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        b.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        b.invoice.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleSendReminder = (client) => {
    setSentReminders(prev => new Set([...prev, client.id]));
    setReminderModal(null);
    // In production: trigger email API here
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto', padding: 24, boxSizing: 'border-box', background: t.bg }}>

      {/* Stats Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Collected This Month', value: `$${totalRevenue.toLocaleString()}`,   icon: 'ti-circle-check', color: '#3a9e75' },
          { label: 'Pending',              value: `$${pendingRevenue.toLocaleString()}`,  icon: 'ti-clock',        color: '#e0952a' },
          { label: 'Overdue',              value: `$${overdueRevenue.toLocaleString()}`,  icon: 'ti-alert-circle', color: '#e24b4a' },
          { label: 'Total Clients Billed', value: totalClients,                           icon: 'ti-users',        color: '#7b8cde' },
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

      {/* Table Card */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden' }}>

        {/* Table Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${t.border}`, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>Billing Overview</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: t.input, border: `1px solid ${t.border}`, borderRadius: 6, padding: '6px 12px' }}>
              <i className="ti ti-search" style={{ fontSize: 13, color: t.muted }} />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ background: 'transparent', border: 'none', outline: 'none', color: t.text, fontSize: 13, width: 160 }}
              />
            </div>
            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: 4, background: t.card2, borderRadius: 6, padding: 3 }}>
              {['all', 'paid', 'pending', 'overdue'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    background: filter === f ? t.card : 'transparent',
                    border: filter === f ? `1px solid ${t.border}` : '1px solid transparent',
                    color: filter === f ? t.text : t.muted,
                    padding: '5px 12px',
                    borderRadius: 5,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: filter === f ? 600 : 400,
                    transition: 'all 0.15s',
                    textTransform: 'capitalize',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                {['Client', 'Invoice', 'Plan', 'Amount', 'Due Date', 'Paid On', 'Status', 'Action'].map(col => (
                  <th key={col} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: t.muted, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => {
                const sc = statusConfig[b.status];
                const reminded = sentReminders.has(b.id);
                return (
                  <tr
                    key={b.id}
                    style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${t.border}` : 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = t.hover}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Client */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: t.text, marginBottom: 2 }}>{b.client}</div>
                      <div style={{ fontSize: 11, color: t.muted, fontFamily: 'monospace' }}>{b.uid}</div>
                    </td>
                    {/* Invoice */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 12, color: t.muted }}>{b.invoice}</span>
                    </td>
                    {/* Plan */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ color: t.text }}>{b.plan}</span>
                    </td>
                    {/* Amount */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontWeight: 700, color: t.text, fontSize: 14 }}>${b.amount.toLocaleString()}</span>
                    </td>
                    {/* Due Date */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ color: b.status === 'overdue' ? '#e24b4a' : t.muted, fontWeight: b.status === 'overdue' ? 600 : 400 }}>
                        {formatDate(b.dueDate)}
                      </span>
                    </td>
                    {/* Paid On */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ color: b.paidDate ? '#3a9e75' : t.muted2 }}>{formatDate(b.paidDate)}</span>
                    </td>
                    {/* Status */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: sc.color }} />
                        {sc.label}
                      </span>
                    </td>
                    {/* Action */}
                    <td style={{ padding: '14px 16px' }}>
                      {b.status === 'paid' ? (
                       <button
                         // eslint-disable-next-line no-undef
                         onClick={() => onOpenInvoice && onOpenInvoice(b)}
                         style={{ background: 'transparent', border: `1px solid ${t.border}`, color: t.muted, padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                         <i className="ti ti-file-invoice" style={{ fontSize: 13 }} /> Invoice
                       </button>
                      ) : reminded ? (
                        <span style={{ fontSize: 12, color: '#3a9e75', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                          <i className="ti ti-check" /> Reminder Sent
                        </span>
                      ) : (
                        <button
                          onClick={() => setReminderModal(b)}
                          style={{ background: 'rgba(226,75,74,0.1)', border: '1px solid rgba(226,75,74,0.3)', color: '#e24b4a', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 5, transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(226,75,74,0.2)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(226,75,74,0.1)'; }}
                        >
                          <i className="ti ti-bell" style={{ fontSize: 13 }} /> Remind
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: t.muted, fontSize: 13 }}>
              <i className="ti ti-search" style={{ fontSize: 28, display: 'block', marginBottom: 8 }} />
              No records found.
            </div>
          )}
        </div>
      </div>

      {/* Reminder Confirm Modal */}
      {reminderModal && (
        <div
          onClick={() => setReminderModal(null)}
          style={{ position: 'fixed', inset: 0, background: t.modalBg, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: darkMode ? '#131315' : '#ffffff', border: `1px solid ${t.border}`, borderRadius: 12, padding: 28, width: 420, boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(226,75,74,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ti ti-bell" style={{ fontSize: 20, color: '#e24b4a' }} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>Send Payment Reminder</div>
                <div style={{ fontSize: 12, color: t.muted }}>This will send an email to the client</div>
              </div>
            </div>

            {/* Client Info */}
            <div style={{ background: t.card2, border: `1px solid ${t.border}`, borderRadius: 8, padding: '14px 16px', marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{reminderModal.client}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: t.muted }}>{reminderModal.uid}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: t.muted }}>
                <span>{reminderModal.email}</span>
                <span style={{ color: '#e24b4a', fontWeight: 600 }}>${reminderModal.amount} due</span>
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: t.muted }}>
                Invoice: <span style={{ fontFamily: 'monospace', color: t.text }}>{reminderModal.invoice}</span>
                &nbsp;·&nbsp; Due: <span style={{ color: '#e24b4a' }}>{formatDate(reminderModal.dueDate)}</span>
              </div>
            </div>

            {/* Email Preview */}
            <div style={{ background: t.card2, border: `1px solid ${t.border}`, borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 12, color: t.muted, lineHeight: 1.7 }}>
              <div style={{ color: t.text, fontWeight: 600, marginBottom: 4 }}>Email Preview</div>
              <div>To: <span style={{ color: t.text }}>{reminderModal.email}</span></div>
              <div>Subject: <span style={{ color: t.text }}>Payment Reminder — {reminderModal.invoice}</span></div>
              <div style={{ marginTop: 6, color: t.muted }}>
                Hi {reminderModal.client.split(' ')[0]}, your payment of <strong style={{ color: t.text }}>${reminderModal.amount}</strong> for {reminderModal.invoice} was due on {formatDate(reminderModal.dueDate)}. Please complete the payment at the earliest.
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setReminderModal(null)}
                style={{ background: 'transparent', border: `1px solid ${t.border}`, color: t.muted, padding: '8px 18px', borderRadius: 7, cursor: 'pointer', fontSize: 13 }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSendReminder(reminderModal)}
                style={{ background: '#e24b4a', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <i className="ti ti-send" /> Send Reminder
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
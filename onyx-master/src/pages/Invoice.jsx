import { useState } from 'react';

const statusConfig = {
  paid:    { color: '#3a9e75', bg: 'rgba(58,158,117,0.12)',  border: 'rgba(58,158,117,0.25)', label: 'PAID' },
  pending: { color: '#e0952a', bg: 'rgba(224,149,42,0.12)', border: 'rgba(224,149,42,0.25)', label: 'PENDING' },
  overdue: { color: '#e24b4a', bg: 'rgba(226,75,74,0.12)',  border: 'rgba(226,75,74,0.25)',  label: 'OVERDUE' },
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
};

export default function InvoicePage({ bill, darkMode, onBack }) {
  const [sendModal, setSendModal] = useState(false);
  const [sent, setSent] = useState(false);

  const t = {
    bg:     darkMode ? '#0e0e10' : '#f4f4f6',
    card:   darkMode ? '#131315' : '#ffffff',
    card2:  darkMode ? '#0a0a0c' : '#f0f0f2',
    border: darkMode ? '#1f1f22' : '#e0e0e0',
    text:   darkMode ? '#e8e8e6' : '#111111',
    muted:  darkMode ? '#666666' : '#888888',
  };

  if (!bill) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: t.muted, flexDirection: 'column', gap: 12 }}>
        <i className="ti ti-file-off" style={{ fontSize: 40 }} />
        <p style={{ fontSize: 14 }}>Invoice not found</p>
        <button onClick={onBack} style={{ background: 'transparent', border: `1px solid ${t.border}`, color: t.text, padding: '6px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
          ← Back to Billing
        </button>
      </div>
    );
  }

  const sc = statusConfig[bill.status];
  const lineItems = bill.lineItems || [
    { description: `${bill.plan} — May 2025`, qty: 1, rate: bill.amount, total: bill.amount },
  ];
  const subtotal = lineItems.reduce((s, l) => s + l.total, 0);

  const handleSend = () => {
    setSent(true);
    setSendModal(false);
  };

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto', padding: 24, boxSizing: 'border-box', background: t.bg }}>

      {/* Print styles */}
      <style>{`
          @media print {
            body * { visibility: hidden !important; }
            #invoice-print-area, #invoice-print-area * { visibility: visible !important; }
            #invoice-print-area {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: auto;
            padding: 32px;
            box-sizing: border-box;
            background: white !important;
            color: black !important;
            border: none !important;
            border-radius: 0 !important;
           }
         }
     `}</style>

      {/* Back + Action Bar */}
      <div style={{ marginBottom: 24 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: t.muted, cursor: 'pointer', fontSize: 13, padding: 0, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <i className="ti ti-arrow-left" /> Back to Billing
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: t.text, fontFamily: 'monospace' }}>{bill.invoice}</span>
            <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 4, letterSpacing: '0.08em' }}>
              {sc.label}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => window.print()}
              style={{ background: 'transparent', border: `1px solid ${t.border}`, color: t.text, padding: '7px 14px', borderRadius: 7, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <i className="ti ti-download" /> Download PDF
            </button>
            {sent ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#3a9e75', padding: '7px 14px' }}>
                <i className="ti ti-check" /> Invoice Sent
              </span>
            ) : (
              <button
                onClick={() => setSendModal(true)}
                style={{ background: '#3a9e75', border: 'none', color: '#fff', padding: '7px 16px', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <i className="ti ti-send" /> Send to Client
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Body */}
      <div
        id="invoice-print-area"
        style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: 40, margin: '0 auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 800, color: t.text, letterSpacing: '-0.02em', marginBottom: 4 }}>ONYX</div>
            <div style={{ fontSize: 11, color: t.muted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>AI Business Handler</div>
            <div style={{ marginTop: 12, fontSize: 12, color: t.muted, lineHeight: 1.8 }}>
              <div>support@onyxai.in</div>
              <div>www.onyxai.in</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: t.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Invoice</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: t.text, fontFamily: 'monospace', marginBottom: 12 }}>{bill.invoice}</div>
            <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: 10, fontWeight: 700, padding: '4px 12px', borderRadius: 4, letterSpacing: '0.1em' }}>
              {sc.label}
            </span>
          </div>
        </div>

        <div style={{ height: 1, background: t.border, marginBottom: 32 }} />

        {/* Bill To / Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 36 }}>
          <div>
            <div style={{ fontSize: 10, color: t.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Bill To</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 4 }}>{bill.client}</div>
            <div style={{ fontSize: 12, color: t.muted, lineHeight: 1.8 }}>
              <div>{bill.email}</div>
              <div style={{ fontFamily: 'monospace' }}>{bill.uid}</div>
              <div>{bill.type}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: t.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Details</div>
            <div style={{ fontSize: 12, color: t.muted, lineHeight: 2 }}>
              <div>Issue Date: <span style={{ color: t.text }}>May 1, 2025</span></div>
              <div>Due Date: <span style={{ color: bill.status === 'overdue' ? '#e24b4a' : t.text }}>{formatDate(bill.dueDate)}</span></div>
              {bill.paidDate && <div>Paid On: <span style={{ color: '#3a9e75' }}>{formatDate(bill.paidDate)}</span></div>}
              <div>Plan: <span style={{ color: t.text }}>{bill.plan}</span></div>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div style={{ border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden', marginBottom: 24 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: darkMode ? '#0a0a0c' : '#f2f2f4', borderBottom: `1px solid ${t.border}` }}>
                {['Description', 'Qty', 'Rate', 'Total'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: h === 'Description' ? 'left' : 'right', fontSize: 10, fontWeight: 600, color: t.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, i) => (
                <tr key={i} style={{ borderBottom: i < lineItems.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                  <td style={{ padding: '13px 16px', color: t.text }}>{item.description}</td>
                  <td style={{ padding: '13px 16px', textAlign: 'right', color: t.muted }}>{item.qty}</td>
                  <td style={{ padding: '13px 16px', textAlign: 'right', color: t.muted }}>${item.rate}</td>
                  <td style={{ padding: '13px 16px', textAlign: 'right', fontWeight: 600, color: t.text }}>${item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 32 }}>
          <div style={{ minWidth: 220 }}>
            {[
              { label: 'Subtotal', value: `$${subtotal}` },
              { label: 'Tax (0%)', value: '$0' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13, color: t.muted, borderBottom: `1px solid ${t.border}` }}>
                <span>{row.label}</span><span>{row.value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontSize: 16, fontWeight: 800, color: t.text }}>
              <span>Total</span><span>${bill.amount}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ height: 1, background: t.border, marginBottom: 20 }} />
        <div style={{ fontSize: 11, color: t.muted, textAlign: 'center', lineHeight: 1.8 }}>
          Thank you for using ONYX. For queries, contact support@onyxai.in
          <br />This is a system-generated invoice.
        </div>
      </div>

      {/* Send Modal */}
      {sendModal && (
        <div
          onClick={() => setSendModal(false)}
          style={{ position: 'fixed', inset: 0, background: darkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: darkMode ? '#131315' : '#ffffff', border: `1px solid ${t.border}`, borderRadius: 12, padding: 28, width: 400, boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(58,158,117,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ti ti-send" style={{ fontSize: 20, color: '#3a9e75' }} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>Send Invoice</div>
                <div style={{ fontSize: 12, color: t.muted }}>Email invoice to the client</div>
              </div>
            </div>

            <div style={{ background: t.card2, border: `1px solid ${t.border}`, borderRadius: 8, padding: '14px 16px', marginBottom: 16, fontSize: 13 }}>
              {[
                { label: 'To', value: bill.email },
                { label: 'Subject', value: `Invoice ${bill.invoice} — ONYX` },
                { label: 'Amount', value: `$${bill.amount}`, bold: true },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: t.muted }}>{row.label}</span>
                  <span style={{ color: t.text, fontWeight: row.bold ? 700 : 400 }}>{row.value}</span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 12, color: t.muted, background: t.card2, border: `1px solid ${t.border}`, borderRadius: 8, padding: '12px 16px', marginBottom: 20, lineHeight: 1.7 }}>
              Hi {bill.client.split(' ')[0]}, please find your invoice <strong style={{ color: t.text }}>{bill.invoice}</strong> for <strong style={{ color: t.text }}>${bill.amount}</strong> due on {formatDate(bill.dueDate)}. Thank you for choosing ONYX.
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSendModal(false)}
                style={{ background: 'transparent', border: `1px solid ${t.border}`, color: t.muted, padding: '8px 18px', borderRadius: 7, cursor: 'pointer', fontSize: 13 }}
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                style={{ background: '#3a9e75', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <i className="ti ti-send" /> Send Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
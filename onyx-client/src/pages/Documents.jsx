import { useState } from 'react';
import { documents, caClients } from '../caData';

export default function Documents({ accent, darkMode }) {
  const [localDocs, setLocalDocs] = useState(documents);
  const [selectedClient, setSelectedClient] = useState(documents[0]?.clientId || null);

  const t = {
    bg:       darkMode ? '#0e0e10' : '#f0f0f0',
    card:     darkMode ? '#131315' : '#ffffff',
    border:   darkMode ? '#1f1f22' : '#e0e0e0',
    text:     darkMode ? '#e8e8e6' : '#111111',
    muted:    darkMode ? '#555555' : '#888888',
    input:    darkMode ? '#0e0e10' : '#f5f5f5',
    inputBorder: darkMode ? '#2a2a2e' : '#d0d0d0',
    rowHover: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    sidebarBg: darkMode ? '#0a0a0c' : '#f8f8f8',
  };

  const toggleDoc = (clientId, docId) => {
    setLocalDocs(prev => prev.map(c => {
      if (c.clientId !== clientId) return c;
      return {
        ...c,
        checklist: c.checklist.map(d => d.id === docId ? { ...d, received: !d.received } : d)
      };
    }));
  };

  const currentClient = localDocs.find(c => c.clientId === selectedClient);
  const receivedCount = currentClient ? currentClient.checklist.filter(d => d.received).length : 0;
  const totalCount    = currentClient ? currentClient.checklist.length : 0;
  const progress      = totalCount > 0 ? Math.round((receivedCount / totalCount) * 100) : 0;

  const getClientStatus = (clientId) => {
    const c = localDocs.find(d => d.clientId === clientId);
    if (!c) return null;
    const rec = c.checklist.filter(d => d.received).length;
    const tot = c.checklist.length;
    return { rec, tot, complete: rec === tot };
  };

  return (
    <div style={{ padding: 24, background: t.bg, minHeight: '100%' }}>

      {/* Summary Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Clients with Pending Docs', value: localDocs.filter(c => c.checklist.some(d => !d.received)).length, icon: 'ti-file-unknown', color: '#e0952a' },
          { label: 'Clients Complete', value: localDocs.filter(c => c.checklist.every(d => d.received)).length, icon: 'ti-file-check', color: '#3a9e75' },
          { label: 'Total Documents Tracked', value: localDocs.reduce((sum, c) => sum + c.checklist.length, 0), icon: 'ti-files', color: accent },
        ].map(s => (
          <div key={s.label} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className={`ti ${s.icon}`} style={{ fontSize: 20, color: s.color }} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: t.muted, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: t.text }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Layout — sidebar + checklist */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16 }}>

        {/* Client Sidebar */}
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${t.border}`, fontSize: 13, fontWeight: 600, color: t.text }}>
            Clients with Docs
          </div>
          {localDocs.map(c => {
            const cs = getClientStatus(c.clientId);
            const isActive = selectedClient === c.clientId;
            return (
              <div key={c.clientId}
                onClick={() => setSelectedClient(c.clientId)}
                style={{
                  padding: '12px 16px',
                  borderBottom: `1px solid ${t.border}`,
                  cursor: 'pointer',
                  background: isActive ? `${accent}12` : 'transparent',
                  borderLeft: isActive ? `2px solid ${accent}` : '2px solid transparent',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = t.rowHover; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
                <div style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? accent : t.text, marginBottom: 4 }}>{c.client}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ flex: 1, height: 4, background: t.border, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${(cs.rec / cs.tot) * 100}%`, height: '100%', background: cs.complete ? '#3a9e75' : '#e0952a', borderRadius: 2, transition: 'width 0.3s' }} />
                  </div>
                  <span style={{ fontSize: 10, color: cs.complete ? '#3a9e75' : '#e0952a', fontWeight: 600, flexShrink: 0 }}>{cs.rec}/{cs.tot}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Checklist Panel */}
        {currentClient ? (
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${t.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{currentClient.client}</span>
                <span style={{ fontSize: 12, color: progress === 100 ? '#3a9e75' : '#e0952a', fontWeight: 600 }}>
                  {receivedCount}/{totalCount} received
                </span>
              </div>
              {/* Progress bar */}
              <div style={{ height: 6, background: t.border, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: progress === 100 ? '#3a9e75' : accent, borderRadius: 3, transition: 'width 0.3s' }} />
              </div>
              <div style={{ fontSize: 11, color: t.muted, marginTop: 6 }}>{progress}% complete</div>
            </div>

            {/* Checklist items */}
            <div style={{ padding: '8px 0' }}>
              {currentClient.checklist.map((doc, i) => (
                <div key={doc.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 20px',
                    borderBottom: i < currentClient.checklist.length - 1 ? `1px solid ${t.border}` : 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = t.rowHover}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Checkbox */}
                    <div
                      onClick={() => toggleDoc(currentClient.clientId, doc.id)}
                      style={{
                        width: 20, height: 20, borderRadius: 5,
                        border: `2px solid ${doc.received ? '#3a9e75' : t.inputBorder}`,
                        background: doc.received ? '#3a9e75' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
                      }}>
                      {doc.received && <i className="ti ti-check" style={{ fontSize: 12, color: '#fff' }} />}
                    </div>
                    <span style={{ fontSize: 14, color: doc.received ? t.muted : t.text, textDecoration: doc.received ? 'line-through' : 'none' }}>
                      {doc.name}
                    </span>
                  </div>

                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 4,
                    background: doc.received ? 'rgba(58,158,117,0.12)' : 'rgba(224,149,42,0.12)',
                    color: doc.received ? '#3a9e75' : '#e0952a',
                  }}>
                    {doc.received ? 'Received' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            {progress === 100 && (
              <div style={{ padding: '14px 20px', borderTop: `1px solid ${t.border}`, background: 'rgba(58,158,117,0.08)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="ti ti-circle-check" style={{ color: '#3a9e75', fontSize: 18 }} />
                <span style={{ fontSize: 13, color: '#3a9e75', fontWeight: 600 }}>All documents received — ready to proceed!</span>
              </div>
            )}
          </div>
        ) : (
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.muted, fontSize: 13 }}>
            Select a client to view checklist
          </div>
        )}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { caClients } from '../caData';

const pendingClients = caClients.filter(c => c.pendingDocs > 0);

export default function Reminders({ accent, darkMode }) {
  const [selectedClient, setSelectedClient] = useState(null);
  const [channel, setChannel] = useState('whatsapp');
  const [customNote, setCustomNote] = useState('');
  const [generatedMsg, setGeneratedMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState([]);

  const t = {
    bg:       darkMode ? '#0e0e10' : '#f0f0f0',
    card:     darkMode ? '#131315' : '#ffffff',
    border:   darkMode ? '#1f1f22' : '#e0e0e0',
    text:     darkMode ? '#e8e8e6' : '#111111',
    muted:    darkMode ? '#555555' : '#888888',
    input:    darkMode ? '#0e0e10' : '#f5f5f5',
    inputBorder: darkMode ? '#2a2a2e' : '#d0d0d0',
    inputText: darkMode ? '#e8e8e6' : '#111111',
    rowHover: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    msgBg:    darkMode ? '#0a0a0c' : '#f5f5f5',
  };

  const inputStyle = {
    background: t.input, border: `1px solid ${t.inputBorder}`,
    color: t.inputText, padding: '8px 12px', borderRadius: 6,
    fontSize: 13, outline: 'none', width: '100%',
  };

  const generateMessage = async () => {
    if (!selectedClient) return;
    setLoading(true);
    setGeneratedMsg('');

    const client = caClients.find(c => c.id === selectedClient);
    const prompt = `You are a professional CA firm assistant. Draft a polite, brief ${channel === 'whatsapp' ? 'WhatsApp' : 'email'} reminder message to a client asking them to submit their pending documents for tax filing.

Client Details:
- Name: ${client.name}
- Pending Documents: ${client.pendingDocs} document(s) still awaited
- Filing Type: ${client.gstNo ? 'GST & ITR' : 'ITR'}
${customNote ? `- Additional Note from CA: ${customNote}` : ''}

Requirements:
- Tone: Professional but warm, not pushy
- Length: Short (3-5 lines for WhatsApp, slightly longer for email)
- Language: English
- Do NOT use generic placeholders like [Name] — use the actual client name
- End with a clear call to action
${channel === 'email' ? '- Include a subject line at the top' : ''}

Generate only the message, no explanations.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await response.json();
      const text = data.content?.map(b => b.text || '').join('') || 'Could not generate message.';
      setGeneratedMsg(text);
    } catch (err) {
      setGeneratedMsg('Error generating message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const markSent = (clientId) => {
    setSent(prev => [...prev, clientId]);
    setSelectedClient(null);
    setGeneratedMsg('');
    setCustomNote('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMsg);
  };

  const selectedClientData = caClients.find(c => c.id === selectedClient);

  return (
    <div style={{ padding: 24, background: t.bg, minHeight: '100%' }}>

      {/* Header info */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <i className="ti ti-robot" style={{ fontSize: 20, color: accent }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>AI-Powered Reminder Bot</div>
          <div style={{ fontSize: 12, color: t.muted }}>Select a client → choose channel → Claude drafts a personalized message → you review & send</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>

        {/* Client List */}
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${t.border}`, fontSize: 13, fontWeight: 600, color: t.text }}>
            Pending Clients ({pendingClients.length})
          </div>
          {pendingClients.map(client => {
            const isActive  = selectedClient === client.id;
            const isSent    = sent.includes(client.id);
            return (
              <div key={client.id}
                onClick={() => { if (!isSent) { setSelectedClient(client.id); setGeneratedMsg(''); setCustomNote(''); } }}
                style={{
                  padding: '14px 16px',
                  borderBottom: `1px solid ${t.border}`,
                  cursor: isSent ? 'default' : 'pointer',
                  background: isActive ? `${accent}12` : 'transparent',
                  borderLeft: isActive ? `2px solid ${accent}` : '2px solid transparent',
                  opacity: isSent ? 0.5 : 1,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!isActive && !isSent) e.currentTarget.style.background = t.rowHover; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? accent : t.text }}>{client.name}</span>
                  {isSent
                    ? <span style={{ fontSize: 10, color: '#3a9e75', fontWeight: 600 }}>✓ Sent</span>
                    : <span style={{ background: 'rgba(224,149,42,0.15)', color: '#e0952a', fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4 }}>{client.pendingDocs} pending</span>
                  }
                </div>
                <div style={{ fontSize: 11, color: t.muted }}>{client.type} · {client.phone}</div>
              </div>
            );
          })}
        </div>

        {/* Draft Panel */}
        <div>
          {!selectedClient ? (
            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: t.muted, gap: 10 }}>
              <i className="ti ti-arrow-left" style={{ fontSize: 28, opacity: 0.4 }} />
              <span style={{ fontSize: 13 }}>Select a client to draft a reminder</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Client + Channel selection */}
              <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: accent }}>
                    {selectedClientData.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{selectedClientData.name}</div>
                    <div style={{ fontSize: 12, color: t.muted }}>{selectedClientData.pendingDocs} document(s) pending · {selectedClientData.phone}</div>
                  </div>
                </div>

                {/* Channel toggle */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: t.muted, marginBottom: 8 }}>Send via</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['whatsapp', 'email'].map(ch => (
                      <button key={ch} onClick={() => { setChannel(ch); setGeneratedMsg(''); }}
                        style={{
                          padding: '7px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                          background: channel === ch ? accent : 'transparent',
                          border: `1px solid ${channel === ch ? accent : t.inputBorder}`,
                          color: channel === ch ? '#fff' : t.muted,
                          display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
                        }}>
                        <i className={`ti ${ch === 'whatsapp' ? 'ti-brand-whatsapp' : 'ti-mail'}`} />
                        {ch.charAt(0).toUpperCase() + ch.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom note */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: t.muted, marginBottom: 6 }}>Additional note for Claude (optional)</div>
                  <input
                    placeholder="e.g. deadline is 31st May, urgent..."
                    value={customNote}
                    onChange={e => setCustomNote(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <button onClick={generateMessage} disabled={loading}
                  style={{ background: accent, border: 'none', color: '#fff', padding: '9px 20px', borderRadius: 6, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}>
                  <i className={`ti ${loading ? 'ti-loader-2' : 'ti-sparkles'}`} style={{ fontSize: 16 }} />
                  {loading ? 'Drafting...' : 'Draft with Claude'}
                </button>
              </div>

              {/* Generated Message */}
              {generatedMsg && (
                <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 20px', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <i className="ti ti-sparkles" style={{ color: accent, fontSize: 16 }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Generated Message</span>
                    </div>
                    <button onClick={generateMessage}
                      style={{ background: 'transparent', border: `1px solid ${t.inputBorder}`, color: t.muted, padding: '4px 10px', borderRadius: 5, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <i className="ti ti-refresh" /> Regenerate
                    </button>
                  </div>

                  {/* Message text */}
                  <div style={{ padding: 20 }}>
                    <textarea
                      value={generatedMsg}
                      onChange={e => setGeneratedMsg(e.target.value)}
                      rows={8}
                      style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, fontFamily: 'inherit' }}
                    />
                  </div>

                  {/* Actions */}
                  <div style={{ padding: '14px 20px', borderTop: `1px solid ${t.border}`, display: 'flex', gap: 10 }}>
                    <button onClick={copyToClipboard}
                      style={{ background: 'transparent', border: `1px solid ${t.inputBorder}`, color: t.text, padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <i className="ti ti-copy" /> Copy
                    </button>
                    <button onClick={() => markSent(selectedClient)}
                      style={{ background: '#3a9e75', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <i className="ti ti-check" /> Mark as Sent
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
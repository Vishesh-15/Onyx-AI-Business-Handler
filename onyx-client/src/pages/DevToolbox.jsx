import { useState, useEffect, useRef } from 'react';

const MASTER_PASSWORD = 'onyx@2025';
const DANGER_PASSWORD = 'onyx@danger';

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'JetBrains Mono', monospace; }
  input { font-family: 'JetBrains Mono', monospace; }
  button { font-family: 'JetBrains Mono', monospace; }
  @keyframes shake { 0%,100%{transform:translateX(0)} 15%,45%,75%{transform:translateX(-10px)} 30%,60%,90%{transform:translateX(10px)} }
  @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes greenFlash { 0%{background:rgba(58,210,120,0.15)} 100%{background:transparent} }
  @keyframes redFlash { 0%{background:rgba(255,60,60,0.18)} 100%{background:transparent} }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes slideIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
  @keyframes matrix { 0%{opacity:1} 100%{opacity:0; transform:translateY(100px)} }
  .onyx-input:focus { border-color: #c8fb4e !important; box-shadow: 0 0 0 2px rgba(200,251,78,0.1) !important; outline: none; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #2a2a2e; border-radius: 2px; }
`;

const T = {
  bg: '#07070a', card: '#0f0f13', card2: '#0a0a0d',
  border: '#18181e', border2: '#222228',
  text: '#e2e2de', muted: '#44444a', muted2: '#77777d',
  accent: '#c8fb4e', green: '#3ad278', red: '#ff4444',
  accentDim: 'rgba(200,251,78,0.08)', accentBorder: 'rgba(200,251,78,0.2)',
};

const iStyle = { width: '100%', background: T.bg, border: `1px solid ${T.border2}`, borderRadius: 8, padding: '11px 14px', color: T.text, fontSize: 13, outline: 'none', transition: 'border-color 0.2s' };

function HexGrid({ opacity = 0.04 }) {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity }} xmlns="http://www.w3.org/2000/svg">
      <defs><pattern id="hexgrid" x="0" y="0" width="56" height="48.5" patternUnits="userSpaceOnUse"><polygon points="14,2 42,2 56,24.25 42,46.5 14,46.5 0,24.25" fill="none" stroke="#c8fb4e" strokeWidth="0.5"/></pattern></defs>
      <rect width="100%" height="100%" fill="url(#hexgrid)"/>
    </svg>
  );
}

function Scanlines() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 10 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to bottom, transparent, rgba(200,251,78,0.015), transparent)', animation: 'scanline 6s linear infinite' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)' }} />
    </div>
  );
}

function Watermark() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', overflow: 'hidden' }}>
      <div style={{ fontSize: 200, fontWeight: 900, color: 'rgba(200,251,78,0.018)', letterSpacing: '-0.05em', userSelect: 'none', lineHeight: 1 }}>ONYX</div>
    </div>
  );
}

function SystemBar() {
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 28, background: 'rgba(7,7,10,0.95)', borderBottom: `1px solid ${T.border2}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', zIndex: 100, backdropFilter: 'blur(8px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 9, color: T.accent, fontWeight: 700, letterSpacing: '0.2em' }}>◆ ONYX DEV v1.0</span>
        <span style={{ fontSize: 9, color: T.muted }}>|</span>
        <span style={{ fontSize: 9, color: T.muted2, letterSpacing: '0.1em' }}>AUTHORIZED ACCESS ONLY</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 9, color: T.muted, fontFamily: 'monospace' }}>{time}</span>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#ff5f57','#febc2e','#28c840'].map((c,i) => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.8 }} />)}
        </div>
      </div>
    </div>
  );
}

const BOOT_LINES = [
  { text: 'ONYX SYSTEM v1.0.0', delay: 0, color: T.accent, bold: true },
  { text: 'Initializing secure environment...', delay: 350, color: T.muted2 },
  { text: 'Loading encrypted config layer... OK', delay: 750, color: T.muted2 },
  { text: 'Verifying system integrity... PASS', delay: 1150, color: T.green },
  { text: 'Mounting dev toolbox modules... DONE', delay: 1550, color: T.muted2 },
  { text: 'AUTH REQUIRED — MASTER PASSWORD NEEDED', delay: 1950, color: T.accent, bold: true },
];

function BootScreen({ onDone }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(i + 1);
        if (i === BOOT_LINES.length - 1) setTimeout(() => setDone(true), 600);
      }, line.delay);
    });
  }, []);
  useEffect(() => { if (done) setTimeout(onDone, 400); }, [done]);
  return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <HexGrid /><Watermark /><Scanlines /><SystemBar />
      <div style={{ position: 'relative', zIndex: 1, width: 520, paddingTop: 28 }}>
        {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} style={{ fontSize: 12, color: line.color, fontWeight: line.bold ? 700 : 400, marginBottom: 8, letterSpacing: '0.05em', animation: 'slideIn 0.2s ease' }}>
            <span style={{ color: T.muted, marginRight: 12 }}>{String(i).padStart(2,'0')}</span>{line.text}
            {i === visibleLines - 1 && <span style={{ animation: 'blink 1s infinite', marginLeft: 4 }}>▌</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function PasswordScreen({ onUnlock }) {
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState(false);
  const [flash, setFlash] = useState(null);
  const inputRef = useRef();
  useEffect(() => { inputRef.current?.focus(); }, []);
  const attempt = () => {
    if (pwd === MASTER_PASSWORD) {
      setFlash('green');
      setTimeout(onUnlock, 500);
    } else {
      setError(true);
      setFlash('red');
      setPwd('');
      setTimeout(() => { setError(false); setFlash(null); }, 800);
    }
  };
  return (
    <div style={{ minHeight: '100vh', background: flash === 'green' ? 'rgba(58,210,120,0.05)' : flash === 'red' ? 'rgba(255,68,68,0.05)' : T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s', position: 'relative', overflow: 'hidden' }}>
      <HexGrid /><Watermark /><Scanlines /><SystemBar />
      <div style={{ position: 'relative', zIndex: 1, width: 360, animation: error ? 'shake 0.4s ease' : 'fadeInUp 0.4s ease', paddingTop: 28 }}>
        <div style={{ background: T.card, border: `1px solid ${error ? T.red : T.border2}`, borderRadius: 16, padding: '40px 36px', boxShadow: `0 40px 80px rgba(0,0,0,0.8)`, textAlign: 'center', transition: 'border-color 0.2s' }}>
          <div style={{ fontSize: 9, color: T.accent, letterSpacing: '0.2em', marginBottom: 16 }}>◆ ONYX SYSTEM</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: T.text, marginBottom: 6, letterSpacing: '-0.02em' }}>Dev Toolbox</div>
          <div style={{ height: 2, width: 40, background: T.accent, margin: '0 auto 28px', borderRadius: 1 }} />
          <div style={{ fontSize: 9, color: T.muted2, letterSpacing: '0.12em', marginBottom: 16 }}>ENTER MASTER PASSWORD TO CONTINUE</div>
          <input ref={inputRef} type="password" value={pwd} onChange={e => setPwd(e.target.value)} onKeyDown={e => e.key === 'Enter' && attempt()} className="onyx-input" style={{ ...iStyle, textAlign: 'center', letterSpacing: '0.3em', marginBottom: 14, fontSize: 16 }} placeholder="••••••••••" />
          {error && <div style={{ fontSize: 10, color: T.red, marginBottom: 12, animation: 'fadeIn 0.2s' }}>ACCESS DENIED</div>}
          <button onClick={attempt} style={{ width: '100%', background: T.accent, border: 'none', color: T.bg, padding: '13px 0', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 800, letterSpacing: '0.15em' }}>
            UNLOCK →
          </button>
        </div>
      </div>
    </div>
  );
}

// Easter egg — Matrix rain
function MatrixRain({ onClose }) {
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cols = Math.floor(canvas.width / 16);
    const drops = Array(cols).fill(1);
    const chars = 'ONYX0123456789ABCDEF◆◇▲▼';
    const interval = setInterval(() => {
      ctx.fillStyle = 'rgba(7,7,10,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#c8fb4e';
      ctx.font = '14px JetBrains Mono, monospace';
      drops.forEach((y, i) => {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 16, y * 16);
        if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={onClose}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, textAlign: 'center', fontSize: 10, color: T.accent, letterSpacing: '0.2em', animation: 'blink 2s infinite' }}>
        CLICK ANYWHERE TO EXIT
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border2}`, borderRadius: 10, marginBottom: 12, overflow: 'hidden' }}>
      <div style={{ padding: '10px 16px', borderBottom: `1px solid ${T.border}`, fontSize: 9, color: T.muted2, letterSpacing: '0.15em' }}>{title}</div>
      <div>{children}</div>
    </div>
  );
}

function Row({ label, sub, children, danger }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: `1px solid ${T.border}` }}>
      <div>
        <div style={{ fontSize: 12, color: danger ? T.red : T.text }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

function Btn({ onClick, children, color, small }) {
  return (
    <button onClick={onClick} style={{ background: 'transparent', border: `1px solid ${color || T.border2}`, color: color || T.muted2, padding: small ? '4px 10px' : '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 10, letterSpacing: '0.05em', transition: 'all 0.15s', fontFamily: 'JetBrains Mono, monospace' }}>
      {children}
    </button>
  );
}

function DevOptions() {
  const [pingResult, setPingResult] = useState(null);
  const [pinging, setPinging] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);
  const [logs] = useState([
    { time: '14:32:01', type: 'INFO', msg: 'App initialized' },
    { time: '14:32:02', type: 'INFO', msg: 'Config loaded from storage' },
    { time: '14:32:04', type: 'WARN', msg: 'Backend ping timeout — retrying' },
    { time: '14:32:05', type: 'INFO', msg: 'Backend connected' },
    { time: '14:35:11', type: 'INFO', msg: 'User authenticated' },
  ]);
  const [showMatrix, setShowMatrix] = useState(false);
  const [dangerPwd, setDangerPwd] = useState('');
  const [dangerUnlocked, setDangerUnlocked] = useState(false);
  const [dangerError, setDangerError] = useState(false);
  const [showClassified, setShowClassified] = useState(false);
  const [resetState, setResetState] = useState(null); // null | 'progress' | 'joke'
  const [resetProgress, setResetProgress] = useState(0);
  const [backendState, setBackendState] = useState(null); // null | 'alarm' | 'joke'
  const [showRickRoll, setShowRickRoll] = useState(false);

  const handleReset = async () => {
    setResetState('progress');
    setResetProgress(0);
    const steps = [
      { msg: 'Wiping user data...', pct: 20 },
      { msg: 'Deleting config...', pct: 45 },
      { msg: 'Resetting modules...', pct: 70 },
      { msg: 'Destroying everything...', pct: 90 },
      { msg: 'lol just kidding 😂', pct: 100 },
    ];
    for (const step of steps) {
      await new Promise(r => setTimeout(r, 500));
      setResetProgress(step.pct);
    }
    await new Promise(r => setTimeout(r, 400));
    setResetState('joke');
  };

  const handleBackendEdit = async () => {
    setBackendState('alarm');
    await new Promise(r => setTimeout(r, 2500));
    setBackendState('joke');
  };
  const [konamiStep, setKonamiStep] = useState(0);
  const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

  useEffect(() => {
    const handler = (e) => {
      if (e.key === konamiCode[konamiStep]) {
        const next = konamiStep + 1;
        setKonamiStep(next);
        if (next === konamiCode.length) { setShowClassified(true); setKonamiStep(0); }
      } else setKonamiStep(0);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [konamiStep]);

  const handlePing = async () => {
    setPinging(true);
    setPingResult(null);
    const start = Date.now();
    await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
    setPingResult(`${Date.now() - start}ms — OK`);
    setPinging(false);
  };

  const handleSync = async () => {
    setSyncing(true);
    await new Promise(r => setTimeout(r, 1200));
    setSyncing(false);
    setSyncDone(true);
    setTimeout(() => setSyncDone(false), 2000);
  };

  const handleClearCache = () => {
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2000);
  };

  const handleDangerUnlock = () => {
    if (dangerPwd === DANGER_PASSWORD) { setDangerUnlocked(true); setDangerError(false); }
    else { setDangerError(true); setTimeout(() => setDangerError(false), 1500); }
    setDangerPwd('');
  };

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: 'JetBrains Mono, monospace', position: 'relative', overflow: 'hidden' }}>
      <HexGrid /><Watermark /><Scanlines /><SystemBar />
      {showMatrix && <MatrixRain onClose={() => setShowMatrix(false)} />}

      {/* Classified easter egg */}
      {showClassified && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 998, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.3s' }} onClick={() => setShowClassified(false)}>
          <div style={{ textAlign: 'center', animation: 'fadeInUp 0.4s' }}>
            <div style={{ fontSize: 11, color: T.accent, letterSpacing: '0.3em', marginBottom: 20 }}>◆ ONYX CLASSIFIED</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: T.text, marginBottom: 8 }}>Built by Kanha</div>
            <div style={{ fontSize: 13, color: T.muted2, marginBottom: 6 }}>CBR150R · Lynora · Rides at dawn</div>
            <div style={{ fontSize: 10, color: T.muted, marginTop: 20, letterSpacing: '0.1em' }}>You found the easter egg. Nice.</div>
            <div style={{ fontSize: 9, color: T.muted, marginTop: 8 }}>click to close</div>
          </div>
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto', padding: '48px 24px 40px', paddingTop: 60 }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 9, color: T.muted2, letterSpacing: '0.2em', marginBottom: 8 }}>ONYX / DEV OPTIONS</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: '-0.02em' }}>Developer Options</div>
        </div>

        {/* System Info */}
        <Section title="SYSTEM INFO">
          <Row label="App Version" sub="Current build"><span style={{ fontSize: 11, color: T.accent, fontFamily: 'monospace' }}>v1.0.0</span></Row>
          <Row label="Client UID" sub="Read only"><span style={{ fontSize: 11, color: T.muted2, fontFamily: 'monospace' }}>Loaded from config</span></Row>
          <Row label="Backend URL" sub="Active endpoint"><span style={{ fontSize: 11, color: T.muted2, fontFamily: 'monospace' }}>onyx-backend.render.com</span></Row>
          <Row label="Last Sync" sub="Config refresh"><span style={{ fontSize: 11, color: T.muted2, fontFamily: 'monospace' }}>{new Date().toLocaleTimeString()}</span></Row>
          <Row label="Platform" sub="Device info"><span style={{ fontSize: 11, color: T.muted2, fontFamily: 'monospace' }}>{navigator.platform || 'Unknown'}</span></Row>
        </Section>

        {/* Connection */}
        <Section title="CONNECTION">
          <Row label="Ping Backend" sub={pingResult || 'Test server response time'}>
            <Btn onClick={handlePing} color={T.accent}>
              {pinging ? '...' : pingResult ? pingResult : 'Ping →'}
            </Btn>
          </Row>
          <Row label="Force Sync" sub="Re-fetch config from backend">
            <Btn onClick={handleSync} color={syncDone ? T.green : T.border2}>
              {syncing ? 'Syncing...' : syncDone ? '✓ Done' : 'Sync'}
            </Btn>
          </Row>
        </Section>

        {/* Cache */}
        <Section title="CACHE & STORAGE">
          <Row label="Storage Usage" sub="Local app data"><span style={{ fontSize: 11, color: T.muted2, fontFamily: 'monospace' }}>~2.4 MB</span></Row>
          <Row label="Clear App Cache" sub="Removes cached UI data, not user data">
            <Btn onClick={handleClearCache} color={cacheCleared ? T.green : T.border2}>
              {cacheCleared ? '✓ Cleared' : 'Clear'}
            </Btn>
          </Row>
        </Section>

        {/* Debug */}
        <Section title="DEBUG">
          <Row label="Error Logs" sub={`${logs.filter(l=>l.type==='WARN').length} warnings`}>
            <Btn color={T.border2}>View</Btn>
          </Row>
          <div style={{ padding: '10px 16px', borderBottom: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 9, color: T.muted2, letterSpacing: '0.1em', marginBottom: 8 }}>CONSOLE — LAST {logs.length} ENTRIES</div>
            {logs.map((log, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, fontSize: 10, marginBottom: 4, fontFamily: 'monospace' }}>
                <span style={{ color: T.muted }}>{log.time}</span>
                <span style={{ color: log.type === 'WARN' ? T.accent : log.type === 'ERR' ? T.red : T.green, width: 32 }}>{log.type}</span>
                <span style={{ color: T.muted2 }}>{log.msg}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Easter eggs */}
        <Section title="EXTRAS">
          <Row label="Matrix Mode" sub="Because why not">
            <Btn onClick={() => setShowMatrix(true)} color={T.accent}>Launch</Btn>
          </Row>
          <Row label="Konami Code" sub="↑↑↓↓←→←→BA on keyboard">
            <span style={{ fontSize: 10, color: T.muted }}>Try it</span>
          </Row>
        </Section>

        {/* Danger Zone */}
        <Section title="⚠ DANGER ZONE">
          {!dangerUnlocked ? (
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: 10, color: T.muted, marginBottom: 12 }}>Enter danger password to unlock destructive options</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="password" value={dangerPwd} onChange={e => setDangerPwd(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleDangerUnlock()} placeholder="Danger password" className="onyx-input" style={{ ...iStyle, flex: 1, fontSize: 11 }} />
                <Btn onClick={handleDangerUnlock} color={T.red}>Unlock</Btn>
              </div>
              {dangerError && <div style={{ fontSize: 10, color: T.red, marginTop: 8 }}>Wrong password</div>}
            </div>
          ) : (
            <>
              {/* Reset prank */}
              {resetState === null && (
                <Row label="Reset App" sub="Full wipe — returns to fresh setup" danger>
                  <Btn onClick={handleReset} color={T.red}>Reset</Btn>
                </Row>
              )}
              {resetState === 'progress' && (
                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: 10, color: T.red, marginBottom: 10, letterSpacing: '0.05em' }}>
                    {resetProgress < 100 ? `Wiping... ${resetProgress}%` : 'lol just kidding 😂'}
                  </div>
                  <div style={{ height: 4, background: T.border2, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${resetProgress}%`, background: resetProgress === 100 ? T.green : T.red, borderRadius: 2, transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              )}
              {resetState === 'joke' && (
                <div style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 20, marginBottom: 8 }}>😂</div>
                  <div style={{ fontSize: 12, color: T.green, fontWeight: 700 }}>NOTHING WAS DELETED</div>
                  <div style={{ fontSize: 10, color: T.muted, marginTop: 6 }}>Relax. Your data is fine.</div>
                  <Btn onClick={() => setResetState(null)} color={T.border2}>
                    <span style={{ fontSize: 10 }}>ok ok close</span>
                  </Btn>
                </div>
              )}

              {/* Backend URL prank */}
              {backendState === null && (
                <Row label="Change Backend URL" sub="Override active endpoint" danger>
                  <Btn onClick={handleBackendEdit} color={T.red}>Edit</Btn>
                </Row>
              )}
              {backendState === 'alarm' && (
                <div style={{ padding: '16px', background: 'rgba(255,68,68,0.08)', animation: 'shake 0.4s ease infinite', textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>🚨</div>
                  <div style={{ fontSize: 13, color: T.red, fontWeight: 800, letterSpacing: '0.1em' }}>⚠ CRITICAL SYSTEM ERROR</div>
                  <div style={{ fontSize: 10, color: T.muted2, marginTop: 6 }}>UNAUTHORIZED ACCESS DETECTED</div>
                  <div style={{ fontSize: 10, color: T.muted2 }}>CONTACTING DEVELOPER...</div>
                </div>
              )}
              {backendState === 'joke' && (
                <div style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 20, marginBottom: 8 }}>💀</div>
                  <div style={{ fontSize: 12, color: T.accent, fontWeight: 700 }}>lol relax</div>
                  <div style={{ fontSize: 10, color: T.muted, marginTop: 6 }}>Nothing happened. I lied about the alarm too.</div>
                  <div style={{ marginTop: 12 }}>
                    <Btn onClick={() => setBackendState(null)} color={T.border2}>
                      <span style={{ fontSize: 10 }}>😭 fine</span>
                    </Btn>
                  </div>
                </div>
              )}

              {/* Rick Roll button */}
              <div style={{ padding: '12px 16px', borderTop: `1px solid ${T.border}` }}>
                <button
                  onClick={() => setShowRickRoll(true)}
                  style={{ background: 'rgba(255,68,68,0.05)', border: `1px dashed ${T.red}`, color: T.red, cursor: 'pointer', fontSize: 10, letterSpacing: '0.08em', width: '100%', padding: '10px', borderRadius: 6, fontFamily: 'JetBrains Mono, monospace', opacity: 0.6 }}
                >
                   ⚠ EMERGENCY OVERRIDE — AUTHORIZED ONLY
                </button>
              </div>
            </>
          )}
        </Section>

        {/* Rick Roll overlay */}
        {showRickRoll && (
          <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.3s' }}>
            <div style={{ fontSize: 11, color: T.accent, letterSpacing: '0.2em', marginBottom: 20 }}>YOU JUST GOT</div>
            <div style={{ fontSize: 48, fontWeight: 900, color: T.text, letterSpacing: '-0.03em', marginBottom: 8 }}>RICK ROLLED</div>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 32 }}>Never gonna give you up 🎵</div>
            <iframe
              width="480" height="270"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              allow="autoplay"
              style={{ borderRadius: 12, border: `1px solid ${T.border2}` }}
              title="rick"
            />
            <button onClick={() => setShowRickRoll(false)} style={{ marginTop: 24, background: 'none', border: `1px solid ${T.border2}`, color: T.muted, padding: '8px 20px', borderRadius: 6, cursor: 'pointer', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>
              escape 😭
            </button>
          </div>
        )}

        <div style={{ textAlign: 'center', fontSize: 9, color: T.muted, letterSpacing: '0.1em', marginTop: 8 }}>
          ONYX DEV OPTIONS · AUTHORIZED PERSONNEL ONLY
        </div>
      </div>
    </div>
  );
}

export default function DevToolbox() {
  const [screen, setScreen] = useState('boot');
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      {screen === 'boot'     && <BootScreen     onDone={() => setScreen('password')} />}
      {screen === 'password' && <PasswordScreen onUnlock={() => setScreen('options')} />}
      {screen === 'options'  && <DevOptions />}
    </>
  );
}
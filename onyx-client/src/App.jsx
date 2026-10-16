import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Deadlines from './pages/Deadlines';
import Documents from './pages/Documents';
import Reminders from './pages/Reminders';
import Settings from './pages/Settings';
import DevToolbox from './pages/DevToolbox';
import ReportIssueModal from './components/ReportIssueModal';
import { loginClient } from './api/api';

const pageConfig = {
  dashboard: { title: 'Dashboard',  subtitle: 'Overview of your workspace' },
  clients:   { title: 'Clients',    subtitle: 'Manage your client accounts' },
  deadlines: { title: 'Deadlines',  subtitle: 'GST / ITR filing deadlines' },
  documents: { title: 'Documents',  subtitle: 'Document checklist per client' },
  reminders: { title: 'Reminders',  subtitle: 'Draft and send client reminders' },
  settings:  { title: 'Settings',   subtitle: 'Account and preferences' },
};

const moduleComponents = {
  dashboard: Dashboard,
  clients:   Clients,
  deadlines: Deadlines,
  documents: Documents,
  reminders: Reminders,
  settings:  Settings,
};

// ── LOGIN SCREEN ──────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [uid, setUid] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!uid || !password) return;
    setLoading(true);
    setError('');
    try {
      const result = await loginClient(uid, password);
      if (result.token) {
        localStorage.setItem('onyx_token', result.token);
        localStorage.setItem('onyx_uid', result.uid);
        onLogin(result);
      } else {
        setError(result.detail || 'Invalid credentials');
      }
    } catch {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', background: '#0a0a0c', border: '1px solid #222',
    borderRadius: 8, padding: '12px 14px', color: '#e8e8e6',
    fontSize: 14, outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#07070a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div style={{ width: 380, background: '#0f0f13', border: '1px solid #1a1a1e', borderRadius: 16, padding: '40px 36px', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: '#555', letterSpacing: '0.2em', marginBottom: 12 }}>◆ ONYX</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#e8e8e6', marginBottom: 6 }}>Welcome back</div>
          <div style={{ fontSize: 13, color: '#555' }}>Sign in to your workspace</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: '#555', letterSpacing: '0.1em', marginBottom: 6 }}>CLIENT UID</div>
            <input
              style={inp}
              value={uid}
              onChange={e => setUid(e.target.value)}
              placeholder="e.g. SH-4829-K"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#555', letterSpacing: '0.1em', marginBottom: 6 }}>PASSWORD</div>
            <div style={{ position: 'relative' }}>
              <input
                style={{ ...inp, paddingRight: 40 }}
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
              <button onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 15 }}>
                <i className={`ti ${showPwd ? 'ti-eye-off' : 'ti-eye'}`} />
              </button>
            </div>
          </div>

          {error && (
            <div style={{ fontSize: 12, color: '#e24b4a', background: 'rgba(226,75,74,0.08)', padding: '8px 12px', borderRadius: 6, border: '1px solid rgba(226,75,74,0.2)' }}>
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !uid || !password}
            style={{ background: uid && password ? '#3a9e75' : '#1a1a1e', color: uid && password ? '#fff' : '#444', border: 'none', padding: '13px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: uid && password ? 'pointer' : 'not-allowed', marginTop: 8, transition: 'background 0.2s' }}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: '#333' }}>
          Contact your administrator for access
        </div>
      </div>
    </div>
  );
}

// ── AGENTS NOT READY POPUP ────────────────────────────────
function AgentsNotReadyPopup({ onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
      <div style={{ background: '#131315', border: '1px solid #2a2a2e', borderRadius: 12, padding: '32px 36px', width: 400, textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>🤖</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#e8e8e6', marginBottom: 8 }}>Agents Coming Soon</div>
        <div style={{ fontSize: 13, color: '#666', lineHeight: 1.6, marginBottom: 24 }}>
          AI agents are not connected yet. Your workspace is ready — agents will be activated shortly by your administrator.
        </div>
        <button onClick={onClose} style={{ background: '#3a9e75', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
          Got it
        </button>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(null); // { token, uid, clientName, modules, theme }
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showDevToolbox, setShowDevToolbox] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showAgentsPopup, setShowAgentsPopup] = useState(false);

  // Check existing session
  useEffect(() => {
    const token = localStorage.getItem('onyx_token');
    const uid = localStorage.getItem('onyx_uid');
    if (token && uid) {
      // TODO: verify token with backend
      // For now just restore basic session
    }
  }, []);

  // Ctrl+Shift+D → Dev Toolbox
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setShowDevToolbox(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Show agents popup on first dashboard load
  useEffect(() => {
    if (session) {
      setTimeout(() => setShowAgentsPopup(true), 1000);
    }
  }, [session]);

  if (showDevToolbox) return <DevToolbox />;
  if (!session) return <LoginScreen onLogin={setSession} />;

  const accent = session.theme || '#3a9e75';
  const allModules = [...(session.modules || []), 'settings'];

  const renderPage = () => {
    if (!allModules.includes(currentPage)) {
      setCurrentPage('dashboard');
      return null;
    }
    const Component = moduleComponents[currentPage];
    return Component
      ? <Component accent={accent} darkMode={darkMode} onDarkModeChange={setDarkMode} />
      : null;
  };

  const page = pageConfig[currentPage] || pageConfig.dashboard;
  const bg = darkMode ? '#0e0e10' : '#f0f0f0';

  const config = {
    clientName: session.clientName,
    modules: session.modules || [],
    themeColor: accent,
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: bg }}>
      <Sidebar
        config={config}
        accent={accent}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        collapsed={sidebarCollapsed}
        darkMode={darkMode}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar
          title={page.title}
          subtitle={page.subtitle}
          accent={accent}
          clientName={session.clientName}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          darkMode={darkMode}
          onReportIssue={() => setShowReport(true)}
        />
        <div style={{ flex: 1, overflowY: 'auto', background: bg }}>
          {renderPage()}
          {showReport && (
            <ReportIssueModal
              onClose={() => setShowReport(false)}
              currentPage={currentPage}
            />
          )}
          {showAgentsPopup && (
            <AgentsNotReadyPopup onClose={() => setShowAgentsPopup(false)} />
          )}
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import './styles/onyx.css';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Agents from './pages/Agents';
import Logs from './pages/Logs';
import Settings from './pages/Settings';
import Billing from './pages/Billing';
import Reports from './pages/Reports';
import ClientDetail from './pages/ClientDetail';
import Invoice from './pages/Invoice';
import AddClientModal from './components/AddClientModal';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [selectedClientUid, setSelectedClientUid] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showAddClientModal, setShowAddClientModal] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setSelectedClientUid(null);
  };

  const handleOpenClient = (uid) => {
    setSelectedClientUid(uid);
    setCurrentPage('client-detail');
  };

  const handleBack = () => {
    setSelectedClientUid(null);
    setCurrentPage('clients');
  };

  const handleOpenInvoice = (bill) => {
    setSelectedInvoice(bill);
    setCurrentPage('invoice');
  };

  const handleSaveClient = (config) => {
    console.log("New client created:", config);
    // TODO: send to backend
  };

  const getPageConfig = () => {
    switch (currentPage) {
      case 'dashboard':     return { title: 'Dashboard', subtitle: 'Overview of all deployments and systems' };
      case 'clients':       return { title: 'Clients', subtitle: 'Manage all client accounts' };
      case 'client-detail': return { title: 'Client Detail', subtitle: `Viewing ${selectedClientUid || ''}` };
      case 'agents':        return { title: 'Agents', subtitle: 'AI agent management and monitoring' };
      case 'reports':       return { title: 'Reports', subtitle: 'System reports and analytics' };
      case 'logs':          return { title: 'Logs', subtitle: 'System logs and activity' };
      case 'settings':      return { title: 'Settings', subtitle: 'Account and system settings' };
      case 'billing':       return { title: 'Billing', subtitle: 'Billing and subscription management' };
      default:              return { title: 'Dashboard', subtitle: 'Overview of all deployments and systems' };
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':     return <Dashboard onOpenClient={handleOpenClient} onAddClient={() => setShowAddClientModal(true)} />;
      case 'clients':       return <Clients onOpenClient={handleOpenClient} />;
      case 'client-detail': return <ClientDetail uid={selectedClientUid} darkMode={darkMode} onBack={handleBack} />;
      case 'agents':        return <Agents darkMode={darkMode} />;
      case 'reports':       return <Reports darkMode={darkMode} />;
      case 'logs':          return <Logs darkMode={darkMode} />;
      case 'billing':       return <Billing darkMode={darkMode} onOpenInvoice={handleOpenInvoice} />;
      case 'settings':      return <Settings darkMode={darkMode} onDarkModeChange={setDarkMode} />;
      case 'invoice':       return <Invoice darkMode={darkMode} bill={selectedInvoice} onBack={() => setCurrentPage('billing')} />;
      default:              return <Dashboard />;
    }
  };

  const pageConfig = getPageConfig();

  return (
    <div className={`onyx-container ${darkMode ? '' : 'light-mode'}`}>
      <Sidebar
        collapsed={sidebarCollapsed}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
      <div className="onyx-main">
        <Topbar
          collapsed={sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          pageTitle={pageConfig.title}
          pageSubtitle={pageConfig.subtitle}
          onAddClient={() => setShowAddClientModal(true)}
        />
        {renderPage()}
        {showAddClientModal && (
          <AddClientModal
            onClose={() => setShowAddClientModal(false)}
            onSave={handleSaveClient}
          />
        )}
      </div>
    </div>
  );
}

export default App;
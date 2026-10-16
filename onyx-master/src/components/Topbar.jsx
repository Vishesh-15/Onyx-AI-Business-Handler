export const Topbar = ({ onToggleSidebar, pageTitle, pageSubtitle, onAddClient }) => {
  return (
    <div className="onyx-topbar">
      <button
        className="onyx-hamburger"
        onClick={onToggleSidebar}
        data-testid="sidebar-toggle"
      >
        <i className="ti ti-menu-2"></i>
      </button>

      <div className="onyx-page-title">
        <h1>{pageTitle}</h1>
        <p>{pageSubtitle}</p>
      </div>

      <div className="onyx-topbar-actions">
        <button className="onyx-btn onyx-btn-outline" onClick={onAddClient} data-testid="add-client-btn">
          <i className="ti ti-plus"></i>
          Add client
        </button>
        <button className="onyx-btn onyx-btn-primary" data-testid="deploy-update-btn">
          <i className="ti ti-upload"></i>
          Deploy update
        </button>
      </div>
    </div>
  );
};
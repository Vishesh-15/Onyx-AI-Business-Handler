import { useState, useMemo } from "react";
import { clients } from "../dummyData";

export const ClientsTable = ({ onOpenClient }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedClients = useMemo(() => {
    let filtered = clients.filter((client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.uid.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === 'modules') {
          aVal = a.modules.length;
          bVal = b.modules.length;
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [searchQuery, sortConfig]);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return 'ti-selector';
    return sortConfig.direction === 'asc' ? 'ti-chevron-up' : 'ti-chevron-down';
  };

  return (
    <div className="onyx-table-container">
      <div className="onyx-table-header">
        <div className="onyx-table-title">Clients</div>
        <div className="onyx-search-box">
          <i className="ti ti-search"></i>
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="client-search-input"
          />
        </div>
      </div>

      <table className="onyx-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')} data-testid="sort-name">
              Client <i className={`ti ${getSortIcon('name')}`}></i>
            </th>
            <th onClick={() => handleSort('status')} data-testid="sort-status">
              Status <i className={`ti ${getSortIcon('status')}`}></i>
            </th>
            <th onClick={() => handleSort('modules')} data-testid="sort-modules">
              Modules <i className={`ti ${getSortIcon('modules')}`}></i>
            </th>
            <th onClick={() => handleSort('uid')} data-testid="sort-uid">
              UID <i className={`ti ${getSortIcon('uid')}`}></i>
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedClients.map((client) => (
            <tr key={client.id} data-testid={`client-row-${client.id}`}>
              <td>
                <div className="onyx-client-info">
                  <div className="onyx-client-name">{client.name}</div>
                  <div className="onyx-client-type">{client.type}</div>
                </div>
              </td>
              <td>
                <div className={`onyx-status-pill ${client.status}`}>
                  <span className="onyx-status-dot"></span>
                  {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                </div>
              </td>
              <td>
                <div className="onyx-modules">
                  {client.modules.map((module, idx) => (
                    <span key={idx} className="onyx-module-tag">{module}</span>
                  ))}
                </div>
              </td>
              <td>
                <div className="onyx-uid">{client.uid}</div>
              </td>
              <td>
                <button
                  className="onyx-btn onyx-btn-outline"
                  data-testid={`open-client-${client.id}`}
                  onClick={() => onOpenClient && onOpenClient(client.uid)}
                >
                  <i className="ti ti-eye"></i> Open
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredAndSortedClients.length === 0 && (
        <div className="onyx-empty-state">
          <i className="ti ti-search"></i>
          <p>No clients found matching your search.</p>
        </div>
      )}
    </div>
  );
};
import { stats } from '../dummyData';

export const StatsRow = () => {
  return (
    <div className="onyx-stats-row">
      <div className="onyx-stat-card" data-testid="stat-total-clients">
        <div className="onyx-stat-label">Total Clients</div>
        <div className="onyx-stat-value">{stats.totalClients}</div>
        <div className="onyx-stat-change positive">+12% from last month</div>
      </div>

      <div className="onyx-stat-card" data-testid="stat-active-agents">
        <div className="onyx-stat-label">Active Agents</div>
        <div className="onyx-stat-value">{stats.activeAgents}</div>
        <div className="onyx-stat-change positive">+2 this week</div>
      </div>

      <div className="onyx-stat-card" data-testid="stat-open-issues">
        <div className="onyx-stat-label">Open Issues</div>
        <div className="onyx-stat-value">{stats.openIssues}</div>
        <div className="onyx-stat-change negative">Needs attention</div>
      </div>

      <div className="onyx-stat-card" data-testid="stat-monthly-revenue">
        <div className="onyx-stat-label">Monthly Revenue</div>
        <div className="onyx-stat-value">{stats.monthlyRevenue}</div>
        <div className="onyx-stat-change positive">+8% from last month</div>
      </div>
    </div>
  );
};
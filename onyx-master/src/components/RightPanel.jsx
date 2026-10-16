import { issues, agents } from "../dummyData";

export const RightPanel = () => {
  return (
    <div className="onyx-content-sidebar">
      <div className="onyx-panel-card">
        <div className="onyx-panel-header">Recent Issues</div>
        <div className="onyx-panel-content">
          {issues.map((issue) => (
            <div key={issue.id} className="onyx-issue-item" data-testid={`issue-${issue.id}`}>
              <div className="onyx-issue-header">
                <span className="onyx-issue-uid">{issue.uid}</span>
                <span className="onyx-issue-client">• {issue.client}</span>
              </div>
              <div className="onyx-issue-text">{issue.text}</div>
              <div className="onyx-issue-time">{issue.time}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="onyx-panel-card">
        <div className="onyx-panel-header">Agent Health</div>
        <div className="onyx-panel-content">
          {agents.map((agent) => (
            <div key={agent.id} className="onyx-agent-item" data-testid={`agent-${agent.id}`}>
              <div className="onyx-agent-name">{agent.name}</div>
              <div className={`onyx-agent-status ${agent.status}`}>
                <span className="onyx-status-dot"></span>
                {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
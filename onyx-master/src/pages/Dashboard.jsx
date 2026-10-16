import { StatsRow } from '../components/StatsRow';
import { ClientsTable } from '../components/ClientsTable';
import { RightPanel } from '../components/RightPanel';

export default function Dashboard({ onOpenClient }) {
  return (
    <div className="onyx-content">
      <div className="onyx-content-main">
        <StatsRow />
        <ClientsTable onOpenClient={onOpenClient} />
      </div>
      <RightPanel />
    </div>
  );
}
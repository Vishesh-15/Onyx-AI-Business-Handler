import { ClientsTable } from '../components/ClientsTable';

export default function Clients({ onOpenClient }) {
  return (
    <div className="onyx-content">
      <div className="onyx-content-main">
        <ClientsTable onOpenClient={onOpenClient} />
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import NodeCard from '../components/NodeCard/NodeCard';
import { fetchNodes } from '../api/index';

const NodesDashboard = ({ nodeStatuses, connected }) => {
  const [restNodes, setRestNodes] = useState([]);

  useEffect(() => {
    fetchNodes().then(setRestNodes).catch(console.error);
  }, []);

  // Merge REST baseline with live WebSocket updates
  const merged = new Map();
  restNodes.forEach(n => merged.set(n.device_id, n));
  nodeStatuses.forEach((n, k) => merged.set(k, { device_id: k, ...(merged.get(k) || {}), ...n }));
  const nodes = [...merged.values()];

  return (
    <div className="nodes-dashboard">
      <div className="view-header">
        <h2>Nodos</h2>
        <span className={`ws-indicator ${connected ? 'connected' : 'disconnected'}`}>
          ● {connected ? 'En vivo' : 'Desconectado'}
        </span>
      </div>

      {nodes.length === 0 ? (
        <p className="empty-text">No se han detectado nodos activos.</p>
      ) : (
        <div className="nodes-grid">
          {nodes.map(n => (
            <NodeCard key={n.device_id} node={n} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NodesDashboard;

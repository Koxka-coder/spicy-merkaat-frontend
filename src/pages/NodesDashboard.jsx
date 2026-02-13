import { useState, useEffect } from 'react';

const NodesDashboard = () => {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    // TODO: Fetch nodes from API
    // TODO: Connect to WebSocket for real-time updates
  }, []);

  return (
    <div className="nodes-dashboard">
      <h1>Nodes Dashboard</h1>
      <div className="nodes-grid">
        {/* TODO: Map through nodes and display NodeCard components */}
        <p>Node cards will be displayed here</p>
      </div>
    </div>
  );
};

export default NodesDashboard;

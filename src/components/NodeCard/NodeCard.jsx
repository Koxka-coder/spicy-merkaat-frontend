const NodeCard = ({ node }) => {
  const handleToggle = () => {
    // TODO: Send command to toggle node state via API
  };

  return (
    <div className="node-card">
      <h3>{node?.name || 'Node'}</h3>
      <div className="node-info">
        <p>Status: {node?.status || 'Unknown'}</p>
        <p>Battery: {node?.battery || 'N/A'}%</p>
        <p>Moisture: {node?.moisture || 'N/A'}%</p>
      </div>
      <button onClick={handleToggle}>
        Toggle
      </button>
    </div>
  );
};

export default NodeCard;

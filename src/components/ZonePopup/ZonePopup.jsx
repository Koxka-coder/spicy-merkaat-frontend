const ZonePopup = ({ zone, onClose }) => {
  return (
    <div className="zone-popup">
      <button onClick={onClose} className="close-btn">×</button>
      <h3>{zone?.name || 'Zone'}</h3>
      <div className="zone-info">
        <p>Area: {zone?.area || 'N/A'} m²</p>
        <p>Nodes: {zone?.nodeCount || 0}</p>
        <p>Status: {zone?.status || 'Unknown'}</p>
      </div>
    </div>
  );
};

export default ZonePopup;

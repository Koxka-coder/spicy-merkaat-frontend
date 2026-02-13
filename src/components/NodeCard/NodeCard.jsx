const formatUptime = (s) => {
  if (s == null) return '—';
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

const rssiColor = (rssi) => {
  if (rssi == null) return '#999';
  if (rssi >= -60) return '#4caf50';
  if (rssi >= -70) return '#cddc39';
  if (rssi >= -80) return '#ff9800';
  return '#f44336';
};

const batteryPct = (mv) => {
  if (!mv) return null;
  const pct = Math.round(((mv - 3500) / 700) * 100);
  return Math.max(0, Math.min(100, pct));
};

const toEpochMs = (value) => {
  if (value == null) return null;
  if (typeof value === 'number') {
    return value < 1e12 ? value * 1000 : value;
  }
  const parsed = Date.parse(value);
  if (!Number.isNaN(parsed)) return parsed;
  const asNum = Number(value);
  if (!Number.isNaN(asNum)) return asNum < 1e12 ? asNum * 1000 : asNum;
  return null;
};

const isOnline = (node) => {
  const tsMs = toEpochMs(node?.ts ?? node?.last_seen);
  if (!tsMs) return false;
  const age = (Date.now() - tsMs) / 1000;
  return age < 120;
};

const NodeCard = ({ node }) => {
  const online = isOnline(node);
  const bat = batteryPct(node?.vbat_mv);

  return (
    <div className="node-card">
      <div className="node-card-header">
        <span className="node-name" title={node?.device_id}>
          {node?.device_id || 'Node'}
        </span>
        <span className={`node-badge ${online ? 'online' : 'offline'}`}>
          {online ? 'Online' : 'Offline'}
        </span>
      </div>

      <div className="node-card-grid">
        <div className="node-stat">
          <span className="stat-label">RSSI</span>
          <span className="stat-value" style={{ color: rssiColor(node?.rssi) }}>
            {node?.rssi != null ? `${node.rssi} dBm` : '—'}
          </span>
        </div>

        <div className="node-stat">
          <span className="stat-label">Uptime</span>
          <span className="stat-value">{formatUptime(node?.uptime_s)}</span>
        </div>

        <div className="node-stat">
          <span className="stat-label">Firmware</span>
          <span className="stat-value" style={{ fontFamily: 'monospace' }}>
            {node?.fw_version || '—'}
          </span>
        </div>

        <div className="node-stat">
          <span className="stat-label">Batería</span>
          <span className="stat-value">
            {node?.vbat_mv ? `${(node.vbat_mv / 1000).toFixed(2)} V` : '—'}
            {bat !== null ? ` (${bat}%)` : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NodeCard;

const API_URL = import.meta.env.VITE_API_URL || '';
export const WS_URL = import.meta.env.VITE_WS_URL || '';

// ── Map ───────────────────────────────────────────────────────

/** GeoJSON FeatureCollection con los bancales (zonas) */
export const fetchMapGeo = async () => {
  const res = await fetch(`${API_URL}/api/v1/map/geo`);
  if (!res.ok) throw new Error(`fetchMapGeo: ${res.status}`);
  return res.json();
};

// ── Nodes ─────────────────────────────────────────────────────

/** Lista de nodos con su último estado desde InfluxDB */
export const fetchNodes = async () => {
  const res = await fetch(`${API_URL}/api/v1/nodes/`);
  if (!res.ok) throw new Error(`fetchNodes: ${res.status}`);
  const data = await res.json();
  return data.nodes || [];
};

export const fetchZones = async () => {
  const res = await fetch(`${API_URL}/api/v1/zones/`);
  if (!res.ok) throw new Error(`fetchZones: ${res.status}`);
  const data = await res.json();
  return data.zones || [];
};

export const fetchSchedules = async () => {
  const res = await fetch(`${API_URL}/api/schedules/`);
  if (!res.ok) throw new Error(`fetchSchedules: ${res.status}`);
  const data = await res.json();
  return data.schedules || [];
};

export const createSchedule = async (payload) => {
  const res = await fetch(`${API_URL}/api/schedules/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`createSchedule: ${res.status}`);
  return res.json();
};

export const updateSchedule = async (id, payload) => {
  const res = await fetch(`${API_URL}/api/schedules/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`updateSchedule: ${res.status}`);
  return res.json();
};

export const deleteSchedule = async (id) => {
  const res = await fetch(`${API_URL}/api/schedules/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`deleteSchedule: ${res.status}`);
  return res.json();
};

// ── Telemetría ────────────────────────────────────────────────

/** Historial de moisture_pct para sparkline (24h, ventana 1h) */
export const fetchZoneTelemetry = async (zone_id, device_id, zone_ch) => {
  const params = new URLSearchParams({
    device_id,
    zone_ch: String(zone_ch),
    range_start: '-24h',
    window: '1h',
    field: 'moisture_pct',
  });
  const res = await fetch(`${API_URL}/api/v1/zones/${zone_id}/telemetry?${params}`);
  if (!res.ok) throw new Error(`fetchZoneTelemetry: ${res.status}`);
  return res.json();
};

export const fetchZoneTelemetryLatest = async (zone_id, device_id, zone_ch) => {
  const params = new URLSearchParams({
    device_id,
    zone_ch: String(zone_ch),
  });
  const res = await fetch(`${API_URL}/api/v1/zones/${zone_id}/telemetry/latest?${params}`);
  if (!res.ok) throw new Error(`fetchZoneTelemetryLatest: ${res.status}`);
  return res.json();
};

// ── Comandos de zona ──────────────────────────────────────────

/** Envía comando de riego manual */
export const waterZone = async (zone_id, duration_s = 300) => {
  const res = await fetch(`${API_URL}/api/v1/zones/${zone_id}/water`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ duration_s }),
  });
  if (!res.ok) throw new Error(`waterZone: ${res.status}`);
  return res.json();
};

/** Detiene el riego en curso */
export const stopZone = async (zone_id) => {
  const res = await fetch(`${API_URL}/api/v1/zones/${zone_id}/stop`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error(`stopZone: ${res.status}`);
  return res.json();
};

/** Guarda calibración de sensor (umbral seco/húmedo) */
export const patchCalibration = async (zone_id, dry_threshold, wet_threshold) => {
  const res = await fetch(`${API_URL}/api/v1/zones/${zone_id}/calibration`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dry_threshold, wet_threshold }),
  });
  if (!res.ok) throw new Error(`patchCalibration: ${res.status}`);
  return res.json();
};

import { useEffect, useMemo, useState } from 'react';
import { fetchZoneTelemetryLatest, fetchZones, stopZone, waterZone } from '../api';

const SensorsControl = () => {
  const [zones, setZones] = useState([]);
  const [telemetry, setTelemetry] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyZone, setBusyZone] = useState(null);
  const [durationByZone, setDurationByZone] = useState({});

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const zoneList = await fetchZones();
      setZones(zoneList);

      const entries = await Promise.all(
        zoneList.map(async (zone) => {
          try {
            const data = await fetchZoneTelemetryLatest(zone.id, zone.node_id, zone.channel_index);
            return [zone.id, data.readings || {}];
          } catch {
            return [zone.id, {}];
          }
        })
      );
      setTelemetry(Object.fromEntries(entries));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const defaults = useMemo(() => {
    const map = {};
    zones.forEach((z) => { map[z.id] = 300; });
    return map;
  }, [zones]);

  const durationValue = (zoneId) => durationByZone[zoneId] ?? defaults[zoneId] ?? 300;

  const setDuration = (zoneId, value) => {
    setDurationByZone((prev) => ({ ...prev, [zoneId]: value }));
  };

  const onWater = async (zoneId) => {
    setBusyZone(zoneId);
    try {
      await waterZone(zoneId, Number(durationValue(zoneId)));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyZone(null);
    }
  };

  const onStop = async (zoneId) => {
    setBusyZone(zoneId);
    try {
      await stopZone(zoneId);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyZone(null);
    }
  };

  return (
    <div className="sensors-control">
      <div className="view-header">
        <h2>Sensores y Control de Riego</h2>
        <button type="button" onClick={loadData}>Refrescar</button>
      </div>

      {loading && <p className="loading-text">Cargando zonas y sensores…</p>}
      {error && <p className="error-text">Error: {error}</p>}
      {!loading && zones.length === 0 && <p className="empty-text">No hay zonas configuradas.</p>}

      {!loading && zones.length > 0 && (
        <div className="sensors-grid">
          {zones.map((zone) => {
            const latest = telemetry[zone.id] || {};
            const moisture = latest.moisture_pct?.value;
            const raw = latest.moisture_raw?.value;
            const temp = latest.temp_c?.value;
            const humidity = latest.humidity_pct?.value;

            return (
              <div className="sensor-card" key={zone.id}>
                <h3>{zone.name || `Zona ${zone.id}`}</h3>
                <p className="sensor-subtitle">Nodo {zone.node_id} · CH {zone.channel_index}</p>

                <div className="sensor-stats">
                  <div><strong>Humedad:</strong> {moisture != null ? `${moisture.toFixed(1)}%` : '—'}</div>
                  <div><strong>ADC:</strong> {raw != null ? raw : '—'}</div>
                  <div><strong>Temp:</strong> {temp != null ? `${temp.toFixed(1)} °C` : '—'}</div>
                  <div><strong>HR:</strong> {humidity != null ? `${humidity.toFixed(1)} %` : '—'}</div>
                </div>

                <div className="sensor-actions">
                  <label>
                    Duración (s)
                    <input
                      type="number"
                      min={10}
                      max={600}
                      value={durationValue(zone.id)}
                      onChange={(e) => setDuration(zone.id, Number(e.target.value))}
                    />
                  </label>
                  <button type="button" onClick={() => onWater(zone.id)} disabled={busyZone === zone.id}>
                    Regar
                  </button>
                  <button type="button" onClick={() => onStop(zone.id)} disabled={busyZone === zone.id}>
                    Detener
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SensorsControl;

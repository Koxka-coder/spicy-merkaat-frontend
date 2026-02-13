import { useState, useEffect } from 'react';
import { fetchZoneTelemetry } from '../api/index.js';

/**
 * Obtiene historial de humedad (24h) para el sparkline de ZonePopup.
 * Devuelve { points: [{time, value}], loading, error }
 */
const useMoistureHistory = (zone_id, device_id, zone_ch) => {
  const [points,  setPoints]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (zone_id == null || !device_id || zone_ch == null) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchZoneTelemetry(zone_id, device_id, zone_ch)
      .then(data => {
        if (!cancelled) setPoints(data.data ?? []);
      })
      .catch(err => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [zone_id, device_id, zone_ch]);

  return { points, loading, error };
};

export default useMoistureHistory;

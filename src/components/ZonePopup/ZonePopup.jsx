import { useState } from 'react';
import useMoistureHistory from '../../hooks/useMoistureHistory';
import Sparkline from '../Sparkline/Sparkline';
import { waterZone, stopZone, patchCalibration } from '../../api/index';

const STATE_COLORS = {
  IDLE:     '#4caf50',
  WATERING: '#2196f3',
  COOLDOWN: '#ff9800',
  LOCKED:   '#f44336',
};

const ZonePopup = ({ zone, liveState, onClose }) => {
  const state = liveState?.state || 'IDLE';
  const moisturePct = liveState?.moisture_pct ?? null;

  const { points, loading } = useMoistureHistory(
    zone?.id, zone?.device_id, zone?.zone_ch
  );

  const [duration, setDuration] = useState(60);
  const [watering, setWatering] = useState(false);
  const [dry, setDry] = useState(zone?.dry_threshold ?? 2800);
  const [wet, setWet] = useState(zone?.wet_threshold ?? 1200);
  const [calSaved, setCalSaved] = useState(false);

  const handleWater = async () => {
    setWatering(true);
    try {
      await waterZone(zone.id, duration);
    } finally {
      setWatering(false);
    }
  };

  const handleStop = async () => {
    await stopZone(zone.id);
  };

  const handleCalibration = async (e) => {
    e.preventDefault();
    await patchCalibration(zone.id, dry, wet);
    setCalSaved(true);
    setTimeout(() => setCalSaved(false), 2000);
  };

  const color = STATE_COLORS[state] || '#999';

  return (
    <div className="zone-popup">
      <div className="zone-popup-header">
        <h3>{zone?.name || 'Zona'}</h3>
        <button className="close-btn" onClick={onClose} aria-label="Cerrar">×</button>
      </div>

      <div className="zone-popup-badge" style={{ background: color }}>
        <span className="state-label">{state}</span>
        {moisturePct !== null && (
          <span className="moisture-label">{moisturePct.toFixed(1)}%</span>
        )}
      </div>

      <div className="zone-popup-sparkline">
        {loading ? (
          <p className="loading-text">Cargando historial…</p>
        ) : (
          <Sparkline points={points} width={240} height={48} />
        )}
        <p className="sparkline-label">Humedad 24h</p>
      </div>

      <div className="zone-popup-water">
        <label>
          Duración (s):&nbsp;
          <input
            type="number"
            min={10}
            max={600}
            value={duration}
            onChange={e => setDuration(Number(e.target.value))}
            style={{ width: 70 }}
          />
        </label>
        <button
          onClick={handleWater}
          disabled={state !== 'IDLE' || watering}
          className="water-btn"
        >
          {watering ? 'Enviando…' : 'Regar ahora'}
        </button>
        {state === 'WATERING' && (
          <button onClick={handleStop} className="stop-btn">Detener</button>
        )}
      </div>

      <details className="zone-popup-calibration">
        <summary>Calibración ADC</summary>
        <form onSubmit={handleCalibration}>
          <label>
            Seco (ADC):&nbsp;
            <input
              type="number"
              value={dry}
              onChange={e => setDry(Number(e.target.value))}
              style={{ width: 80 }}
            />
          </label>
          <label>
            Húmedo (ADC):&nbsp;
            <input
              type="number"
              value={wet}
              onChange={e => setWet(Number(e.target.value))}
              style={{ width: 80 }}
            />
          </label>
          <button type="submit">{calSaved ? '✓ Guardado' : 'Guardar'}</button>
        </form>
      </details>
    </div>
  );
};

export default ZonePopup;

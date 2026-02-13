import { useState, useEffect } from 'react';
import { createSchedule, deleteSchedule, fetchSchedules, updateSchedule } from '../api/index';

const initialForm = {
  zone_id: '',
  start_time: '06:30:00',
  duration_s: 300,
  days_of_week: '1,3,5',
  enabled: true,
  smart_skip: true,
};

const normalizeDays = (daysText) => {
  return daysText
    .split(',')
    .map(v => Number(v.trim()))
    .filter(v => Number.isInteger(v) && v >= 1 && v <= 7);
};

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const loadSchedules = () => {
    setLoading(true);
    fetchSchedules()
      .then(setSchedules)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        zone_id: Number(form.zone_id),
        start_time: form.start_time,
        duration_s: Number(form.duration_s),
        days_of_week: normalizeDays(form.days_of_week),
        enabled: !!form.enabled,
        smart_skip: !!form.smart_skip,
      };

      if (!payload.zone_id || payload.days_of_week.length === 0) {
        throw new Error('Completa zone_id y días válidos (1..7).');
      }

      if (editingId) {
        await updateSchedule(editingId, payload);
      } else {
        await createSchedule(payload);
      }
      resetForm();
      loadSchedules();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (s) => {
    setEditingId(s.id);
    setForm({
      zone_id: s.zone_id,
      start_time: s.start_time || '06:30:00',
      duration_s: s.duration_s ?? 300,
      days_of_week: (s.days_of_week || []).join(','),
      enabled: !!s.enabled,
      smart_skip: !!s.smart_skip,
    });
  };

  const onDelete = async (id) => {
    setError(null);
    try {
      await deleteSchedule(id);
      if (editingId === id) resetForm();
      loadSchedules();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="schedules">
      <h1>Irrigation Schedules</h1>
      <div className="schedules-list">
        <form onSubmit={onSubmit} style={{ marginBottom: '1rem', display: 'grid', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              type="number"
              placeholder="Zone ID"
              value={form.zone_id}
              onChange={(e) => setForm(prev => ({ ...prev, zone_id: e.target.value }))}
            />
            <input
              type="time"
              step="1"
              value={form.start_time}
              onChange={(e) => setForm(prev => ({ ...prev, start_time: e.target.value }))}
            />
            <input
              type="number"
              min="10"
              max="3600"
              placeholder="Duración (s)"
              value={form.duration_s}
              onChange={(e) => setForm(prev => ({ ...prev, duration_s: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Días 1,3,5"
              value={form.days_of_week}
              onChange={(e) => setForm(prev => ({ ...prev, days_of_week: e.target.value }))}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <label>
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => setForm(prev => ({ ...prev, enabled: e.target.checked }))}
              /> Enabled
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.smart_skip}
                onChange={(e) => setForm(prev => ({ ...prev, smart_skip: e.target.checked }))}
              /> Smart Skip
            </label>
            <button type="submit" disabled={saving}>
              {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm}>Cancelar</button>
            )}
          </div>
        </form>

        {loading && <p>Cargando schedules…</p>}
        {error && <p className="error-text">Error: {error}</p>}
        {!loading && !error && schedules.length === 0 && (
          <p>No hay schedules todavía.</p>
        )}
        {!loading && !error && schedules.length > 0 && (
          <ul>
            {schedules.map((s, idx) => (
              <li key={s.id ?? `${s.zone_id ?? 'z'}-${idx}`} style={{ marginBottom: '0.5rem' }}>
                Zona {s.zone_id ?? '—'} · {s.start_time ?? '—'} · {s.duration_s ?? '—'}s · [{(s.days_of_week || []).join(',')}]
                <button type="button" onClick={() => onEdit(s)} style={{ marginLeft: '0.5rem' }}>Editar</button>
                <button type="button" onClick={() => onDelete(s.id)} style={{ marginLeft: '0.5rem' }}>Borrar</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Schedules;

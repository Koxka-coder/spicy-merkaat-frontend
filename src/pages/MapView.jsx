import { useState, useEffect } from 'react';
import Map from '../components/Map/Map';
import { fetchMapGeo } from '../api/index';

const MapView = ({ zoneStates, connected }) => {
  const [geoJson, setGeoJson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMapGeo()
      .then(setGeoJson)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="map-view">
      <div className="view-header">
        <h2>Mapa del Jardín</h2>
        <span className={`ws-indicator ${connected ? 'connected' : 'disconnected'}`}>
          ● {connected ? 'En vivo' : 'Desconectado'}
        </span>
      </div>

      {loading && <p className="loading-text">Cargando mapa…</p>}
      {error && <p className="error-text">Error: {error}</p>}
      {!loading && !error && (
        <Map geoJson={geoJson} zoneStates={zoneStates} />
      )}
    </div>
  );
};

export default MapView;

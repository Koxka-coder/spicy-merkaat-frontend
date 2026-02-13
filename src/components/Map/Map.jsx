import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ZonePopup from '../ZonePopup/ZonePopup';

const STATE_COLORS = {
  IDLE:     '#4caf50',
  WATERING: '#2196f3',
  COOLDOWN: '#ff9800',
  LOCKED:   '#f44336',
};

const DEFAULT_CENTER = [42.948139, -2.83585];

function featureStyle(feature, zoneStates) {
  const zoneCh = feature.properties.zone_ch ?? feature.properties.channel_index;
  const key = `${feature.properties.device_id}:${zoneCh}`;
  const live = zoneStates.get(key);
  const color = STATE_COLORS[live?.state] || STATE_COLORS.IDLE;
  return { color, weight: 2, fillOpacity: 0.35, fillColor: color };
}

// Child component — lives inside MapContainer so it can call useMap()
function ZoneLayer({ geoJson, zoneStates, onFeatureClick }) {
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    if (!geoJson?.features?.length) return;

    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }

    const layer = L.geoJSON(geoJson, {
      style: feature => featureStyle(feature, zoneStates),
      onEachFeature: (feature, lyr) => {
        lyr.bindTooltip(feature.properties.name || 'Zona');
        lyr.on('click', () => onFeatureClick(feature));
      },
    });

    layer.addTo(map);
    layerRef.current = layer;

    return () => {
      map.removeLayer(layer);
    };
  }, [geoJson, zoneStates]); // re-creates layer when zoneStates Map reference changes

  return null;
}

const Map = ({ geoJson, zoneStates = new Map() }) => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const handleFeatureClick = (feature) => {
    const props = feature.properties;
    const zone_ch = props.zone_ch ?? props.channel_index;
    const key = `${props.device_id}:${zone_ch}`;
    setSelectedFeature({
      ...props,
      id: props.id ?? props.zone_id,
      zone_ch,
      liveState: zoneStates.get(key),
    });
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '500px' }}>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={18}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <ZoneLayer
          geoJson={geoJson}
          zoneStates={zoneStates}
          onFeatureClick={handleFeatureClick}
        />
      </MapContainer>

      {selectedFeature && (
        <div style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1000,
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
          minWidth: 280,
          maxWidth: 340,
        }}>
          <ZonePopup
            zone={selectedFeature}
            liveState={selectedFeature.liveState}
            onClose={() => setSelectedFeature(null)}
          />
        </div>
      )}
    </div>
  );
};

export default Map;

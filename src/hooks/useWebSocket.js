import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { WS_URL } from '../api/index.js';

/**
 * useWebSocket — conexión socket.io única al backend.
 *
 * Devuelve:
 *   connected:    boolean
 *   zoneStates:   Map<"device_id:zone_ch", {state, moisture_pct, moisture_raw, ts}>
 *   nodeStatuses: Map<device_id, {fw_version, rssi, uptime_s, heap_free, vbat_mv, ts}>
 */
const useWebSocket = () => {
  const [connected,    setConnected]    = useState(false);
  const [zoneStates,   setZoneStates]   = useState(new Map());
  const [nodeStatuses, setNodeStatuses] = useState(new Map());
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(WS_URL, {
      path: '/ws/socket.io',
      transports: ['websocket', 'polling'],
      reconnectionDelay: 2000,
      reconnectionAttempts: Infinity,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[WS] connected:', socket.id);
      setConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('[WS] disconnected:', reason);
      setConnected(false);
    });

    // zone_update: {device_id, zone_ch, moisture_pct, moisture_raw, state, ts}
    socket.on('zone_update', (data) => {
      setZoneStates(prev => {
        const key = `${data.device_id}:${data.zone_ch}`;
        const next = new Map(prev);
        next.set(key, {
          state:        data.state        ?? 'IDLE',
          moisture_pct: data.moisture_pct ?? null,
          moisture_raw: data.moisture_raw ?? null,
          ts:           data.ts,
        });
        return next;
      });
    });

    // node_status: {device_id, fw_version, rssi, uptime_s, heap_free, vbat_mv, ts}
    socket.on('node_status', (data) => {
      setNodeStatuses(prev => {
        const next = new Map(prev);
        next.set(data.device_id, {
          fw_version: data.fw_version,
          rssi:       data.rssi,
          uptime_s:   data.uptime_s,
          heap_free:  data.heap_free,
          vbat_mv:    data.vbat_mv,
          ts:         data.ts,
        });
        return next;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []); // sin deps: una sola conexión por montaje

  return { connected, zoneStates, nodeStatuses };
};

export default useWebSocket;

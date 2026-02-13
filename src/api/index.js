const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const fetchNodes = async () => {
  // TODO: Implement API call to fetch nodes
  const response = await fetch(`${API_URL}/api/nodes`);
  return response.json();
};

export const fetchZones = async () => {
  // TODO: Implement API call to fetch zones
  const response = await fetch(`${API_URL}/api/zones`);
  return response.json();
};

export const fetchSchedules = async () => {
  // TODO: Implement API call to fetch schedules
  const response = await fetch(`${API_URL}/api/schedules`);
  return response.json();
};

export const toggleNode = async (nodeId) => {
  // TODO: Implement API call to toggle node
  const response = await fetch(`${API_URL}/api/nodes/${nodeId}/toggle`, {
    method: 'POST',
  });
  return response.json();
};

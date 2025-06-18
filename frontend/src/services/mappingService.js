import api from './api';

// Get all mappings
export const getMappings = async () => {
  const response = await api.get('/mappings');
  return response.data;
};

// Get doctors for a specific patient
export const getDoctorsByPatient = async (patientId) => {
  const response = await api.get(`/mappings/patient/${patientId}`);
  return response.data;
};

// Get mappings for a specific patient
export const getMappingsByPatient = async (patientId) => {
  const response = await api.get(`/mappings/patient/${patientId}`);
  return response.data;
};

// Create new mapping
export const createMapping = async (mappingData) => {
  const response = await api.post('/mappings', mappingData);
  return response.data;
};

// Delete mapping
export const deleteMapping = async (id) => {
  const response = await api.delete(`/mappings/delete/${id}`);
  return response.data;
};

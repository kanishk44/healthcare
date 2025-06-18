import api from './api';

// Get all patients
export const getPatients = async () => {
  const response = await api.get('/patients');
  return response.data;
};

// Get patient by ID
export const getPatientById = async (id) => {
  const response = await api.get(`/patients/${id}`);
  return response.data;
};

// Create new patient
export const createPatient = async (patientData) => {
  const response = await api.post('/patients', patientData);
  return response.data;
};

// Update patient
export const updatePatient = async (id, patientData) => {
  const response = await api.put(`/patients/${id}`, patientData);
  return response.data;
};

// Delete patient
export const deletePatient = async (id) => {
  const response = await api.delete(`/patients/${id}`);
  return response.data;
};

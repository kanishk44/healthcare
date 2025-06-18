import api from './api';

// Get all doctors
export const getDoctors = async () => {
  const response = await api.get('/doctors');
  return response.data;
};

// Get doctor by ID
export const getDoctorById = async (id) => {
  const response = await api.get(`/doctors/${id}`);
  return response.data;
};

// Create new doctor
export const createDoctor = async (doctorData) => {
  const response = await api.post('/doctors', doctorData);
  return response.data;
};

// Update doctor
export const updateDoctor = async (id, doctorData) => {
  const response = await api.put(`/doctors/${id}`, doctorData);
  return response.data;
};

// Delete doctor
export const deleteDoctor = async (id) => {
  const response = await api.delete(`/doctors/${id}`);
  return response.data;
};

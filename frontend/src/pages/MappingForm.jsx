import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMapping } from '../services/mappingService';
import { getPatients } from '../services/patientService';
import { getDoctors } from '../services/doctorService';
import { toast } from 'react-toastify';

const MappingForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    notes: '',
  });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [patientsData, doctorsData] = await Promise.all([
        getPatients(),
        getDoctors(),
      ]);
      
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load patients and doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.patient) {
      newErrors.patient = 'Patient is required';
    }
    
    if (!formData.doctor) {
      newErrors.doctor = 'Doctor is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      await createMapping(formData);
      toast.success('Mapping created successfully');
      navigate('/mappings');
    } catch (error) {
      console.error('Error creating mapping:', error);
      
      // Check for duplicate mapping error
      if (error.response && error.response.status === 400 && error.response.data.message.includes('duplicate')) {
        toast.error('This patient is already assigned to this doctor');
      } else {
        toast.error('Failed to create mapping');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Create Patient-Doctor Mapping
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {patients.length === 0 || doctors.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-lg text-gray-600 mb-4">
              {patients.length === 0 && doctors.length === 0
                ? 'You need to add both patients and doctors before creating a mapping.'
                : patients.length === 0
                ? 'You need to add patients before creating a mapping.'
                : 'You need to add doctors before creating a mapping.'}
            </p>
            <div className="flex justify-center space-x-4">
              {patients.length === 0 && (
                <button
                  onClick={() => navigate('/patients/new')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Patient
                </button>
              )}
              {doctors.length === 0 && (
                <button
                  onClick={() => navigate('/doctors/new')}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add Doctor
                </button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="patient" className="block text-sm font-medium text-gray-700 mb-1">
                Patient *
              </label>
              <select
                id="patient"
                name="patient"
                value={formData.patient}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.patient ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.name} ({patient.age} years, {patient.gender})
                  </option>
                ))}
              </select>
              {errors.patient && (
                <p className="mt-1 text-sm text-red-600">{errors.patient}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-1">
                Doctor *
              </label>
              <select
                id="doctor"
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.doctor ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value="">Select a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name} ({doctor.specialization})
                  </option>
                ))}
              </select>
              {errors.doctor && (
                <p className="mt-1 text-sm text-red-600">{errors.doctor}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Add any notes about this doctor-patient relationship"
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/mappings')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-purple-300"
              >
                {submitting ? 'Creating...' : 'Create Mapping'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MappingForm;

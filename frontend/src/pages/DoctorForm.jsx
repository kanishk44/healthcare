import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createDoctor, getDoctorById, updateDoctor } from '../services/doctorService';
import { toast } from 'react-toastify';

const DoctorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    experience: '',
    contactNumber: '',
    email: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchDoctor();
    }
  }, [id]);

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      const data = await getDoctorById(id);
      setFormData({
        name: data.name,
        specialization: data.specialization,
        experience: data.experience,
        contactNumber: data.contactNumber,
        email: data.email,
        address: data.address,
      });
    } catch (error) {
      console.error('Error fetching doctor:', error);
      toast.error('Failed to load doctor data');
      navigate('/doctors');
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.specialization.trim()) {
      newErrors.specialization = 'Specialization is required';
    }
    
    if (!formData.experience) {
      newErrors.experience = 'Experience is required';
    } else if (isNaN(formData.experience) || formData.experience < 0) {
      newErrors.experience = 'Experience must be a non-negative number';
    }
    
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
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
      // Convert experience to number
      const doctorData = {
        ...formData,
        experience: Number(formData.experience),
      };
      
      if (isEditMode) {
        await updateDoctor(id, doctorData);
        toast.success('Doctor updated successfully');
      } else {
        await createDoctor(doctorData);
        toast.success('Doctor added successfully');
      }
      
      navigate('/doctors');
    } catch (error) {
      console.error('Error saving doctor:', error);
      toast.error(isEditMode ? 'Failed to update doctor' : 'Failed to add doctor');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {isEditMode ? 'Edit Doctor' : 'Add New Doctor'}
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Doctor Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                Specialization *
              </label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.specialization ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {errors.specialization && (
                <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                Experience (years) *
              </label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.experience ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {errors.experience && (
                <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number *
              </label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {errors.contactNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-md border ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/doctors')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-300"
            >
              {submitting ? 'Saving...' : isEditMode ? 'Update Doctor' : 'Add Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorForm;

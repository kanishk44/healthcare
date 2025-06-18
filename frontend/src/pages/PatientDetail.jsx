import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPatientById } from '../services/patientService';
import { getMappingsByPatient, deleteMapping } from '../services/mappingService';
import { getDoctors } from '../services/doctorService';
import { toast } from 'react-toastify';
import { PencilIcon, ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [patient, setPatient] = useState(null);
  const [mappings, setMappings] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [patientData, mappingsData, doctorsData] = await Promise.all([
        getPatientById(id),
        getMappingsByPatient(id),
        getDoctors(),
      ]);
      
      setPatient(patientData);
      setMappings(mappingsData);
      
      // Convert doctors array to object for easy lookup
      const doctorsObj = {};
      doctorsData.forEach(doctor => {
        doctorsObj[doctor._id] = doctor;
      });
      
      setDoctors(doctorsObj);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load patient details');
      navigate('/patients');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMapping = async (mappingId) => {
    if (window.confirm('Are you sure you want to remove this doctor from the patient?')) {
      try {
        await deleteMapping(mappingId);
        toast.success('Doctor removed successfully');
        fetchData();
      } catch (error) {
        console.error('Error removing doctor:', error);
        toast.error('Failed to remove doctor');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-700">Patient not found</h2>
        <Link to="/patients" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Patients
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/patients')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Patients
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{patient.name}</h1>
        <Link
          to={`/patients/edit/${id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
        >
          <PencilIcon className="h-5 w-5 mr-2" />
          Edit Patient
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Patient Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-base text-gray-900">{patient.name}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Age / Gender</p>
                <p className="text-base text-gray-900">{patient.age} years / {patient.gender}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Contact Number</p>
                <p className="text-base text-gray-900">{patient.contactNumber}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-base text-gray-900">{patient.address}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Medical History</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {patient.medicalHistory || 'No medical history recorded.'}
            </p>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Assigned Doctors</h2>
              <Link
                to="/mappings/new"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Assign Doctor
              </Link>
            </div>

            {mappings.length === 0 ? (
              <p className="text-gray-500">No doctors assigned to this patient.</p>
            ) : (
              <div className="space-y-4">
                {mappings.map((mapping) => {
                  const doctor = doctors[mapping.doctor];
                  if (!doctor) return null;
                  
                  return (
                    <div key={mapping._id} className="border rounded-md p-3 hover:bg-gray-50">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                          <p className="text-sm text-gray-500">{doctor.specialization}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Assigned on {new Date(mapping.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteMapping(mapping._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Remove doctor"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                      {mapping.notes && (
                        <div className="mt-2 text-sm text-gray-600 border-t pt-2">
                          <p className="font-medium text-xs text-gray-500">Notes:</p>
                          <p>{mapping.notes}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;

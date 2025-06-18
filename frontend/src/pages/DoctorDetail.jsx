import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDoctorById } from '../services/doctorService';
import { getMappings, deleteMapping } from '../services/mappingService';
import { getPatients } from '../services/patientService';
import { toast } from 'react-toastify';
import { PencilIcon, ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline';

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [doctor, setDoctor] = useState(null);
  const [mappings, setMappings] = useState([]);
  const [patients, setPatients] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [doctorData, mappingsData, patientsData] = await Promise.all([
        getDoctorById(id),
        getMappings(),
        getPatients(),
      ]);
      
      setDoctor(doctorData);
      
      // Filter mappings for this doctor
      const doctorMappings = mappingsData.filter(mapping => mapping.doctor === id);
      setMappings(doctorMappings);
      
      // Convert patients array to object for easy lookup
      const patientsObj = {};
      patientsData.forEach(patient => {
        patientsObj[patient._id] = patient;
      });
      
      setPatients(patientsObj);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load doctor details');
      navigate('/doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMapping = async (mappingId) => {
    if (window.confirm('Are you sure you want to remove this patient from the doctor?')) {
      try {
        await deleteMapping(mappingId);
        toast.success('Patient removed successfully');
        fetchData();
      } catch (error) {
        console.error('Error removing patient:', error);
        toast.error('Failed to remove patient');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-700">Doctor not found</h2>
        <Link to="/doctors" className="text-green-600 hover:underline mt-4 inline-block">
          Back to Doctors
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/doctors')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Doctors
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dr. {doctor.name}</h1>
        <Link
          to={`/doctors/edit/${id}`}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
        >
          <PencilIcon className="h-5 w-5 mr-2" />
          Edit Doctor
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Doctor Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-base text-gray-900">{doctor.name}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Specialization</p>
                <p className="text-base text-gray-900">{doctor.specialization}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Experience</p>
                <p className="text-base text-gray-900">{doctor.experience} years</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Contact Number</p>
                <p className="text-base text-gray-900">{doctor.contactNumber}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base text-gray-900">{doctor.email}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-base text-gray-900">{doctor.address}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Assigned Patients</h2>
              <Link
                to="/mappings/new"
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                + Assign Patient
              </Link>
            </div>

            {mappings.length === 0 ? (
              <p className="text-gray-500">No patients assigned to this doctor.</p>
            ) : (
              <div className="space-y-4">
                {mappings.map((mapping) => {
                  const patient = patients[mapping.patient];
                  if (!patient) return null;
                  
                  return (
                    <div key={mapping._id} className="border rounded-md p-3 hover:bg-gray-50">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{patient.name}</h3>
                          <p className="text-sm text-gray-500">
                            {patient.age} years, {patient.gender}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Assigned on {new Date(mapping.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteMapping(mapping._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Remove patient"
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

export default DoctorDetail;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMappings, deleteMapping } from '../services/mappingService';
import { getPatients } from '../services/patientService';
import { getDoctors } from '../services/doctorService';
import { toast } from 'react-toastify';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const Mappings = () => {
  const [mappings, setMappings] = useState([]);
  const [patients, setPatients] = useState({});
  const [doctors, setDoctors] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mappingsData, patientsData, doctorsData] = await Promise.all([
        getMappings(),
        getPatients(),
        getDoctors(),
      ]);
      
      // Convert patients and doctors arrays to objects for easy lookup
      const patientsObj = {};
      patientsData.forEach(patient => {
        patientsObj[patient._id] = patient;
      });
      
      const doctorsObj = {};
      doctorsData.forEach(doctor => {
        doctorsObj[doctor._id] = doctor;
      });
      
      setMappings(mappingsData);
      setPatients(patientsObj);
      setDoctors(doctorsObj);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load mappings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this mapping?')) {
      try {
        await deleteMapping(id);
        toast.success('Mapping deleted successfully');
        fetchData();
      } catch (error) {
        console.error('Error deleting mapping:', error);
        toast.error('Failed to delete mapping');
      }
    }
  };

  const filteredMappings = mappings.filter(mapping => {
    const patient = patients[mapping.patient];
    const doctor = doctors[mapping.doctor];
    
    if (!patient || !doctor) return false;
    
    const patientName = patient.name.toLowerCase();
    const doctorName = doctor.name.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return patientName.includes(searchLower) || 
           doctorName.includes(searchLower) ||
           doctor.specialization.toLowerCase().includes(searchLower);
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Patient-Doctor Mappings</h1>
        <Link
          to="/mappings/new"
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Mapping
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="Search by patient or doctor name..."
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredMappings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {searchTerm ? 'No mappings match your search.' : 'No mappings found. Create your first patient-doctor mapping!'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMappings.map((mapping) => {
                  const patient = patients[mapping.patient];
                  const doctor = doctors[mapping.doctor];
                  
                  if (!patient || !doctor) return null;
                  
                  return (
                    <tr key={mapping._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{patient.name}</div>
                        <div className="text-sm text-gray-500">
                          {patient.age} years, {patient.gender}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{doctor.name}</div>
                        <div className="text-sm text-gray-500">
                          {doctor.experience} years exp.
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-500">{doctor.specialization}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-500">
                          {new Date(mapping.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleDelete(mapping._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mappings;

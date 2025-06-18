import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPatients } from '../services/patientService';
import { getDoctors } from '../services/doctorService';
import { getMappings } from '../services/mappingService';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    mappings: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patientsData, doctorsData, mappingsData] = await Promise.all([
          getPatients(),
          getDoctors(),
          getMappings(),
        ]);

        setStats({
          patients: patientsData.length,
          doctors: doctorsData.length,
          mappings: mappingsData.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, count, icon, linkTo, bgColor }) => (
    <Link
      to={linkTo}
      className={`${bgColor} rounded-lg shadow-md p-6 flex flex-col items-center transition-transform hover:scale-105`}
    >
      <div className="text-white text-4xl mb-2">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-3xl font-bold text-white">{count}</p>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user?.name || 'User'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your healthcare management system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Patients"
          count={stats.patients}
          icon="👤"
          linkTo="/patients"
          bgColor="bg-blue-600"
        />
        <StatCard
          title="Doctors"
          count={stats.doctors}
          icon="👨‍⚕️"
          linkTo="/doctors"
          bgColor="bg-green-600"
        />
        <StatCard
          title="Mappings"
          count={stats.mappings}
          icon="🔗"
          linkTo="/mappings"
          bgColor="bg-purple-600"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/patients/new"
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md p-4 flex items-center justify-center transition-colors"
          >
            Add New Patient
          </Link>
          <Link
            to="/doctors/new"
            className="bg-green-100 hover:bg-green-200 text-green-800 rounded-md p-4 flex items-center justify-center transition-colors"
          >
            Add New Doctor
          </Link>
          <Link
            to="/mappings/new"
            className="bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-md p-4 flex items-center justify-center transition-colors"
          >
            Create New Mapping
          </Link>
          <Link
            to="/patients"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md p-4 flex items-center justify-center transition-colors"
          >
            View All Patients
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">System Information</h2>
        <div className="text-gray-600">
          <p>
            <span className="font-medium">Healthcare Management System</span> - Version 1.0.0
          </p>
          <p className="mt-2">
            This system helps you manage patients, doctors, and their relationships efficiently.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

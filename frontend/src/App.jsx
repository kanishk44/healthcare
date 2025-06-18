import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientForm from './pages/PatientForm';
import PatientDetail from './pages/PatientDetail';
import Doctors from './pages/Doctors';
import DoctorForm from './pages/DoctorForm';
import DoctorDetail from './pages/DoctorDetail';
import Mappings from './pages/Mappings';
import MappingForm from './pages/MappingForm';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Patient Routes */}
              <Route path="/patients" element={<Patients />} />
              <Route path="/patients/new" element={<PatientForm />} />
              <Route path="/patients/edit/:id" element={<PatientForm />} />
              <Route path="/patients/:id" element={<PatientDetail />} />
              
              {/* Doctor Routes */}
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/doctors/new" element={<DoctorForm />} />
              <Route path="/doctors/edit/:id" element={<DoctorForm />} />
              <Route path="/doctors/:id" element={<DoctorDetail />} />
              
              {/* Mapping Routes */}
              <Route path="/mappings" element={<Mappings />} />
              <Route path="/mappings/new" element={<MappingForm />} />
            </Route>
          </Route>
          
          {/* Redirect any unknown routes to Dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

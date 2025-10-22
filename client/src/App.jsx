import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { SymptomChecker } from './pages/patient/SymptomChecker';
import { Appointments } from './pages/patient/Appointments';
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { DoctorAppointments } from './pages/doctor/DoctorAppointments';
import { DoctorPatients } from './pages/doctor/DoctorPatients';
import { DoctorAIReports } from './pages/doctor/DoctorAIReports';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminAppointments } from './pages/admin/AdminAppointments';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminAIAnalyses } from './pages/admin/AdminAIAnalyses';
import { PatientReports } from './pages/patient/PatientReports';
import { PatientAnalyses } from './pages/patient/PatientAnalyses';
import { PatientProfile } from './pages/patient/PatientProfile';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Navigate to="/patient/dashboard" replace />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/dashboard"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Layout>
                    <PatientDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/symptom-checker"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Layout>
                    <SymptomChecker />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/appointments"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Layout>
                    <Appointments />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/reports"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Layout>
                    <PatientReports />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/analyses"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Layout>
                    <PatientAnalyses />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/profile"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Layout>
                    <PatientProfile />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/dashboard"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <Layout>
                    <DoctorDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/appointments"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <Layout>
                    <DoctorAppointments />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/patients"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <Layout>
                    <DoctorPatients />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/ai-reports"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <Layout>
                    <DoctorAIReports />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <AdminUsers />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/appointments"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <AdminAppointments />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <AdminAnalytics />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/ai-analyses"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <AdminAIAnalyses />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;


import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login     from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients  from './pages/Patients';
import UploadECG from './pages/UploadECG';
import Analysis  from './pages/Analysis';
import Report    from './pages/Report';
import Admin     from './pages/Admin';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"        element={<Navigate to="/login" />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/patients"  element={<ProtectedRoute><Patients /></ProtectedRoute>} />
          <Route path="/upload"    element={<ProtectedRoute><UploadECG /></ProtectedRoute>} />
          <Route path="/analysis/:id" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
          <Route path="/report/:id"   element={<ProtectedRoute><Report /></ProtectedRoute>} />
          <Route path="/admin"     element={<ProtectedRoute roles={['admin']}><Admin /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* 404 Page */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
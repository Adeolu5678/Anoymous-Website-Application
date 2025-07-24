import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import authService from './api/authService';

// Import pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import MessageSendPage from './pages/MessageSendPage'; // Add this import
import InboxPage from './pages/InboxPage'; // Add this import
import AdminLoginPage from './pages/admin/AdminLoginPage'; // Add this import
import AdminDashboardPage from './pages/admin/AdminDashboardPage'; // Add this import
import AdminUserMessagesPage from './pages/admin/AdminUserMessagesPage'; // Add this import

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!authService.isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
    <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/send/:shareLinkId" element={<MessageSendPage />} /> {/* Add this route */}
            <Route path="/inbox" element={<ProtectedRoute><InboxPage /></ProtectedRoute>} /> {/* Add this route */}
            <Route path="/admin/login" element={<AdminLoginPage />} /> {/* Admin login route */}
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/:userId/messages"
              element={
                <ProtectedRoute>
                  <AdminUserMessagesPage />
                </ProtectedRoute>
              }
            />
            
            {/* Redirect root to dashboard or login */}
            <Route
              path="/"
              element={
                authService.isLoggedIn() ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            
            {/* 404 page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
    </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

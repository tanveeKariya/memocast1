import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { VoiceProvider } from './contexts/VoiceContext';
import { LoginScreen } from './components/LoginScreen';
import { HomeScreen } from './components/HomeScreen';
import { NoteEditor } from './components/NoteEditor';
import { PublishScreen } from './components/PublishScreen';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" /> : <LoginScreen />} 
      />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <HomeScreen />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/note/:id" 
        element={
          <ProtectedRoute>
            <NoteEditor />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/publish" 
        element={
          <ProtectedRoute>
            <PublishScreen />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <VoiceProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
            <AppRoutes />
          </div>
        </Router>
      </VoiceProvider>
    </AuthProvider>
  );
}

export default App;
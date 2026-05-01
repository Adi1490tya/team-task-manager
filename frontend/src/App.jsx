import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import { AdminLogin, AdminSignup, MemberLogin, MemberSignup } from './pages/AuthPages';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"               element={<LandingPage />} />
        <Route path="/admin/login"    element={<AdminLogin />} />
        <Route path="/admin/signup"   element={<AdminSignup />} />
        <Route path="/member/login"   element={<MemberLogin />} />
        <Route path="/member/signup"  element={<MemberSignup />} />

        {/* Protected - both roles */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/projects" element={
          <ProtectedRoute><ProjectList /></ProtectedRoute>
        } />
        <Route path="/projects/:id" element={
          <ProtectedRoute><ProjectDetail /></ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <h1 className="text-4xl font-bold text-white">404</h1>
            <p className="text-slate-400">Page not found.</p>
            <a href="/" className="btn-secondary">Go Home</a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;

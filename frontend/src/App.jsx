import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import HomePage from './pages/HomePage';
import Mantenimiento from './pages/Mantenimiento';
import ManualUsuario from './pages/ManualUsuario';
import Ubicacion from './pages/Ubicacion';
import NuestraHistoria from './pages/NuestraHistoria';
import GuiaTecnicaPage from './pages/GuiaTecnicaPage';
import LoginPage from './pages/LoginPage';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/centro-conocimiento" element={<Navigate to="/guia-tecnica" replace />} />
              <Route path="/mantenimiento" element={<Mantenimiento />} />
              <Route path="/manual-usuario" element={<ManualUsuario />} />
              <Route path="/ubicacion" element={<Ubicacion />} />
              <Route path="/nuestra-historia" element={<NuestraHistoria />} />
              <Route path="/guia-tecnica" element={<GuiaTecnicaPage />} />
              
              {/* Login */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Rutas Protegidas de Admin */}
              <Route 
                path="/admin-zd-m8k3x7p2/*" 
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
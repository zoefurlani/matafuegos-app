import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import CentroConocimiento from './pages/CentroConocimiento';
import Mantenimiento from './pages/Mantenimiento';
import ManualUsuario from './pages/ManualUsuario';
import Ubicacion from './pages/Ubicacion';
import NuestraHistoria from './pages/NuestraHistoria';
import LoginPage from './pages/LoginPage';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/centro-conocimiento" element={<CentroConocimiento />} />
            <Route path="/mantenimiento" element={<Mantenimiento />} />
            <Route path="/manual-usuario" element={<ManualUsuario />} />
            <Route path="/ubicacion" element={<Ubicacion />} />
            <Route path="/nuestra-historia" element={<NuestraHistoria />} />
            
            {/* Login (público pero redirige si ya está autenticado) */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Rutas Protegidas de Admin */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute>
                  <AdminPanel />
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
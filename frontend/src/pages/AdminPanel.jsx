import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import Dashboard from '../components/admin/Dashboard';
import ClientesPage from './admin/ClientesPage';
import ExtintoresPage from './admin/ExtintoresPage';
import RecargasPage from './admin/RecargasPage';
import InventarioPage from './admin/InventarioPage';
import UsuariosPage from './admin/UsuariosPage';
import VentasPage from './admin/VentasPage';
import ComprobantesPage from './admin/ComprobantesPage';
import RecursosEducativosPage from './admin/RecursosEducativosPage';
import CambiarPasswordPage from './CambiarPasswordPage';

function AdminPanel() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Navigate to="/admin-zd-m8k3x7p2/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="clientes" element={<ClientesPage />} />
        <Route path="extintores" element={<ExtintoresPage />} />
        <Route path="recargas" element={<RecargasPage />} />
        <Route path="inventario" element={<InventarioPage />} />
        <Route path="ventas" element={<VentasPage />} />
        <Route path="comprobantes" element={<ComprobantesPage />} />
        <Route path="recursos-educativos" element={<RecursosEducativosPage />} />
        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="cambiar-password" element={<CambiarPasswordPage />} />
      </Routes>
    </AdminLayout>
  );
}

export default AdminPanel;
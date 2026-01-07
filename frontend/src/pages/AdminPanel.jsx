import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import Dashboard from '../components/admin/Dashboard';
import ClientesManager from '../components/admin/ClientesManager';
import ExtintoresManager from '../components/admin/ExtintoresManager';
import RecargasManager from '../components/admin/RecargasManager';
import InventarioManager from '../components/admin/InventarioManager';

function AdminPanel() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clientes" element={<ClientesManager />} />
        <Route path="/extintores" element={<ExtintoresManager />} />
        <Route path="/recargas" element={<RecargasManager />} />
        <Route path="/inventario" element={<InventarioManager />} />
      </Routes>
    </AdminLayout>
  );
}

export default AdminPanel;
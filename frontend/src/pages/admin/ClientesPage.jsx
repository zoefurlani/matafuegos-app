import { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X,
  Mail,
  Phone,
  MapPin,
  FileText
} from 'lucide-react';
import { clientesAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';


function ClientesPage() {
  const toast = useToast();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    cuit: '',
    telefono: '',
    email: '',
    direccion: '',
    observaciones: ''
  });


  useEffect(() => {
    fetchClientes();
  }, []);


  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await clientesAPI.getAll();
      setClientes(data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      toast.error('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };


  const handleNuevoCliente = () => {
    setEditingCliente(null);
    setFormData({
      nombre: '',
      cuit: '',
      telefono: '',
      email: '',
      direccion: '',
      observaciones: ''
    });
    setShowModal(true);
  };


  const handleEditarCliente = (cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nombre: cliente.nombre,
      cuit: cliente.cuit || '',
      telefono: cliente.telefono || '',
      email: cliente.email || '',
      direccion: cliente.direccion || '',
      observaciones: cliente.observaciones || ''
    });
    setShowModal(true);
  };


  const handleGuardarCliente = async (e) => {
    e.preventDefault();
    
    try {
      const dataToSend = { ...formData };
      
      if (!dataToSend.cuit || dataToSend.cuit.trim() === '') {
        delete dataToSend.cuit;
      }
      if (!dataToSend.telefono || dataToSend.telefono.trim() === '') {
        delete dataToSend.telefono;
      }
      if (!dataToSend.email || dataToSend.email.trim() === '') {
        delete dataToSend.email;
      }
      if (!dataToSend.direccion || dataToSend.direccion.trim() === '') {
        delete dataToSend.direccion;
      }
      if (!dataToSend.observaciones || dataToSend.observaciones.trim() === '') {
        delete dataToSend.observaciones;
      }
      
      if (editingCliente) {
        await clientesAPI.update(editingCliente.id, dataToSend);
        toast.success('Cliente actualizado correctamente');
      } else {
        await clientesAPI.create(dataToSend);
        toast.success('Cliente creado correctamente');
      }
      
      setShowModal(false);
      fetchClientes();
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      toast.error('Error al guardar el cliente: ' + error.message);
    }
  };


  const handleEliminarCliente = async (id, nombre) => {
    const confirmed = await toast.confirm(`¿Estás seguro de eliminar el cliente "${nombre}"?`);
    if (!confirmed) return;


    try {
      await clientesAPI.delete(id);
      toast.success('Cliente eliminado correctamente');
      fetchClientes();
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      toast.error('Error al eliminar el cliente');
    }
  };


  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cliente.cuit && cliente.cuit.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (cliente.email && cliente.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60vh'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '6px solid #e5e7eb',
          borderTop: '6px solid #ef4444',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }


  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px'
          }}>
            Clientes
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280' }}>
            Gestiona los clientes del sistema
          </p>
        </div>


        <button
          onClick={handleNuevoCliente}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#dc2626';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#ef4444';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Plus size={20} />
          Nuevo Cliente
        </button>
      </div>


      {/* Buscador */}
      <div style={{
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={20}
            color="#6b7280"
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />
          <input
            type="text"
            placeholder="Buscar por nombre, CUIT o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              paddingLeft: '48px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#ef4444'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
          />
        </div>
      </div>


      {/* Lista de clientes */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {clientesFiltrados.length === 0 ? (
          <div style={{
            padding: '48px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <Users size={48} color="#d1d5db" style={{ marginBottom: '16px' }} />
            <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
              No hay clientes
            </p>
            <p style={{ fontSize: '14px' }}>
              {searchTerm ? 'No se encontraron resultados' : 'Comienza agregando tu primer cliente'}
            </p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={headerStyle}>Cliente</th>
                <th style={headerStyle}>CUIT</th>
                <th style={headerStyle}>Contacto</th>
                <th style={headerStyle}>Dirección</th>
                <th style={headerStyle}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((cliente) => (
                <tr
                  key={cliente.id}
                  style={{
                    borderBottom: '1px solid #e5e7eb',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#fee2e2',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Users size={20} color="#ef4444" />
                      </div>
                      <div>
                        <p style={{ fontWeight: 'bold', color: '#111827' }}>
                          {cliente.nombre}
                        </p>
                        {cliente.observaciones && (
                          <p style={{ fontSize: '12px', color: '#6b7280' }}>
                            {cliente.observaciones.substring(0, 30)}
                            {cliente.observaciones.length > 30 && '...'}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={cellStyle}>
                    {cliente.cuit ? (
                      <span style={{
                        padding: '4px 12px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontFamily: 'monospace'
                      }}>
                        {cliente.cuit}
                      </span>
                    ) : (
                      <span style={{ fontSize: '14px', color: '#9ca3af' }}>Sin CUIT</span>
                    )}
                  </td>
                  <td style={cellStyle}>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      {cliente.email && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <Mail size={14} />
                          <span>{cliente.email}</span>
                        </div>
                      )}
                      {cliente.telefono && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Phone size={14} />
                          <span>{cliente.telefono}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={cellStyle}>
                    {cliente.direccion && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        <MapPin size={14} />
                        <span>{cliente.direccion}</span>
                      </div>
                    )}
                  </td>
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEditarCliente(cliente)}
                        style={{
                          padding: '8px',
                          backgroundColor: '#dbeafe',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#bfdbfe'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                        title="Editar"
                      >
                        <Edit2 size={16} color="#3b82f6" />
                      </button>
                      <button
                        onClick={() => handleEliminarCliente(cliente.id, cliente.nombre)}
                        style={{
                          padding: '8px',
                          backgroundColor: '#fee2e2',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                        title="Eliminar"
                      >
                        <Trash2 size={16} color="#ef4444" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>


      {/* Modal de formulario */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            
          }}>
            {/* Header del modal */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#ef4444',
              color: 'white',
              borderRadius: '16px 16px 0 0'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                {editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '8px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: 'white'
                }}
              >
                <X size={20} />
              </button>
            </div>


            {/* Formulario */}
            <form onSubmit={handleGuardarCliente} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Nombre */}
                <div>
                  <label style={labelStyle}>
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    style={inputStyle}
                    placeholder="Ej: Supermercado Central"
                  />
                </div>


                {/* CUIT con formato automático */}
                <div>
                  <label style={labelStyle}>
                    CUIT
                  </label>
                  <input
                    type="text"
                    value={formData.cuit}
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^0-9]/g, '');
                      
                      if (value.length > 2) {
                        value = value.slice(0, 2) + '-' + value.slice(2);
                      }
                      if (value.length > 11) {
                        value = value.slice(0, 11) + '-' + value.slice(11);
                      }
                      if (value.length > 13) {
                        value = value.slice(0, 13);
                      }
                      
                      setFormData({ ...formData, cuit: value });
                    }}
                    style={inputStyle}
                    placeholder="Ej: 30-12345678-9"
                    maxLength={13}
                  />
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    Formato: XX-XXXXXXXX-X (se formatea automáticamente)
                  </p>
                </div>


                {/* Teléfono y Email en fila */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>
                      Teléfono
                    </label>
                    <input
                      type="text"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      style={inputStyle}
                      placeholder="Ej: 3482-123456"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={inputStyle}
                      placeholder="Ej: info@empresa.com"
                    />
                  </div>
                </div>


                {/* Dirección */}
                <div>
                  <label style={labelStyle}>
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    style={inputStyle}
                    placeholder="Ej: Calle Principal 123"
                  />
                </div>


                {/* Observaciones */}
                <div>
                  <label style={labelStyle}>
                    Observaciones
                  </label>
                  <textarea
                    value={formData.observaciones}
                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                    style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                    placeholder="Notas adicionales..."
                  />
                </div>
              </div>


              {/* Botones */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '24px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#f3f4f6',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    color: '#6b7280'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#ef4444',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
                  }}
                >
                  {editingCliente ? 'Actualizar' : 'Crear Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


const headerStyle = {
  padding: '16px',
  textAlign: 'left',
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};


const cellStyle = {
  padding: '16px',
  fontSize: '14px'
};


const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#374151'
};


const inputStyle = {
  width: '100%',
  padding: '12px',
  border: '2px solid #e5e7eb',
  borderRadius: '8px',
  fontSize: '16px',
  outline: 'none',
  transition: 'border-color 0.3s ease'
};


export default ClientesPage;
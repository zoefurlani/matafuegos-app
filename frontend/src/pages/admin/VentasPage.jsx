import { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Calendar,
  DollarSign,
  Package,
  User,
  Trash2,
  TrendingUp,
  X,
  Edit2
} from 'lucide-react';
import { ventasAPI, clientesAPI, inventarioAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';

function VentasPage() {
  const toast = useToast();
  const { user } = useAuth();
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCliente, setFilterCliente] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVenta, setEditingVenta] = useState(null);
  const [stats, setStats] = useState(null);

  const [formData, setFormData] = useState({
    clienteId: '',
    productoId: '',
    cantidad: 1,
    precioUnitario: 0,
    numeroEquipo: '',
    observaciones: '',
  });

  const [editFormData, setEditFormData] = useState({
    precioUnitario: 0,
    observaciones: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ventasData, clientesData, productosData, statsData] = await Promise.all([
        ventasAPI.getAll(),
        clientesAPI.getAll(),
        inventarioAPI.getAllProductos(),
        ventasAPI.getStats(),
      ]);
      
      setVentas(ventasData);
      setClientes(clientesData);
      setProductos(productosData.filter(p => p.categoria === 'Matafuegos'));
      setStats(statsData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleProductoChange = (productoId) => {
    const producto = productos.find(p => p.id === parseInt(productoId));
    setFormData({
      ...formData,
      productoId,
      precioUnitario: producto ? producto.precioUnitario : 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.clienteId || !formData.productoId || !formData.numeroEquipo) {
      toast.warning('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      await ventasAPI.create({
        clienteId: parseInt(formData.clienteId),
        productoId: parseInt(formData.productoId),
        cantidad: parseInt(formData.cantidad),
        precioUnitario: parseFloat(formData.precioUnitario),
        numeroEquipo: formData.numeroEquipo,
        observaciones: formData.observaciones,
      });

      toast.success('Venta registrada correctamente');
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error al registrar venta:', error);
      toast.error(error.message || 'Error al registrar la venta');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      await ventasAPI.update(editingVenta.id, {
        precioUnitario: parseFloat(editFormData.precioUnitario),
        observaciones: editFormData.observaciones,
      });

      toast.success('Venta actualizada correctamente');
      setShowEditModal(false);
      setEditingVenta(null);
      fetchData();
    } catch (error) {
      console.error('Error al actualizar venta:', error);
      toast.error(error.message || 'Error al actualizar la venta');
    }
  };

  const handleEdit = (venta) => {
    setEditingVenta(venta);
    setEditFormData({
      precioUnitario: venta.precioUnitario,
      observaciones: venta.observaciones || '',
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      clienteId: '',
      productoId: '',
      cantidad: 1,
      precioUnitario: 0,
      numeroEquipo: '',
      observaciones: '',
    });
  };

  const handleEliminar = async (id) => {
    const confirmed = await toast.confirm('¿Estás seguro de eliminar esta venta? Solo se pueden eliminar ventas recientes (menos de 24 horas).');
    if (!confirmed) return;

    try {
      await ventasAPI.delete(id);
      toast.success('Venta eliminada correctamente');
      fetchData();
    } catch (error) {
      console.error('Error al eliminar venta:', error);
      toast.error(error.message || 'No se puede eliminar esta venta');
    }
  };

  const getClienteNombre = (clienteId) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nombre : 'Desconocido';
  };

  const ventasFiltradas = ventas.filter(venta => {
    const matchSearch = 
      venta.numeroEquipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getClienteNombre(venta.clienteId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchCliente = !filterCliente || venta.clienteId === parseInt(filterCliente);

    return matchSearch && matchCliente;
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ width: '60px', height: '60px', border: '6px solid #e5e7eb', borderTop: '6px solid #ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Ventas</h1>
          <p style={{ fontSize: '16px', color: '#6b7280' }}>Gestiona las ventas de extintores</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s ease' }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#dc2626'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <Plus size={20} />
          Nueva Venta
        </button>
      </div>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#dbeafe', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCart size={24} color="#2563eb" />
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Total Ventas</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{stats.totalVentas}</p>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#fef3c7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={24} color="#f59e0b" />
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Ventas Este Mes</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{stats.ventasMes}</p>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#d1fae5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={24} color="#059669" />
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Recaudado Mes</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>${stats.totalRecaudadoMes?.toLocaleString('es-AR')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={20} color="#6b7280" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Buscar por N° equipo o cliente..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              style={{ width: '100%', padding: '12px', paddingLeft: '48px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', outline: 'none' }} 
            />
          </div>
          <select 
            value={filterCliente} 
            onChange={(e) => setFilterCliente(e.target.value)} 
            style={{ padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', outline: 'none' }}
          >
            <option value="">Todos los clientes</option>
            {clientes.map(cliente => <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>)}
          </select>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        {ventasFiltradas.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
            <ShoppingCart size={48} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>No hay ventas registradas</p>
            <p style={{ fontSize: '14px' }}>{searchTerm || filterCliente ? 'No se encontraron resultados' : 'Comienza registrando tu primera venta'}</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={headerStyle}>Fecha</th>
                <th style={headerStyle}>N° Equipo</th>
                <th style={headerStyle}>Cliente</th>
                <th style={headerStyle}>Producto</th>
                <th style={headerStyle}>Cantidad</th>
                <th style={headerStyle}>Precio Unit.</th>
                <th style={headerStyle}>Total</th>
                <th style={headerStyle}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventasFiltradas.map((venta) => (
                <tr key={venta.id} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background-color 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                  <td style={cellStyle}>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      {new Date(venta.createdAt).toLocaleDateString('es-AR')}
                    </div>
                  </td>
                  <td style={cellStyle}>
                    <span style={{ fontWeight: 'bold', color: '#111827' }}>{venta.numeroEquipo}</span>
                  </td>
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={16} color="#6b7280" />
                      <span style={{ color: '#374151' }}>{venta.cliente?.nombre || getClienteNombre(venta.clienteId)}</span>
                    </div>
                  </td>
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Package size={16} color="#6b7280" />
                      <span style={{ color: '#374151' }}>{venta.producto?.nombre || 'N/A'}</span>
                    </div>
                  </td>
                  <td style={cellStyle}>
                    <span style={{ fontWeight: 'bold', color: '#111827' }}>{venta.cantidad}</span>
                  </td>
                  <td style={cellStyle}>
                    <span style={{ color: '#059669' }}>${venta.precioUnitario?.toLocaleString('es-AR')}</span>
                  </td>
                  <td style={cellStyle}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#059669' }}>${venta.precioTotal?.toLocaleString('es-AR')}</span>
                  </td>
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEdit(venta)}
                        style={{ padding: '8px', backgroundColor: '#dbeafe', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        title="Editar"
                      >
                        <Edit2 size={16} color="#2563eb" />
                      </button>
                      {user?.rol === 'super_admin' && (
                        <button 
                          onClick={() => handleEliminar(venta.id)} 
                          style={{ padding: '8px', backgroundColor: '#fee2e2', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                          title="Eliminar venta (solo < 24hs)"
                        >
                          <Trash2 size={16} color="#dc2626" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ef4444', color: 'white', borderRadius: '16px 16px 0 0', flexShrink: 0 }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Nueva Venta</h2>
                <p style={{ fontSize: '14px', margin: '4px 0 0 0', opacity: 0.9 }}>Registra la venta de un extintor</p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px', cursor: 'pointer', color: 'white' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}>Cliente *</label>
                    <select required value={formData.clienteId} onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })} style={inputStyle}>
                      <option value="">Seleccionar cliente...</option>
                      {clientes.map(cliente => (
                        <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Producto (Extintor) *</label>
                    <select required value={formData.productoId} onChange={(e) => handleProductoChange(e.target.value)} style={inputStyle}>
                      <option value="">Seleccionar extintor...</option>
                      {productos.map(producto => (
                        <option key={producto.id} value={producto.id}>
                          {producto.nombre} - Stock: {producto.stockActual}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>Cantidad *</label>
                      <input type="number" required min="1" value={formData.cantidad} onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Precio Unitario *</label>
                      <input type="number" required min="0" step="0.01" value={formData.precioUnitario} onChange={(e) => setFormData({ ...formData, precioUnitario: e.target.value })} style={inputStyle} />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>N° de Equipo del Extintor *</label>
                    <input type="text" required value={formData.numeroEquipo} onChange={(e) => setFormData({ ...formData, numeroEquipo: e.target.value })} style={inputStyle} placeholder="Ej: ABC-001, 5664" />
                    <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>Será el número único del extintor en el sistema</p>
                  </div>

                  <div>
                    <label style={labelStyle}>Observaciones</label>
                    <textarea value={formData.observaciones} onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Notas adicionales sobre la venta" />
                  </div>

                  <div style={{ padding: '16px', backgroundColor: '#dbeafe', borderRadius: '8px', border: '1px solid #3b82f6' }}>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e40af', margin: '0 0 8px 0' }}>Al registrar esta venta:</p>
                    <ul style={{ fontSize: '13px', color: '#1e3a8a', margin: 0, paddingLeft: '20px' }}>
                      <li>Se descontará del inventario automáticamente</li>
                      <li>Se creará el extintor en el sistema del cliente</li>
                      <li>El extintor quedará marcado como activo</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div style={{ padding: '24px', borderTop: '2px solid #e5e7eb', flexShrink: 0, display: 'flex', gap: '12px', justifyContent: 'flex-end', backgroundColor: 'white', borderRadius: '0 0 16px 16px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '12px 24px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Cancelar
                </button>
                <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Registrar Venta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingVenta && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ef4444', color: 'white', borderRadius: '16px 16px 0 0' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Editar Venta</h2>
                <p style={{ fontSize: '14px', margin: '4px 0 0 0', opacity: 0.9 }}>Equipo #{editingVenta.numeroEquipo}</p>
              </div>
              <button onClick={() => { setShowEditModal(false); setEditingVenta(null); }} style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px', cursor: 'pointer', color: 'white' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Precio Unitario *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={editFormData.precioUnitario}
                    onChange={(e) => setEditFormData({ ...editFormData, precioUnitario: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Observaciones</label>
                  <textarea
                    value={editFormData.observaciones}
                    onChange={(e) => setEditFormData({ ...editFormData, observaciones: e.target.value })}
                    style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                    placeholder="Notas adicionales sobre la venta"
                  />
                </div>

                <div style={{ padding: '12px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #f59e0b' }}>
                  <p style={{ fontSize: '13px', color: '#92400e', margin: 0 }}>
                    Solo se puede modificar el precio unitario y las observaciones de la venta.
                  </p>
                </div>
              </div>

              <div style={{ padding: '24px', borderTop: '2px solid #e5e7eb', display: 'flex', gap: '12px', justifyContent: 'flex-end', backgroundColor: 'white', borderRadius: '0 0 16px 16px' }}>
                <button type="button" onClick={() => { setShowEditModal(false); setEditingVenta(null); }} style={{ padding: '12px 24px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Cancelar
                </button>
                <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Actualizar Venta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const headerStyle = { padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' };
const cellStyle = { padding: '16px', fontSize: '14px' };
const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#374151' };
const inputStyle = { width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s ease' };

export default VentasPage;
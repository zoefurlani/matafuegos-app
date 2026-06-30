import { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Calendar,
  User,
  X,
  Trash2,
  Eye,
  Ban,
  DollarSign,
  TrendingUp,
  Download
} from 'lucide-react';
import { comprobantesAPI, clientesAPI } from '../../services/api'; 
import { useToast } from '../../contexts/ToastContext';

function ComprobantesPage() {
  const toast = useToast();
  const [comprobantes, setComprobantes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState(null);

  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    clienteId: '',
    clienteNombre: '',
    clienteDni: '',
    clienteDireccion: '',
    clienteTelefono: '',
    observaciones: '',
  });

  const [items, setItems] = useState([]);
  const [nuevoItem, setNuevoItem] = useState({
    tipoOperacion: 'Recarga',
    descripcion: '',
    cantidad: 1,
    precioUnitario: 0,
  });

  useEffect(() => {
    fetchData();
    fetchClientes();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [comprobantesData, statsData] = await Promise.all([
        comprobantesAPI.getAll(),
        comprobantesAPI.getStats(),
      ]);
      setComprobantes(comprobantesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const fetchClientes = async () => {
    try {
      const data = await clientesAPI.getAll(); 
      setClientes(data.clientes || data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      toast.error('Error al cargar clientes');
    }
  };

  const agregarItem = () => {
    if (!nuevoItem.descripcion || nuevoItem.cantidad <= 0 || nuevoItem.precioUnitario < 0) {
      toast.warning('Completa todos los campos del item');
      return;
    }

    const cantidad = parseFloat(nuevoItem.cantidad) || 0;
    const precioUnitario = parseFloat(nuevoItem.precioUnitario) || 0;
    const subtotal = cantidad * precioUnitario;
    
    setItems([...items, { 
      tipoOperacion: nuevoItem.tipoOperacion,
      descripcion: nuevoItem.descripcion,
      cantidad,
      precioUnitario,
      subtotal 
    }]);
    
    setNuevoItem({
      tipoOperacion: 'Recarga',
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0,
    });
  };

  const eliminarItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calcularTotal = () => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.clienteId) {
      toast.warning('Debes seleccionar un cliente');
      return;
    }

    if (!formData.clienteNombre) {
      toast.warning('El nombre del cliente es obligatorio');
      return;
    }

    if (items.length === 0) {
      toast.warning('Agrega al menos un item al comprobante');
      return;
    }

    try {
      const total = calcularTotal();
      
      await comprobantesAPI.create({
        ...formData,
        clienteId: parseInt(formData.clienteId),
        items,
        total,
      });

      toast.success('Comprobante generado correctamente');
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error al generar comprobante:', error);
      toast.error(error.message || 'Error al generar el comprobante');
    }
  };

  const resetForm = () => {
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      clienteId: '',
      clienteNombre: '',
      clienteDni: '',
      clienteDireccion: '',
      clienteTelefono: '',
      observaciones: '',
    });
    setItems([]);
    setNuevoItem({
      tipoOperacion: 'Recarga',
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0,
    });
  };

  const handleVerComprobante = (comprobante) => {
    setVistaPrevia(comprobante);
  };

  const handleDescargarPDF = async (id, numero) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/comprobantes/${id}/pdf`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al descargar PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Comprobante_${numero}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('PDF descargado correctamente');
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      toast.error('Error al descargar el PDF');
    }
  };

  const handleAnular = async (id) => {
    const confirmed = await toast.confirm('¿Estás seguro de anular este comprobante?');
    if (!confirmed) return;

    try {
      await comprobantesAPI.anular(id);
      toast.success('Comprobante anulado correctamente');
      fetchData();
    } catch (error) {
      console.error('Error al anular comprobante:', error);
      toast.error(error.message || 'Error al anular el comprobante');
    }
  };

  const comprobantesFiltrados = comprobantes.filter(comp => {
    const matchSearch =
      comp.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
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
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Comprobantes</h1>
          <p style={{ fontSize: '16px', color: '#6b7280' }}>Genera y gestiona comprobantes de servicios</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#dc2626'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <Plus size={20} />
          Nuevo Comprobante
        </button>
      </div>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#dbeafe', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={24} color="#2563eb" />
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Total Comprobantes</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{stats.totalComprobantes}</p>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#fef3c7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={24} color="#f59e0b" />
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Este Mes</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{stats.comprobantesMes}</p>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#d1fae5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={24} color="#059669" />
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Facturado Mes</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>${stats.totalRecaudadoMes?.toLocaleString('es-AR')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} color="#6b7280" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Buscar por N° comprobante o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px', paddingLeft: '48px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', outline: 'none' }}
          />
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        {comprobantesFiltrados.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
            <FileText size={48} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>No hay comprobantes</p>
            <p style={{ fontSize: '14px' }}>{searchTerm ? 'No se encontraron resultados' : 'Comienza generando tu primer comprobante'}</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={headerStyle}>N° Comprobante</th>
                <th style={headerStyle}>Fecha</th>
                <th style={headerStyle}>Cliente</th>
                <th style={headerStyle}>Total</th>
                <th style={headerStyle}>Estado</th>
                <th style={headerStyle}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {comprobantesFiltrados.map((comprobante) => (
                <tr key={comprobante.id} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background-color 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={cellStyle}>
                    <span style={{ fontWeight: 'bold', color: '#111827' }}>{comprobante.numero}</span>
                  </td>
                  <td style={cellStyle}>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      {new Date(comprobante.fecha).toLocaleDateString('es-AR')}
                    </div>
                  </td>
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={16} color="#6b7280" />
                      <span style={{ color: '#374151' }}>{comprobante.clienteNombre}</span>
                    </div>
                  </td>
                  <td style={cellStyle}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#059669' }}>${comprobante.total?.toLocaleString('es-AR')}</span>
                  </td>
                  <td style={cellStyle}>
                    {comprobante.estado === 'activo' ? (
                      <span style={{ padding: '4px 12px', backgroundColor: '#d1fae5', color: '#059669', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>
                        Activo
                      </span>
                    ) : (
                      <span style={{ padding: '4px 12px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>
                        Anulado
                      </span>
                    )}
                  </td>
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleVerComprobante(comprobante)}
                        style={{ padding: '8px', backgroundColor: '#dbeafe', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        title="Ver comprobante"
                      >
                        <Eye size={16} color="#2563eb" />
                      </button>
                      <button
                        onClick={() => handleDescargarPDF(comprobante.id, comprobante.numero)}
                        style={{ padding: '8px', backgroundColor: '#d1fae5', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        title="Descargar PDF"
                      >
                        <Download size={16} color="#059669" />
                      </button>
                      {comprobante.estado === 'activo' && (
                        <button
                          onClick={() => handleAnular(comprobante.id)}
                          style={{ padding: '8px', backgroundColor: '#fef3c7', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                          title="Anular"
                        >
                          <Ban size={16} color="#f59e0b" />
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
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '900px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ef4444', color: 'white', borderRadius: '16px 16px 0 0', flexShrink: 0 }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Nuevo Comprobante</h2>
                <p style={{ fontSize: '14px', margin: '4px 0 0 0', opacity: 0.9 }}>Genera un comprobante de servicio</p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px', cursor: 'pointer', color: 'white' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>Datos del Cliente</h3>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Seleccionar Cliente *</label>
                    <select
                      required
                      value={formData.clienteId}
                      onChange={(e) => {
                        const clienteSeleccionado = clientes.find(c => c.id === parseInt(e.target.value));
                        if (clienteSeleccionado) {
                          setFormData({
                            ...formData,
                            clienteId: parseInt(e.target.value),
                            clienteNombre: clienteSeleccionado.nombre || '',
                            clienteDni: clienteSeleccionado.cuit || '',
                            clienteDireccion: clienteSeleccionado.direccion || '',
                            clienteTelefono: clienteSeleccionado.telefono || '',
                          });
                        } else {
                          setFormData({
                            ...formData,
                            clienteId: '',
                            clienteNombre: '',
                            clienteDni: '',
                            clienteDireccion: '',
                            clienteTelefono: '',
                          });
                        }
                      }}
                      style={inputStyle}
                    >
                      <option value="">-- Selecciona un cliente --</option>
                      {clientes.map(cliente => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nombre} {cliente.cuit ? `(${cliente.cuit})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={labelStyle}>Nombre / Empresa *</label>
                      <input
                        type="text"
                        required
                        value={formData.clienteNombre}
                        onChange={(e) => setFormData({ ...formData, clienteNombre: e.target.value })}
                        style={inputStyle}
                        placeholder="Juan Pérez / Empresa SA"
                        readOnly={formData.clienteId !== ''}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Fecha *</label>
                      <input
                        type="date"
                        required
                        value={formData.fecha}
                        onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>DNI / CUIT</label>
                      <input
                        type="text"
                        value={formData.clienteDni}
                        onChange={(e) => setFormData({ ...formData, clienteDni: e.target.value })}
                        style={inputStyle}
                        placeholder="12345678"
                        readOnly={formData.clienteId !== ''}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Dirección</label>
                      <input
                        type="text"
                        value={formData.clienteDireccion}
                        onChange={(e) => setFormData({ ...formData, clienteDireccion: e.target.value })}
                        style={inputStyle}
                        placeholder="Calle 123"
                        readOnly={formData.clienteId !== ''}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Teléfono</label>
                      <input
                        type="text"
                        value={formData.clienteTelefono}
                        onChange={(e) => setFormData({ ...formData, clienteTelefono: e.target.value })}
                        style={inputStyle}
                        placeholder="3482-123456"
                        readOnly={formData.clienteId !== ''}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>Items</h3>
                  
                  <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 100px 120px 80px', gap: '12px', alignItems: 'end' }}>
                      <div>
                        <label style={labelStyle}>Tipo</label>
                        <select
                          value={nuevoItem.tipoOperacion}
                          onChange={(e) => setNuevoItem({ ...nuevoItem, tipoOperacion: e.target.value })}
                          style={inputStyle}
                        >
                          <option value="Recarga">Recarga</option>
                          <option value="Venta">Venta</option>
                          <option value="Servicio">Servicio</option>
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Descripción</label>
                        <input
                          type="text"
                          value={nuevoItem.descripcion}
                          onChange={(e) => setNuevoItem({ ...nuevoItem, descripcion: e.target.value })}
                          style={inputStyle}
                          placeholder="Ej: Recarga ABC 5kg"
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Cant.</label>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={nuevoItem.cantidad}
                          onChange={(e) => setNuevoItem({ ...nuevoItem, cantidad: e.target.value })}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Precio Unit.</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={nuevoItem.precioUnitario}
                          onChange={(e) => setNuevoItem({ ...nuevoItem, precioUnitario: e.target.value })}
                          style={inputStyle}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={agregarItem}
                        style={{ padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>

                  {items.length > 0 && (
                    <div style={{ border: '2px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f9fafb' }}>
                          <tr>
                            <th style={{ ...headerStyle, textAlign: 'left' }}>Tipo</th>
                            <th style={{ ...headerStyle, textAlign: 'left' }}>Descripción</th>
                            <th style={{ ...headerStyle, textAlign: 'center' }}>Cant.</th>
                            <th style={{ ...headerStyle, textAlign: 'right' }}>P. Unit.</th>
                            <th style={{ ...headerStyle, textAlign: 'right' }}>Subtotal</th>
                            <th style={{ ...headerStyle, textAlign: 'center' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                              <td style={{ ...cellStyle, fontSize: '13px' }}>
                                <span style={{ padding: '2px 8px', backgroundColor: '#dbeafe', color: '#2563eb', borderRadius: '4px', fontSize: '12px' }}>
                                  {item.tipoOperacion}
                                </span>
                              </td>
                              <td style={{ ...cellStyle, fontSize: '13px' }}>{item.descripcion}</td>
                              <td style={{ ...cellStyle, fontSize: '13px', textAlign: 'center' }}>{item.cantidad}</td>
                              <td style={{ ...cellStyle, fontSize: '13px', textAlign: 'right' }}>${item.precioUnitario.toFixed(2)}</td>
                              <td style={{ ...cellStyle, fontSize: '13px', textAlign: 'right', fontWeight: 'bold' }}>${item.subtotal.toFixed(2)}</td>
                              <td style={{ ...cellStyle, textAlign: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => eliminarItem(index)}
                                  style={{ padding: '4px', backgroundColor: '#fee2e2', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                  <Trash2 size={14} color="#dc2626" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderTop: '2px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>TOTAL</p>
                          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>${calcularTotal().toLocaleString('es-AR')}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label style={labelStyle}>Observaciones</label>
                  <textarea
                    value={formData.observaciones}
                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                    style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                    placeholder="Notas adicionales"
                  />
                </div>
              </div>

              <div style={{ padding: '24px', borderTop: '2px solid #e5e7eb', flexShrink: 0, display: 'flex', gap: '12px', justifyContent: 'flex-end', backgroundColor: 'white', borderRadius: '0 0 16px 16px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: '12px 24px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ padding: '12px 24px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Generar Comprobante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {vistaPrevia && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '24px', borderBottom: '2px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Comprobante {vistaPrevia.numero}</h2>
              <button onClick={() => setVistaPrevia(null)} style={{ padding: '8px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            <div style={{ padding: '32px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px', padding: '16px', backgroundColor: '#fee2e2', borderRadius: '8px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#dc2626', margin: '0 0 8px 0' }}>COMPROBANTE NO VÁLIDO COMO FACTURA</h1>
                <p style={{ fontSize: '14px', color: '#991b1b', margin: 0 }}>Este documento no tiene validez fiscal</p>
              </div>

              <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>ZD MATAFUEGOS</h2>
                <p style={{ fontSize: '14px', color: '#374151', margin: '4px 0' }}>Furlani Nelson Pedro</p>
                <p style={{ fontSize: '14px', color: '#374151', margin: '4px 0' }}>25 de Mayo 1675, Romang, Santa Fe</p>
                <p style={{ fontSize: '14px', color: '#374151', margin: '4px 0' }}>Celular: 3482 445650</p>
                <p style={{ fontSize: '14px', color: '#374151', margin: '4px 0' }}>Habilitación Municipal N° 70/2018</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>COMPROBANTE</p>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{vistaPrevia.numero}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>FECHA</p>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{new Date(vistaPrevia.fecha).toLocaleDateString('es-AR')}</p>
                </div>
              </div>

              <div style={{ marginBottom: '24px', padding: '16px', border: '2px solid #e5e7eb', borderRadius: '8px' }}>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px 0' }}>CLIENTE</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>{vistaPrevia.clienteNombre}</p>
                {vistaPrevia.clienteDni && <p style={{ fontSize: '14px', color: '#374151', margin: '4px 0' }}>DNI/CUIT: {vistaPrevia.clienteDni}</p>}
                {vistaPrevia.clienteDireccion && <p style={{ fontSize: '14px', color: '#374151', margin: '4px 0' }}>{vistaPrevia.clienteDireccion}</p>}
                {vistaPrevia.clienteTelefono && <p style={{ fontSize: '14px', color: '#374151', margin: '4px 0' }}>Tel: {vistaPrevia.clienteTelefono}</p>}
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
                <thead style={{ backgroundColor: '#f9fafb' }}>
                  <tr>
                    <th style={{ ...headerStyle, textAlign: 'left' }}>Tipo</th>
                    <th style={{ ...headerStyle, textAlign: 'left' }}>Descripción</th>
                    <th style={{ ...headerStyle, textAlign: 'center' }}>Cant.</th>
                    <th style={{ ...headerStyle, textAlign: 'right' }}>P. Unit.</th>
                    <th style={{ ...headerStyle, textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {vistaPrevia.items.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={cellStyle}>
                        <span style={{ padding: '2px 8px', backgroundColor: '#dbeafe', color: '#2563eb', borderRadius: '4px', fontSize: '12px' }}>
                          {item.tipoOperacion}
                        </span>
                      </td>
                      <td style={cellStyle}>{item.descripcion}</td>
                      <td style={{ ...cellStyle, textAlign: 'center' }}>{item.cantidad}</td>
                      <td style={{ ...cellStyle, textAlign: 'right' }}>${item.precioUnitario.toFixed(2)}</td>
                      <td style={{ ...cellStyle, textAlign: 'right', fontWeight: 'bold' }}>${item.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', minWidth: '200px' }}>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0', textAlign: 'right' }}>TOTAL</p>
                  <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: 0, textAlign: 'right' }}>${vistaPrevia.total?.toLocaleString('es-AR')}</p>
                </div>
              </div>

              {vistaPrevia.observaciones && (
                <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px 0' }}>OBSERVACIONES</p>
                  <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>{vistaPrevia.observaciones}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const headerStyle = { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' };
const cellStyle = { padding: '12px 16px', fontSize: '14px' };
const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#374151' };
const inputStyle = { width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s ease' };

export default ComprobantesPage;
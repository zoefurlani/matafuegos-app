import { useState, useEffect } from 'react';
import { 
  Flame, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X,
  Calendar,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Package,
  MinusCircle,
  PlusCircle
} from 'lucide-react';
import { extintoresAPI, clientesAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';


function ExtintoresPage() {
  const toast = useToast();
  const [extintores, setExtintores] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clientesConEquipos, setClientesConEquipos] = useState([]); // NUEVO
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCliente, setFilterCliente] = useState('');
  const [editingExtintor, setEditingExtintor] = useState(null);
  
  // Estados para Servicio Múltiple (ahora único)
  const [showServicioModal, setShowServicioModal] = useState(false);
  const [servicioClienteId, setServicioClienteId] = useState('');
  const [extintoresServicio, setExtintoresServicio] = useState([]);


  // Cargar extintores y clientes al iniciar
  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
    try {
      setLoading(true);
      const [extintoresData, clientesData] = await Promise.all([
        extintoresAPI.getAll(),
        clientesAPI.getAll()
      ]);
      setExtintores(extintoresData);
      setClientes(clientesData);
      
      // NUEVO: Cargar clientes con sus números de equipo
      await fetchClientesConEquipos();
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.info('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };


  // NUEVO: Función para cargar clientes con números de equipo
  const fetchClientesConEquipos = async () => {
    try {
      // Si tienes el endpoint nuevo en el backend:
      // const response = await clientesAPI.getAllWithEquipos();
      // setClientesConEquipos(response);
      
      // Mientras tanto, calculamos manualmente:
      const clientesConNumerosEquipo = await Promise.all(
        clientes.map(async (cliente) => {
          try {
            const extintoresCliente = extintores.filter(
              ext => ext.clienteId === cliente.id || ext.cliente?.id === cliente.id
            );
            const numerosEquipo = extintoresCliente.map(ext => ext.numeroEquipo);
            
            return {
              ...cliente,
              numerosEquipo: numerosEquipo
            };
          } catch {
            return {
              ...cliente,
              numerosEquipo: []
            };
          }
        })
      );
      
      setClientesConEquipos(clientesConNumerosEquipo);
    } catch (error) {
      console.error('Error al cargar números de equipo:', error);
    }
  };


  // Actualizar clientesConEquipos cuando cambien extintores o clientes
  useEffect(() => {
    if (clientes.length > 0 && extintores.length >= 0) {
      fetchClientesConEquipos();
    }
  }, [extintores, clientes]);


  // Abrir modal para editar extintor
  const handleEditarExtintor = (extintor) => {
    setEditingExtintor(extintor);
    setServicioClienteId(extintor.clienteId || extintor.cliente?.id || '');
    setExtintoresServicio([{
      id: Date.now(),
      numeroEquipo: extintor.numeroEquipo,
      tipo: extintor.tipo,
      capacidad: extintor.capacidad.toString(),
      marca: extintor.marca,
      fechaUltimaRecarga: extintor.fechaUltimaRecarga ? extintor.fechaUltimaRecarga.split('T')[0] : '',
      fechaVencimiento: extintor.fechaVencimiento ? extintor.fechaVencimiento.split('T')[0] : '',
      estado: extintor.estado,
      ubicacion: extintor.ubicacion || '',
      observaciones: extintor.observaciones || ''
    }]);
    setShowServicioModal(true);
  };


  // Eliminar extintor
  const handleEliminarExtintor = async (id, numeroEquipo) => {
    const confirmed = await toast.confirm(`¿Estás seguro de eliminar el extintor "${numeroEquipo}"?`);
    if (!confirmed) return;


    try {
      await extintoresAPI.delete(id);
      toast.success('Extintor eliminado correctamente');
      fetchData();
    } catch (error) {
      console.error('Error al eliminar extintor:', error);
      toast.error('Error al eliminar el extintor');
    }
  };


  // ============ FUNCIONES PARA SERVICIO MÚLTIPLE ============


  const handleAgregarExtintorServicio = () => {
    setExtintoresServicio([
      ...extintoresServicio,
      {
        id: Date.now(),
        numeroEquipo: '',
        tipo: 'ABC',
        capacidad: '',
        marca: '',
        fechaUltimaRecarga: new Date().toISOString().split('T')[0],
        fechaVencimiento: '',
        estado: 'activo',
        ubicacion: '',
        observaciones: ''
      }
    ]);
  };


  const handleUpdateExtintorServicio = (id, field, value) => {
    setExtintoresServicio(extintoresServicio.map(ext =>
      ext.id === id ? { ...ext, [field]: value } : ext
    ));
  };


  const handleEliminarExtintorServicio = (id) => {
    setExtintoresServicio(extintoresServicio.filter(ext => ext.id !== id));
  };


  const handleGuardarServicio = async () => {
    if (!servicioClienteId) {
      toast.warning('Debes seleccionar un cliente');
      return;
    }


    if (extintoresServicio.length === 0) {
      toast.warning('Debes agregar al menos un extintor');
      return;
    }


    for (const extintor of extintoresServicio) {
      if (!extintor.numeroEquipo || !extintor.capacidad) {
        toast.warning('Todos los extintores deben tener número de equipo y capacidad');
        return;
      }
    }


    try {
      if (editingExtintor) {
        // Modo edición
        const extintor = extintoresServicio[0];
        const dataToSend = {
          numeroEquipo: extintor.numeroEquipo,
          tipo: extintor.tipo,
          capacidad: parseFloat(extintor.capacidad),
          marca: extintor.marca,
          fechaUltimaRecarga: extintor.fechaUltimaRecarga || null,
          fechaVencimiento: extintor.fechaVencimiento || null,
          estado: extintor.estado,
          ubicacion: extintor.ubicacion,
          observaciones: extintor.observaciones,
          clienteId: parseInt(servicioClienteId)
        };
        
        await extintoresAPI.update(editingExtintor.id, dataToSend);
        toast.success('Extintor actualizado correctamente');
      } else {
        // Modo creación
        for (const extintor of extintoresServicio) {
          const dataToSend = {
            numeroEquipo: extintor.numeroEquipo,
            tipo: extintor.tipo,
            capacidad: parseFloat(extintor.capacidad),
            marca: extintor.marca,
            fechaUltimaRecarga: extintor.fechaUltimaRecarga || null,
            fechaVencimiento: extintor.fechaVencimiento || null,
            estado: extintor.estado,
            ubicacion: extintor.ubicacion,
            observaciones: extintor.observaciones,
            clienteId: parseInt(servicioClienteId)
          };


          await extintoresAPI.create(dataToSend);
        }


        toast.info(`✅ Se registraron ${extintoresServicio.length} extintor(es) correctamente`);
      }
      
      setShowServicioModal(false);
      setServicioClienteId('');
      setExtintoresServicio([]);
      setEditingExtintor(null);
      fetchData();
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('❌ Error al guardar: ' + error.message);
    }
  };


  const getClienteNombre = (extintor) => {
    if (extintor.cliente) {
      return extintor.cliente.nombre;
    }
    const cliente = clientes.find(c => c.id === extintor.clienteId);
    return cliente ? cliente.nombre : 'Sin cliente';
  };


  const getEstadoVencimiento = (fechaVencimiento) => {
    if (!fechaVencimiento) return { text: 'Sin fecha', color: '#6b7280', icon: AlertTriangle };
    
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diasRestantes = Math.floor((vencimiento - hoy) / (1000 * 60 * 60 * 24));


    if (diasRestantes < 0) {
      return { text: 'VENCIDO', color: '#ef4444', icon: AlertTriangle };
    } else if (diasRestantes <= 30) {
      return { text: `Vence en ${diasRestantes} días`, color: '#f97316', icon: AlertTriangle };
    } else if (diasRestantes <= 60) {
      return { text: `Vence en ${diasRestantes} días`, color: '#f59e0b', icon: Calendar };
    } else {
      return { text: 'Al día', color: '#10b981', icon: CheckCircle };
    }
  };


  // NUEVO: Obtener los números de equipo del cliente seleccionado
  const getClienteEquipos = (clienteId) => {
    const cliente = clientesConEquipos.find(c => c.id === parseInt(clienteId));
    return cliente?.numerosEquipo || [];
  };


  const extintoresFiltrados = extintores.filter(extintor => {
    const matchSearch = 
      extintor.numeroEquipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      extintor.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getClienteNombre(extintor).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchCliente = !filterCliente || 
      extintor.clienteId === parseInt(filterCliente) ||
      extintor.cliente?.id === parseInt(filterCliente);


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
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Extintores</h1>
          <p style={{ fontSize: '16px', color: '#6b7280' }}>Gestiona los extintores y su mantenimiento</p>
        </div>
        <button
          onClick={() => { setEditingExtintor(null); setServicioClienteId(''); setExtintoresServicio([]); setShowServicioModal(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s ease' }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#dc2626'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <Plus size={20} />
          Registrar Extintores
        </button>
      </div>


      <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={20} color="#6b7280" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Buscar por número, marca o cliente..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              style={{ 
                width: '100%', 
                padding: '12px',
                paddingLeft: '48px',
                border: '2px solid #e5e7eb', 
                borderRadius: '8px', 
                fontSize: '16px', 
                outline: 'none' 
              }} 
            />
          </div>
          <select value={filterCliente} onChange={(e) => setFilterCliente(e.target.value)} style={{ padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', outline: 'none' }}>
            <option value="">Todos los clientes</option>
            {clientes.map(cliente => <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>)}
          </select>
        </div>
      </div>


      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        {extintoresFiltrados.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
            <Flame size={48} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>No hay extintores</p>
            <p style={{ fontSize: '14px' }}>{searchTerm || filterCliente ? 'No se encontraron resultados' : 'Comienza agregando tu primer extintor'}</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={headerStyle}>N° Equipo</th>
                <th style={headerStyle}>Cliente</th>
                <th style={headerStyle}>Tipo / Capacidad</th>
                <th style={headerStyle}>Marca</th>
                <th style={headerStyle}>Última Recarga</th>
                <th style={headerStyle}>Estado</th>
                <th style={headerStyle}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {extintoresFiltrados.map((extintor) => {
                const estadoVenc = getEstadoVencimiento(extintor.fechaVencimiento);
                const IconEstado = estadoVenc.icon;
                return (
                  <tr key={extintor.id} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background-color 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                    <td style={cellStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', backgroundColor: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Flame size={20} color="#ef4444" />
                        </div>
                        <div>
                          <p style={{ fontWeight: 'bold', color: '#111827' }}>{extintor.numeroEquipo}</p>
                          {extintor.ubicacion && <p style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} />{extintor.ubicacion}</p>}
                        </div>
                      </div>
                    </td>
                    <td style={cellStyle}><span style={{ fontWeight: '500', color: '#374151' }}>{getClienteNombre(extintor)}</span></td>
                    <td style={cellStyle}>
                      <div>
                        <span style={{ padding: '4px 12px', backgroundColor: '#f3f4f6', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold' }}>{extintor.tipo}</span>
                        <span style={{ marginLeft: '8px', color: '#6b7280' }}>{extintor.capacidad} kg</span>
                      </div>
                    </td>
                    <td style={cellStyle}><span style={{ color: '#6b7280' }}>{extintor.marca}</span></td>
                    <td style={cellStyle}>
                      {extintor.fechaUltimaRecarga ? (
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>
                          <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                          {new Date(extintor.fechaUltimaRecarga).toLocaleDateString('es-AR')}
                        </div>
                      ) : <span style={{ color: '#9ca3af' }}>Sin registro</span>}
                    </td>
                    <td style={cellStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: estadoVenc.color + '20', borderRadius: '6px', width: 'fit-content' }}>
                        <IconEstado size={16} color={estadoVenc.color} />
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: estadoVenc.color }}>{estadoVenc.text}</span>
                      </div>
                    </td>
                    <td style={cellStyle}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEditarExtintor(extintor)} style={{ padding: '8px', backgroundColor: '#dbeafe', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                          <Edit2 size={16} color="#2563eb" />
                        </button>
                        <button onClick={() => handleEliminarExtintor(extintor.id, extintor.numeroEquipo)} style={{ padding: '8px', backgroundColor: '#fee2e2', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                          <Trash2 size={16} color="#dc2626" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>


      {showServicioModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '1200px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ef4444', color: 'white', borderRadius: '16px 16px 0 0' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{editingExtintor ? 'Editar Extintor' : 'Registrar Extintores'}</h2>
                <p style={{ fontSize: '14px', margin: '4px 0 0 0', opacity: 0.9 }}>{editingExtintor ? 'Modifica los datos del extintor' : 'Agrega uno o varios extintores de forma rápida'}</p>
              </div>
              <button onClick={() => { setShowServicioModal(false); setServicioClienteId(''); setExtintoresServicio([]); setEditingExtintor(null); }} style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px', cursor: 'pointer', color: 'white' }}>
                <X size={24} />
              </button>
            </div>


            <div style={{ padding: '24px' }}>
              <div style={{ backgroundColor: '#fef2f2', padding: '20px', borderRadius: '12px', marginBottom: '24px', border: '2px solid #ef4444' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '16px', fontWeight: 'bold', color: '#991b1b' }}>Seleccionar Cliente *</label>
                <select 
                  value={servicioClienteId} 
                  onChange={(e) => setServicioClienteId(e.target.value)} 
                  disabled={editingExtintor} 
                  style={{ width: '100%', padding: '14px', border: '2px solid #ef4444', borderRadius: '8px', fontSize: '16px', outline: 'none', backgroundColor: 'white', cursor: editingExtintor ? 'not-allowed' : 'pointer' }}
                >
                  <option value="">Seleccionar cliente...</option>
                  {clientesConEquipos.map(cliente => {
                    const equipos = cliente.numerosEquipo || [];
                    const equiposText = equipos.length > 0 
                      ? ` - Equipos: ${equipos.join(', ')}` 
                      : ' - Sin equipos registrados';
                    
                    return (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre} ({cliente.cuit || 'Sin CUIT'}){equiposText}
                      </option>
                    );
                  })}
                </select>
                
                {/* NUEVO: Mostrar equipos existentes del cliente seleccionado */}
                {servicioClienteId && getClienteEquipos(servicioClienteId).length > 0 && (
                  <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#dbeafe', borderRadius: '8px', border: '1px solid #3b82f6' }}>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e40af', marginBottom: '6px' }}>
                      📋 Equipos existentes de este cliente:
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {getClienteEquipos(servicioClienteId).map((equipo, idx) => (
                        <span 
                          key={idx} 
                          style={{ 
                            padding: '4px 12px', 
                            backgroundColor: '#3b82f6', 
                            color: 'white', 
                            borderRadius: '6px', 
                            fontSize: '13px',
                            fontWeight: 'bold'
                          }}
                        >
                          {equipo}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>


              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>Extintores ({extintoresServicio.length})</h3>
                  {!editingExtintor && (
                    <button type="button" onClick={handleAgregarExtintorServicio} disabled={!servicioClienteId} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: !servicioClienteId ? '#9ca3af' : '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: !servicioClienteId ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease' }}>
                      <PlusCircle size={18} />Agregar Extintor
                    </button>
                  )}
                </div>


                {extintoresServicio.length === 0 ? (
                  <div style={{ padding: '48px', textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: '12px', border: '2px dashed #d1d5db' }}>
                    <Package size={48} color="#9ca3af" style={{ margin: '0 auto 12px' }} />
                    <p style={{ fontSize: '16px', color: '#6b7280' }}>{servicioClienteId ? 'Haz click en "Agregar Extintor" para comenzar' : 'Selecciona un cliente primero'}</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {extintoresServicio.map((extintor, index) => (
                      <div key={extintor.id} style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '12px', border: '2px solid #e5e7eb' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>Extintor #{index + 1}</h4>
                          {!editingExtintor && (
                            <button type="button" onClick={() => handleEliminarExtintorServicio(extintor.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
                              <MinusCircle size={16} />Quitar
                            </button>
                          )}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                          <div><label style={labelStyle}>N° Equipo *</label><input type="text" value={extintor.numeroEquipo} onChange={(e) => handleUpdateExtintorServicio(extintor.id, 'numeroEquipo', e.target.value)} style={inputStyle} placeholder="Ej: 5664, ABC-001" /></div>
                          <div><label style={labelStyle}>Tipo *</label><select value={extintor.tipo} onChange={(e) => handleUpdateExtintorServicio(extintor.id, 'tipo', e.target.value)} style={inputStyle}><option value="ABC">ABC</option><option value="BC">BC</option><option value="K">K</option><option value="CO2">CO2</option><option value="HCFC">HCFC</option></select></div>
                          <div><label style={labelStyle}>Capacidad (kg) *</label><input type="number" step="0.1" min="0" value={extintor.capacidad} onChange={(e) => handleUpdateExtintorServicio(extintor.id, 'capacidad', e.target.value)} style={inputStyle} placeholder="Ej: 1.0, 2.5, 5.0" /></div>
                          <div><label style={labelStyle}>Marca</label><input type="text" value={extintor.marca} onChange={(e) => handleUpdateExtintorServicio(extintor.id, 'marca', e.target.value)} style={inputStyle} placeholder="Ej: Melisan, Horizonte" /></div>
                          <div><label style={labelStyle}>Última Recarga</label><input type="date" value={extintor.fechaUltimaRecarga} onChange={(e) => handleUpdateExtintorServicio(extintor.id, 'fechaUltimaRecarga', e.target.value)} style={inputStyle} /></div>
                          <div><label style={labelStyle}>Vencimiento</label><input type="date" value={extintor.fechaVencimiento} onChange={(e) => handleUpdateExtintorServicio(extintor.id, 'fechaVencimiento', e.target.value)} style={inputStyle} /></div>
                          <div><label style={labelStyle}>Ubicación</label><input type="text" value={extintor.ubicacion} onChange={(e) => handleUpdateExtintorServicio(extintor.id, 'ubicacion', e.target.value)} style={inputStyle} placeholder="Ej: Recepción, Cocina" /></div>
                          <div><label style={labelStyle}>Estado *</label><select value={extintor.estado} onChange={(e) => handleUpdateExtintorServicio(extintor.id, 'estado', e.target.value)} style={inputStyle}><option value="activo">Activo</option><option value="vencido">Vencido</option><option value="en_mantenimiento">En Mantenimiento</option></select></div>
                          <div><label style={labelStyle}>Observaciones</label><input type="text" value={extintor.observaciones} onChange={(e) => handleUpdateExtintorServicio(extintor.id, 'observaciones', e.target.value)} style={inputStyle} placeholder="Notas adicionales" /></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>


              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '24px', borderTop: '2px solid #e5e7eb' }}>
                <button type="button" onClick={() => { setShowServicioModal(false); setServicioClienteId(''); setExtintoresServicio([]); setEditingExtintor(null); }} style={{ padding: '12px 24px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Cancelar
                </button>
                <button type="button" onClick={handleGuardarServicio} disabled={!servicioClienteId || extintoresServicio.length === 0} style={{ padding: '12px 24px', backgroundColor: !servicioClienteId || extintoresServicio.length === 0 ? '#9ca3af' : '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: !servicioClienteId || extintoresServicio.length === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                  {editingExtintor ? 'Actualizar' : `Guardar Servicio (${extintoresServicio.length} extintor${extintoresServicio.length !== 1 ? 'es' : ''})`}
                </button>
              </div>
            </div>
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


export default ExtintoresPage;
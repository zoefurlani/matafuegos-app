import { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X,
  Calendar,
  DollarSign,
  Package,
  AlertTriangle,
  CheckCircle,
  Filter,
  Download,
  PlusCircle,
  MinusCircle,
  ListChecks
} from 'lucide-react';
import { recargasAPI, clientesAPI, extintoresAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

function RecargasPage() {
  const toast = useToast();
  const [recargas, setRecargas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [extintores, setExtintores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCliente, setFilterCliente] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRecarga, setEditingRecarga] = useState(null);
  
  // ⭐ Estado para modo múltiple
  const [modoMultiple, setModoMultiple] = useState(false);
  const [recargasLista, setRecargasLista] = useState([]);
  
  // Datos comunes (cliente, fecha, observaciones)
  const [datosComunes, setDatosComunes] = useState({
    clienteId: '',
    fechaRecarga: new Date().toISOString().split('T')[0],
    fechaProximaRecarga: '',
    observaciones: '',
    estado: 'completada'
  });
  
  // Formulario para un extintor individual
  const [formData, setFormData] = useState({
    extintorId: '',
    polvoKg: 0,
    manometros: 0,
    vastagos: 0,
    valvulas: 0,
    orings: 0,
    mangueras: 0,
    boquillas: 0,
    seguros: 0,
    etiquetas: 1, 
    precioManoObra: '',
    precioPolvo: '',
    precioManometros: '',
    precioVastagos: '',
    precioValvulas: '',
    precioOrings: '',
    precioMangueras: '',
    precioBoquillas: '',
    precioSeguros: '',
    precioEtiquetas: '',
    precioTotal: 0
  });

  const [extintoresDelCliente, setExtintoresDelCliente] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recargasData, clientesData, extintoresData] = await Promise.all([
        recargasAPI.getAll(),
        clientesAPI.getAll(),
        extintoresAPI.getAll()
      ]);
      setRecargas(recargasData);
      setClientes(clientesData);
      setExtintores(extintoresData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar extintores disponibles (no agregados aún)
  useEffect(() => {
    if (datosComunes.clienteId) {
      const extintoresCliente = extintores.filter(
        ext => ext.clienteId === parseInt(datosComunes.clienteId) || ext.cliente?.id === parseInt(datosComunes.clienteId)
      );
      // Excluir los ya agregados a la lista
      const extintoresDisponibles = extintoresCliente.filter(
        ext => !recargasLista.some(r => r.extintorId === ext.id.toString())
      );
      setExtintoresDelCliente(extintoresDisponibles);
    } else {
      setExtintoresDelCliente([]);
    }
  }, [datosComunes.clienteId, extintores, recargasLista]);

  // Calcular fecha próxima recarga
  useEffect(() => {
    if (datosComunes.fechaRecarga) {
      const [year, month, day] = datosComunes.fechaRecarga.split('-');
      const fechaProxima = `${parseInt(year) + 1}-${month}-${day}`;
      setDatosComunes(prev => ({
        ...prev,
        fechaProximaRecarga: fechaProxima
      }));
    }
  }, [datosComunes.fechaRecarga]);

  // Calcular precio total automáticamente
  useEffect(() => {
    const totalRepuestos = 
      Number(formData.precioPolvo || 0) +
      Number(formData.precioManometros || 0) +
      Number(formData.precioVastagos || 0) +
      Number(formData.precioValvulas || 0) +
      Number(formData.precioOrings || 0) +
      Number(formData.precioMangueras || 0) +
      Number(formData.precioBoquillas || 0) +
      Number(formData.precioSeguros || 0) +
      Number(formData.precioEtiquetas || 0);
    
    const total = Number(formData.precioManoObra || 0) + totalRepuestos;
    
    setFormData(prev => ({
      ...prev,
      precioTotal: total
    }));
  }, [
    formData.precioManoObra,
    formData.precioPolvo,
    formData.precioManometros,
    formData.precioVastagos,
    formData.precioValvulas,
    formData.precioOrings,
    formData.precioMangueras,
    formData.precioBoquillas,
    formData.precioSeguros,
    formData.precioEtiquetas
  ]);

  const handleNuevaRecarga = () => {
    setEditingRecarga(null);
    setModoMultiple(true);
    setRecargasLista([]);
    
    const hoy = new Date();
    const fechaRecarga = hoy.toISOString().split('T')[0];
    const [year, month, day] = fechaRecarga.split('-');
    const fechaProxima = `${parseInt(year) + 1}-${month}-${day}`;
    
    setDatosComunes({
      clienteId: '',
      fechaRecarga: fechaRecarga,
      fechaProximaRecarga: fechaProxima,
      observaciones: '',
      estado: 'completada'
    });
    
    resetFormularioExtintor();
    setShowModal(true);
  };

  const resetFormularioExtintor = () => {
    setFormData({
      extintorId: '',
      polvoKg: 0,
      manometros: 0,
      vastagos: 0,
      valvulas: 0,
      orings: 0,
      mangueras: 0,
      boquillas: 0,
      seguros: 0,
      etiquetas: 1, 
      precioManoObra: '',
      precioPolvo: '',
      precioManometros: '',
      precioVastagos: '',
      precioValvulas: '',
      precioOrings: '',
      precioMangueras: '',
      precioBoquillas: '',
      precioSeguros: '',
      precioEtiquetas: '',
      precioTotal: 0
    });
  };

  const handleAgregarExtintorALista = () => {
    if (!datosComunes.clienteId) {
      toast.warning('Primero selecciona un cliente');
      return;
    }

    if (!formData.extintorId) {
      toast.warning('Debes seleccionar un extintor');
      return;
    }

    const extintor = extintores.find(e => e.id === parseInt(formData.extintorId));
    
    const nuevaRecarga = {
      ...formData,
      extintorNumero: extintor?.numeroEquipo || 'N/A',
      extintorTipo: `${extintor?.tipo || ''} ${extintor?.capacidad || ''}kg`
    };

    setRecargasLista([...recargasLista, nuevaRecarga]);
    resetFormularioExtintor();
    toast.success('Extintor agregado a la lista');
  };

  const handleEliminarDeLista = (index) => {
    const nuevaLista = recargasLista.filter((_, i) => i !== index);
    setRecargasLista(nuevaLista);
    toast.info('Extintor eliminado de la lista');
  };

  const handleGuardarTodasLasRecargas = async () => {
    if (!datosComunes.clienteId) {
      toast.warning('Debes seleccionar un cliente');
      return;
    }

    if (recargasLista.length === 0) {
      toast.warning('Debes agregar al menos un extintor');
      return;
    }

    try {
      const promesas = recargasLista.map(recarga => {
        const dataToSend = {
          clienteId: parseInt(datosComunes.clienteId),
          extintorId: parseInt(recarga.extintorId),
          fechaRecarga: datosComunes.fechaRecarga,
          fechaProximaRecarga: datosComunes.fechaProximaRecarga,
          polvoKg: parseFloat(recarga.polvoKg),
          manometros: parseInt(recarga.manometros),
          vastagos: parseInt(recarga.vastagos),
          valvulas: parseInt(recarga.valvulas),
          orings: parseInt(recarga.orings),
          mangueras: parseInt(recarga.mangueras),
          boquillas: parseInt(recarga.boquillas),
          seguros: parseInt(recarga.seguros),
          etiquetas: parseInt(recarga.etiquetas),
          precioManoObra: parseFloat(recarga.precioManoObra || 0),
          precioPolvo: parseFloat(recarga.precioPolvo || 0),
          precioManometros: parseFloat(recarga.precioManometros || 0),
          precioVastagos: parseFloat(recarga.precioVastagos || 0),
          precioValvulas: parseFloat(recarga.precioValvulas || 0),
          precioOrings: parseFloat(recarga.precioOrings || 0),
          precioMangueras: parseFloat(recarga.precioMangueras || 0),
          precioBoquillas: parseFloat(recarga.precioBoquillas || 0),
          precioSeguros: parseFloat(recarga.precioSeguros || 0),
          precioEtiquetas: parseFloat(recarga.precioEtiquetas || 0),
          precioTotal: parseFloat(recarga.precioTotal),
          observaciones: datosComunes.observaciones,
          estado: datosComunes.estado
        };

        if (!dataToSend.fechaProximaRecarga || dataToSend.fechaProximaRecarga === '') {
          delete dataToSend.fechaProximaRecarga;
        }

        return recargasAPI.create(dataToSend);
      });

      await Promise.all(promesas);
      toast.success(` ${recargasLista.length} recarga(s) registrada(s) correctamente`);
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error al guardar recargas:', error);
      toast.error('Error al guardar: ' + error.message);
    }
  };

  const handleEditarRecarga = (recarga) => {
    setEditingRecarga(recarga);
    setModoMultiple(false);
    
    const fechaRec = recarga.fechaRecarga ? recarga.fechaRecarga.split('T')[0] : '';
    const [year, month, day] = fechaRec.split('-');
    const fechaProx = year ? `${parseInt(year) + 1}-${month}-${day}` : '';
    
    setDatosComunes({
      clienteId: recarga.clienteId || recarga.cliente?.id || '',
      fechaRecarga: fechaRec,
      fechaProximaRecarga: recarga.fechaProximaRecarga ? recarga.fechaProximaRecarga.split('T')[0] : fechaProx,
      observaciones: recarga.observaciones || '',
      estado: recarga.estado || 'completada'
    });
    
    setFormData({
      extintorId: recarga.extintorId || recarga.extintor?.id || '',
      polvoKg: recarga.polvoKg || 0,
      manometros: recarga.manometros || 0,
      vastagos: recarga.vastagos || 0,
      valvulas: recarga.valvulas || 0,
      orings: recarga.orings || 0,
      mangueras: recarga.mangueras || 0,
      boquillas: recarga.boquillas || 0,
      seguros: recarga.seguros || 0,
      etiquetas: recarga.etiquetas || 0,
      precioManoObra: recarga.precioManoObra || '',
      precioPolvo: recarga.precioPolvo || '',
      precioManometros: recarga.precioManometros || '',
      precioVastagos: recarga.precioVastagos || '',
      precioValvulas: recarga.precioValvulas || '',
      precioOrings: recarga.precioOrings || '',
      precioMangueras: recarga.precioMangueras || '',
      precioBoquillas: recarga.precioBoquillas || '',
      precioSeguros: recarga.precioSeguros || '',
      precioEtiquetas: recarga.precioEtiquetas || '',
      precioTotal: recarga.precioTotal || 0
    });
    
    setShowModal(true);
  };

  const handleGuardarRecargaSimple = async (e) => {
    e.preventDefault();

    if (!datosComunes.clienteId || !formData.extintorId) {
      toast.warning('Debes seleccionar un cliente y un extintor');
      return;
    }

    try {
      const dataToSend = {
        clienteId: parseInt(datosComunes.clienteId),
        extintorId: parseInt(formData.extintorId),
        fechaRecarga: datosComunes.fechaRecarga,
        fechaProximaRecarga: datosComunes.fechaProximaRecarga,
        polvoKg: parseFloat(formData.polvoKg),
        manometros: parseInt(formData.manometros),
        vastagos: parseInt(formData.vastagos),
        valvulas: parseInt(formData.valvulas),
        orings: parseInt(formData.orings),
        mangueras: parseInt(formData.mangueras),
        boquillas: parseInt(formData.boquillas),
        seguros: parseInt(formData.seguros),
        etiquetas: parseInt(formData.etiquetas),
        precioManoObra: parseFloat(formData.precioManoObra || 0),
        precioPolvo: parseFloat(formData.precioPolvo || 0),
        precioManometros: parseFloat(formData.precioManometros || 0),
        precioVastagos: parseFloat(formData.precioVastagos || 0),
        precioValvulas: parseFloat(formData.precioValvulas || 0),
        precioOrings: parseFloat(formData.precioOrings || 0),
        precioMangueras: parseFloat(formData.precioMangueras || 0),
        precioBoquillas: parseFloat(formData.precioBoquillas || 0),
        precioSeguros: parseFloat(formData.precioSeguros || 0),
        precioEtiquetas: parseFloat(formData.precioEtiquetas || 0),
        precioTotal: parseFloat(formData.precioTotal),
        observaciones: datosComunes.observaciones,
        estado: datosComunes.estado
      };

      if (!dataToSend.fechaProximaRecarga || dataToSend.fechaProximaRecarga === '') {
        delete dataToSend.fechaProximaRecarga;
      }

      await recargasAPI.update(editingRecarga.id, dataToSend);
      toast.success('Recarga actualizada correctamente');

      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error al guardar recarga:', error);
      toast.error('Error al guardar: ' + error.message);
    }
  };

  const handleEliminarRecarga = async (id) => {
    const confirmed = await toast.confirm('¿Estás seguro de eliminar esta recarga?');
    if (!confirmed) return;

    try {
      await recargasAPI.delete(id);
      toast.success('Recarga eliminada correctamente');
      fetchData();
    } catch (error) {
      console.error('Error al eliminar recarga:', error);
      toast.error('Error al eliminar la recarga');
    }
  };

  const getClienteNombre = (recarga) => {
    if (recarga.cliente) return recarga.cliente.nombre;
    const cliente = clientes.find(c => c.id === recarga.clienteId);
    return cliente ? cliente.nombre : 'Sin cliente';
  };

  const getExtintorNumero = (recarga) => {
    if (recarga.extintor) return recarga.extintor.numeroEquipo;
    const extintor = extintores.find(e => e.id === recarga.extintorId);
    return extintor ? extintor.numeroEquipo : 'N/A';
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      completada: { text: 'Completada', color: '#10b981', bg: '#d1fae5' },
      pendiente: { text: 'Pendiente', color: '#f59e0b', bg: '#fef3c7' },
      cancelada: { text: 'Cancelada', color: '#ef4444', bg: '#fee2e2' }
    };
    return estados[estado] || estados.completada;
  };

  const recargasFiltradas = recargas.filter(recarga => {
    const matchSearch = getClienteNombre(recarga).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getExtintorNumero(recarga).toLowerCase().includes(searchTerm.toLowerCase());
    const matchCliente = !filterCliente || recarga.clienteId === parseInt(filterCliente) || recarga.cliente?.id === parseInt(filterCliente);
    const matchEstado = !filterEstado || recarga.estado === filterEstado;
    return matchSearch && matchCliente && matchEstado;
  });

  const stats = {
    total: recargasFiltradas.length,
    completadas: recargasFiltradas.filter(r => r.estado === 'completada').length,
    pendientes: recargasFiltradas.filter(r => r.estado === 'pendiente').length,
    ingresoTotal: recargasFiltradas
      .filter(r => r.estado === 'completada')
      .reduce((sum, r) => sum + Number(r.precioTotal || 0), 0)
  };

  const totalAcumulado = recargasLista.reduce((sum, r) => sum + Number(r.precioTotal || 0), 0);

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
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Gestión de Recargas</h1>
          <p style={{ fontSize: '16px', color: '#6b7280' }}>Registra y administra las recargas de extintores</p>
        </div>
        <button onClick={handleNuevaRecarga} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(239,68,68,0.4)', transition: 'all 0.3s ease' }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#dc2626'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.transform = 'translateY(0)'; }}>
          <Plus size={20} />Nueva Recarga
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { icon: RefreshCw, label: 'Total Recargas', value: stats.total, color: '#8b5cf6', bg: '#ede9fe' },
          { icon: CheckCircle, label: 'Completadas', value: stats.completadas, color: '#10b981', bg: '#d1fae5' },
          { icon: AlertTriangle, label: 'Pendientes', value: stats.pendientes, color: '#f59e0b', bg: '#fef3c7' },
          { icon: DollarSign, label: 'Ingresos Total', value: `$${stats.ingresoTotal.toFixed(2)}`, color: '#10b981', bg: '#d1fae5' }
        ].map((stat, i) => (
          <div key={i} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: stat.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={24} color={stat.color} />
              </div>
              <div>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{stat.value}</p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 200px', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={20} color="#6b7280" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Buscar por cliente o N° equipo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px', paddingLeft: '48px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', outline: 'none' }} />
          </div>
          <select value={filterCliente} onChange={(e) => setFilterCliente(e.target.value)} style={{ padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', outline: 'none' }}>
            <option value="">Todos los clientes</option>
            {clientes.map(cliente => (<option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>))}
          </select>
          <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} style={{ padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', outline: 'none' }}>
            <option value="">Todos los estados</option>
            <option value="completada">Completadas</option>
            <option value="pendiente">Pendientes</option>
            <option value="cancelada">Canceladas</option>
          </select>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        {recargasFiltradas.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
            <RefreshCw size={48} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>No hay recargas</p>
            <p style={{ fontSize: '14px' }}>{searchTerm || filterCliente || filterEstado ? 'No se encontraron resultados' : 'Comienza registrando tu primera recarga'}</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={headerStyle}>Fecha</th>
                <th style={headerStyle}>Cliente</th>
                <th style={headerStyle}>N° Equipo</th>
                <th style={headerStyle}>Próxima Recarga</th>
                <th style={headerStyle}>Precio</th>
                <th style={headerStyle}>Estado</th>
                <th style={headerStyle}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {recargasFiltradas.map((recarga) => {
                const estadoBadge = getEstadoBadge(recarga.estado);
                return (
                  <tr key={recarga.id} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background-color 0.2s ease' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                    <td style={cellStyle}>{new Date(recarga.fechaRecarga).toLocaleDateString('es-AR')}</td>
                    <td style={cellStyle}>{getClienteNombre(recarga)}</td>
                    <td style={cellStyle}>{getExtintorNumero(recarga)}</td>
                    <td style={cellStyle}>
                      {recarga.fechaProximaRecarga ? (
                        <span>{new Date(recarga.fechaProximaRecarga).toLocaleDateString('es-AR')}</span>
                      ) : (<span style={{ color: '#9ca3af' }}>Sin fecha</span>)}
                    </td>
                    <td style={cellStyle}><span style={{ fontWeight: 'bold', color: '#10b981' }}>${Number(recarga.precioTotal || 0).toFixed(2)}</span></td>
                    <td style={cellStyle}>
                      <span style={{ padding: '4px 12px', backgroundColor: estadoBadge.bg, color: estadoBadge.color, borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>
                        {estadoBadge.text}
                      </span>
                    </td>
                    <td style={cellStyle}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEditarRecarga(recarga)} style={{ padding: '8px', backgroundColor: '#dbeafe', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="Editar">
                          <Edit2 size={16} color="#3b82f6" />
                        </button>
                        <button onClick={() => handleEliminarRecarga(recarga.id)} style={{ padding: '8px', backgroundColor: '#fee2e2', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="Eliminar">
                          <Trash2 size={16} color="#ef4444" />
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

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: modoMultiple ? '1200px' : '900px', maxHeight: '90vh', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' }}>
            
            {/* Header */}
            <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ef4444', color: 'white', flexShrink: 0 }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>
                  {editingRecarga ? 'Editar Recarga' : 'Nueva Recarga'}
                  {modoMultiple && recargasLista.length > 0 && ` (${recargasLista.length} extintor${recargasLista.length !== 1 ? 'es' : ''})`}
                </h2>
                <p style={{ fontSize: '14px', margin: '4px 0 0 0', opacity: 0.9 }}>
                  {modoMultiple ? 'Agrega múltiples extintores para el mismo cliente' : 'Registra el servicio de recarga realizado'}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px', cursor: 'pointer', color: 'white' }}>
                <X size={24} />
              </button>
            </div>

            {/* Contenido con scroll */}
            <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
              {modoMultiple ? (
                // ⭐ MODO MÚLTIPLE: Layout de 2 columnas
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', minHeight: '100%' }}>
                  
                  {/* Columna izquierda: Formulario */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Datos comunes */}
                    <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '2px solid #86efac' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ListChecks size={18} color="#10b981" />
                        Datos Comunes (se aplican a todos los extintores)
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={labelStyle}>Cliente *</label>
                          <select required value={datosComunes.clienteId} onChange={(e) => setDatosComunes({ ...datosComunes, clienteId: e.target.value })} style={inputStyle}>
                            <option value="">Seleccionar cliente...</option>
                            {clientes.map(cliente => (<option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>))}
                          </select>
                        </div>
                        <div>
                          <label style={labelStyle}>Fecha de Recarga *</label>
                          <input 
                            type="date" 
                            required 
                            value={datosComunes.fechaRecarga} 
                            onChange={(e) => {
                              const fechaRecarga = e.target.value;
                              const [year, month, day] = fechaRecarga.split('-');
                              const fechaProxima = `${parseInt(year) + 1}-${month}-${day}`;
                              setDatosComunes({ 
                                ...datosComunes, 
                                fechaRecarga: fechaRecarga,
                                fechaProximaRecarga: fechaProxima
                              });
                            }} 
                            style={inputStyle} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Formulario extintor */}
                    <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '2px dashed #fbbf24' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
                        ➕ Agregar Extintor
                      </h4>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <label style={labelStyle}>Extintor *</label>
                          <select value={formData.extintorId} onChange={(e) => setFormData({ ...formData, extintorId: e.target.value })} style={inputStyle} disabled={!datosComunes.clienteId}>
                            <option value="">Seleccionar extintor...</option>
                            {extintoresDelCliente.map(extintor => (
                              <option key={extintor.id} value={extintor.id}>{extintor.numeroEquipo} - {extintor.tipo} {extintor.capacidad}kg</option>
                            ))}
                          </select>
                          {!datosComunes.clienteId && (<p style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Primero selecciona un cliente</p>)}
                          {datosComunes.clienteId && extintoresDelCliente.length === 0 && (<p style={{ fontSize: '11px', color: '#f59e0b', marginTop: '4px' }}>No quedan extintores disponibles</p>)}
                        </div>

                        {/* Mano de Obra */}
                        <div style={{ padding: '12px', backgroundColor: '#dbeafe', borderRadius: '6px' }}>
                          <label style={{ ...labelStyle, marginBottom: '6px', fontSize: '13px' }}> Precio de Recarga ($) *</label>
                          <input type="number" step="0.01" min="0" value={formData.precioManoObra} 
                            onChange={(e) => setFormData({ ...formData, precioManoObra: e.target.value })} 
                            style={inputStyle} placeholder="Ingrese el precio" />
                        </div>

                        {/* Repuestos */}
                        <div>
                          <label style={{ ...labelStyle, marginBottom: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Package size={16} />
                            Repuestos Utilizados
                          </label>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {[
                              { label: 'Polvo (kg)', cantKey: 'polvoKg', precioKey: 'precioPolvo', step: '0.01' },
                              { label: 'Manómetros', cantKey: 'manometros', precioKey: 'precioManometros' },
                              { label: 'Vástagos', cantKey: 'vastagos', precioKey: 'precioVastagos' },
                              { label: 'Válvulas', cantKey: 'valvulas', precioKey: 'precioValvulas' },
                              { label: 'O-Rings', cantKey: 'orings', precioKey: 'precioOrings' },
                              { label: 'Mangueras', cantKey: 'mangueras', precioKey: 'precioMangueras' },
                              { label: 'Boquillas', cantKey: 'boquillas', precioKey: 'precioBoquillas' },
                              { label: 'Seguros', cantKey: 'seguros', precioKey: 'precioSeguros' },
                              { label: 'Etiquetas', cantKey: 'etiquetas', precioKey: 'precioEtiquetas' }
                            ].map((item, i) => (
                              <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 1fr', gap: '8px', alignItems: 'center', fontSize: '13px' }}>
                                <span style={{ fontWeight: 'bold', color: '#374151' }}>{item.label}</span>
                                <input type="number" step={item.step || '1'} min="0" value={formData[item.cantKey]} 
                                  onChange={(e) => setFormData({ ...formData, [item.cantKey]: e.target.value })} 
                                  style={{ ...inputStyle, padding: '8px', fontSize: '13px' }} placeholder="Cant" />
                                <input type="number" step="0.01" min="0" value={formData[item.precioKey]} 
                                  onChange={(e) => setFormData({ ...formData, [item.precioKey]: e.target.value })} 
                                  style={{ ...inputStyle, padding: '8px', fontSize: '13px' }} placeholder="Precio ($)" />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Total */}
                        <div style={{ padding: '12px', backgroundColor: '#d1fae5', borderRadius: '6px', textAlign: 'center' }}>
                          <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Total Extintor</p>
                          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>${Number(formData.precioTotal).toFixed(2)}</p>
                        </div>

                        {/* Botón agregar */}
                        <button 
                          type="button"
                          onClick={handleAgregarExtintorALista}
                          disabled={!formData.extintorId}
                          style={{ 
                            padding: '12px', 
                            backgroundColor: formData.extintorId ? '#10b981' : '#d1d5db', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '8px', 
                            fontSize: '15px', 
                            fontWeight: 'bold', 
                            cursor: formData.extintorId ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                          }}
                        >
                          <PlusCircle size={18} />
                          Agregar a la Lista
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Columna derecha: Lista */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: 'fit-content', position: 'sticky', top: 0 }}>
                    <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '2px solid #e5e7eb' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
                       Extintores Agregados ({recargasLista.length})
                      </h4>
                      <p style={{ fontSize: '11px', color: '#6b7280' }}>Se guardarán todas juntas</p>
                    </div>

                    {recargasLista.length === 0 ? (
                      <div style={{ padding: '32px', textAlign: 'center', color: '#9ca3af', border: '2px dashed #d1d5db', borderRadius: '8px' }}>
                        <Package size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                        <p style={{ fontSize: '13px' }}>Aún no hay extintores</p>
                        <p style={{ fontSize: '11px' }}>Agrega uno usando el formulario</p>
                      </div>
                    ) : (
                      <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflow: 'auto', paddingRight: '4px' }}>
                          {recargasLista.map((rec, index) => (
                            <div key={index} style={{ padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac', position: 'relative' }}>
                              <button
                                onClick={() => handleEliminarDeLista(index)}
                                style={{ position: 'absolute', top: '8px', right: '8px', padding: '4px', backgroundColor: '#fee2e2', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                title="Eliminar"
                              >
                                <MinusCircle size={14} color="#ef4444" />
                              </button>
                              
                              <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
                                {rec.extintorNumero} - {rec.extintorTipo}
                              </p>
                              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}>
                                ${Number(rec.precioTotal).toFixed(2)}
                              </p>
                              <p style={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.4' }}>
                                {rec.polvoKg > 0 && `Polvo: ${rec.polvoKg}kg `}
                                {rec.manometros > 0 && `Manóm: ${rec.manometros} `}
                                {rec.valvulas > 0 && `Válv: ${rec.valvulas} `}
                                {rec.orings > 0 && `O-rings: ${rec.orings} `}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Total acumulado */}
                        <div style={{ padding: '16px', backgroundColor: '#10b981', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
                          <p style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}> TOTAL ACUMULADO</p>
                          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>${totalAcumulado.toFixed(2)}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                // ⭐ MODO SIMPLE: Editar una sola recarga
                <form onSubmit={handleGuardarRecargaSimple}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={labelStyle}>Cliente *</label>
                        <select required value={datosComunes.clienteId} onChange={(e) => setDatosComunes({ ...datosComunes, clienteId: e.target.value })} style={inputStyle}>
                          <option value="">Seleccionar cliente...</option>
                          {clientes.map(cliente => (<option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>))}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Extintor *</label>
                        <select required value={formData.extintorId} onChange={(e) => setFormData({ ...formData, extintorId: e.target.value })} style={inputStyle} disabled={!datosComunes.clienteId}>
                          <option value="">Seleccionar extintor...</option>
                          {extintoresDelCliente.map(extintor => (
                            <option key={extintor.id} value={extintor.id}>{extintor.numeroEquipo} - {extintor.tipo} {extintor.capacidad}kg</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={labelStyle}>Fecha de Recarga *</label>
                        <input 
                          type="date" 
                          required 
                          value={datosComunes.fechaRecarga} 
                          onChange={(e) => {
                            const fechaRecarga = e.target.value;
                            const [year, month, day] = fechaRecarga.split('-');
                            const fechaProxima = `${parseInt(year) + 1}-${month}-${day}`;
                            setDatosComunes({ 
                              ...datosComunes, 
                              fechaRecarga: fechaRecarga,
                              fechaProximaRecarga: fechaProxima
                            });
                          }} 
                          style={inputStyle} 
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Próxima Recarga</label>
                        <input type="date" value={datosComunes.fechaProximaRecarga || ''} style={{ ...inputStyle, backgroundColor: '#f3f4f6', color: '#111827' }} disabled />
                        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Se calcula automáticamente (+1 año)</p>
                      </div>
                    </div>

                    <div style={{ padding: '16px', backgroundColor: '#dbeafe', borderRadius: '8px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <DollarSign size={20} />
                        Mano de Obra
                      </h4>
                      <div>
                        <label style={labelStyle}>Precio de Recarga ($) *</label>
                        <input type="number" step="0.01" min="0" required value={formData.precioManoObra} 
                          onChange={(e) => setFormData({ ...formData, precioManoObra: e.target.value })} 
                          style={inputStyle} placeholder="Ingrese el precio" />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <Package size={20} color="#ef4444" />
                        <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>Repuestos Utilizados</h4>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                          { label: 'Polvo (kg)', cantKey: 'polvoKg', precioKey: 'precioPolvo', step: '0.01' },
                          { label: 'Manómetros', cantKey: 'manometros', precioKey: 'precioManometros' },
                          { label: 'Vástagos', cantKey: 'vastagos', precioKey: 'precioVastagos' },
                          { label: 'Válvulas', cantKey: 'valvulas', precioKey: 'precioValvulas' },
                          { label: 'O-Rings', cantKey: 'orings', precioKey: 'precioOrings' },
                          { label: 'Mangueras', cantKey: 'mangueras', precioKey: 'precioMangueras' },
                          { label: 'Boquillas', cantKey: 'boquillas', precioKey: 'precioBoquillas' },
                          { label: 'Seguros', cantKey: 'seguros', precioKey: 'precioSeguros' },
                          { label: 'Etiquetas', cantKey: 'etiquetas', precioKey: 'precioEtiquetas' }
                        ].map((item, i) => (
                          <div key={i} style={{ display: 'grid', gridTemplateColumns: '200px 1fr 1fr', gap: '12px', alignItems: 'end' }}>
                            <label style={{ ...labelStyle, marginBottom: 0 }}>{item.label}</label>
                            <input type="number" step={item.step || '1'} min="0" value={formData[item.cantKey]} 
                              onChange={(e) => setFormData({ ...formData, [item.cantKey]: e.target.value })} 
                              style={inputStyle} placeholder="Cantidad" />
                            <input type="number" step="0.01" min="0" value={formData[item.precioKey]} 
                              onChange={(e) => setFormData({ ...formData, [item.precioKey]: e.target.value })} 
                              style={inputStyle} placeholder="Precio ($)" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ padding: '20px', backgroundColor: '#d1fae5', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Precio Total</p>
                          <p style={{ fontSize: '12px', color: '#6b7280' }}>
                            Mano de Obra (${Number(formData.precioManoObra || 0).toFixed(2)}) + 
                            Repuestos (${(
                              Number(formData.precioPolvo || 0) +
                              Number(formData.precioManometros || 0) +
                              Number(formData.precioVastagos || 0) +
                              Number(formData.precioValvulas || 0) +
                              Number(formData.precioOrings || 0) +
                              Number(formData.precioMangueras || 0) +
                              Number(formData.precioBoquillas || 0) +
                              Number(formData.precioSeguros || 0) +
                              Number(formData.precioEtiquetas || 0)
                            ).toFixed(2)})
                          </p>
                        </div>
                        <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981' }}>
                          ${Number(formData.precioTotal).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px' }}>
                      <div>
                        <label style={labelStyle}>Estado *</label>
                        <select required value={datosComunes.estado} onChange={(e) => setDatosComunes({ ...datosComunes, estado: e.target.value })} style={inputStyle}>
                          <option value="completada">Completada</option>
                          <option value="pendiente">Pendiente</option>
                          <option value="cancelada">Cancelada</option>
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Observaciones</label>
                        <textarea value={datosComunes.observaciones} onChange={(e) => setDatosComunes({ ...datosComunes, observaciones: e.target.value })}
                          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Notas adicionales sobre el servicio..." />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '2px solid #e5e7eb' }}>
                      <button type="button" onClick={() => setShowModal(false)} style={{ padding: '12px 24px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', color: '#6b7280' }}>
                        Cancelar
                      </button>
                      <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#ef4444', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', color: 'white', boxShadow: '0 4px 12px rgba(239,68,68,0.4)' }}>
                        Actualizar Recarga
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Footer con botones (solo en modo múltiple) */}
            {modoMultiple && (
              <div style={{ padding: '20px', borderTop: '2px solid #e5e7eb', backgroundColor: '#f9fafb', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '13px', color: '#6b7280' }}>
                      {recargasLista.length === 0 ? 'Agrega al menos un extintor para continuar' : `${recargasLista.length} extintor${recargasLista.length !== 1 ? 'es' : ''} listo${recargasLista.length !== 1 ? 's' : ''} para guardar`}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="button" onClick={() => setShowModal(false)} style={{ padding: '12px 24px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', color: '#6b7280' }}>
                      Cancelar
                    </button>
                    <button 
                      type="button" 
                      onClick={handleGuardarTodasLasRecargas}
                      disabled={recargasLista.length === 0}
                      style={{ 
                        padding: '12px 24px', 
                        backgroundColor: recargasLista.length > 0 ? '#10b981' : '#d1d5db', 
                        border: 'none', 
                        borderRadius: '8px', 
                        fontSize: '16px', 
                        fontWeight: 'bold', 
                        cursor: recargasLista.length > 0 ? 'pointer' : 'not-allowed', 
                        color: 'white', 
                        boxShadow: recargasLista.length > 0 ? '0 4px 12px rgba(16,185,129,0.4)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <CheckCircle size={18} />
                      Guardar Todas las Recargas ({recargasLista.length})
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const headerStyle = { padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' };
const cellStyle = { padding: '16px', fontSize: '14px' };
const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#374151' };
const inputStyle = { width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', outline: 'none', transition: 'border-color 0.3s ease' };

export default RecargasPage;
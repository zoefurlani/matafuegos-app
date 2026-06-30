import { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  X,
  Flame,
  TrendingUp
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';

const recursosEducativosAPI = api.recursosEducativosAPI;

function RecursosEducativosPage() {
  const toast = useToast();
  const { user } = useAuth();
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRecurso, setEditingRecurso] = useState(null);
  const [stats, setStats] = useState(null);

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'tipo_fuego',
    tipoFuego: '',
    tipoExtintor: '',
    capacidad: '',
    aplicacion: '',
    contenidoDetallado: '',
    orden: 0,
    estado: 'activo',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recursosData] = await Promise.all([
        recursosEducativosAPI.getAll(),
        recursosEducativosAPI.getStats(),
      ]);
      setRecursos(recursosData);
      setStats({ total: recursosData.length });
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titulo || !formData.descripcion || !formData.contenidoDetallado) {
      toast.warning('Completa los campos obligatorios');
      return;
    }

    try {
      if (editingRecurso) {
        await recursosEducativosAPI.update(editingRecurso.id, formData);
        toast.success('Recurso actualizado correctamente');
      } else {
        await recursosEducativosAPI.create(formData);
        toast.success('Recurso creado correctamente');
      }
      
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error al guardar recurso:', error);
      toast.error(error.message || 'Error al guardar el recurso');
    }
  };

  const handleEdit = (recurso) => {
    setEditingRecurso(recurso);
    setFormData({
      titulo: recurso.titulo,
      descripcion: recurso.descripcion,
      categoria: recurso.categoria,
      tipoFuego: recurso.tipoFuego || '',
      tipoExtintor: recurso.tipoExtintor || '',
      capacidad: recurso.capacidad || '',
      aplicacion: recurso.aplicacion || '',
      contenidoDetallado: recurso.contenidoDetallado,
      orden: recurso.orden,
      estado: recurso.estado,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await toast.confirm('¿Estás seguro de eliminar este recurso?');
    if (!confirmed) return;

    try {
      await recursosEducativosAPI.delete(id);
      toast.success('Recurso eliminado correctamente');
      fetchData();
    } catch (error) {
      console.error('Error al eliminar recurso:', error);
      toast.error(error.message || 'Error al eliminar el recurso');
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      categoria: 'tipo_fuego',
      tipoFuego: '',
      tipoExtintor: '',
      capacidad: '',
      aplicacion: '',
      contenidoDetallado: '',
      orden: 0,
      estado: 'activo',
    });
    setEditingRecurso(null);
  };

  const recursosFiltrados = recursos.filter(recurso => {
    const matchSearch =
      recurso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recurso.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = !filtroCategoria || recurso.categoria === filtroCategoria;
    return matchSearch && matchCategoria;
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
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Recursos Educativos</h1>
          <p style={{ fontSize: '16px', color: '#6b7280' }}>Gestiona el contenido educativo del sitio público</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s ease' }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#dc2626'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <Plus size={20} />
          Nuevo Recurso
        </button>
      </div>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#dbeafe', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={24} color="#2563eb" />
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Total Recursos</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{stats.total}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={20} color="#6b7280" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Buscar recursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px', paddingLeft: '48px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', outline: 'none' }}
            />
          </div>
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            style={{ padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', outline: 'none', minWidth: '200px' }}
          >
            <option value="">Todas las categorías</option>
            <option value="tipo_fuego">Tipos de Fuego</option>
            <option value="tipo_extintor">Tipos de Extintor</option>
            <option value="normativa">Normativas</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="uso">Uso y Aplicaciones</option>
          </select>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        {recursosFiltrados.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
            <BookOpen size={48} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>No hay recursos</p>
            <p style={{ fontSize: '14px' }}>{searchTerm || filtroCategoria ? 'No se encontraron resultados' : 'Comienza creando tu primer recurso educativo'}</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={headerStyle}>Título</th>
                <th style={headerStyle}>Categoría</th>
                <th style={headerStyle}>Tipo</th>
                <th style={headerStyle}>Estado</th>
                <th style={headerStyle}>Orden</th>
                <th style={headerStyle}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {recursosFiltrados.map((recurso) => (
                <tr key={recurso.id} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background-color 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                  <td style={cellStyle}>
                    <div>
                      <p style={{ fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>{recurso.titulo}</p>
                      <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{recurso.descripcion.substring(0, 80)}...</p>
                    </div>
                  </td>
                  <td style={cellStyle}>
                    <span style={{ padding: '4px 12px', backgroundColor: getCategoriaColor(recurso.categoria).bg, color: getCategoriaColor(recurso.categoria).text, borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>
                      {getCategoriaLabel(recurso.categoria)}
                    </span>
                  </td>
                  <td style={cellStyle}>
                    <span style={{ fontSize: '13px', color: '#374151' }}>
                      {recurso.tipoFuego || recurso.tipoExtintor || '-'}
                    </span>
                  </td>
                  <td style={cellStyle}>
                    {recurso.estado === 'activo' ? (
                      <span style={{ padding: '4px 12px', backgroundColor: '#d1fae5', color: '#059669', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>
                        Activo
                      </span>
                    ) : (
                      <span style={{ padding: '4px 12px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td style={cellStyle}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>{recurso.orden}</span>
                  </td>
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEdit(recurso)}
                        style={{ padding: '8px', backgroundColor: '#dbeafe', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        title="Editar"
                      >
                        <Edit2 size={16} color="#2563eb" />
                      </button>
                      {user?.rol === 'super_admin' && (
                        <button
                          onClick={() => handleDelete(recurso.id)}
                          style={{ padding: '8px', backgroundColor: '#fee2e2', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                          title="Eliminar"
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
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '900px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ef4444', color: 'white', borderRadius: '16px 16px 0 0', flexShrink: 0 }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                  {editingRecurso ? 'Editar Recurso' : 'Nuevo Recurso'}
                </h2>
                <p style={{ fontSize: '14px', margin: '4px 0 0 0', opacity: 0.9 }}>
                  {editingRecurso ? 'Actualiza la información del recurso' : 'Crea un nuevo recurso educativo'}
                </p>
              </div>
              <button onClick={() => { setShowModal(false); resetForm(); }} style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px', cursor: 'pointer', color: 'white' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={labelStyle}>Título *</label>
                    <input
                      type="text"
                      required
                      value={formData.titulo}
                      onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                      style={inputStyle}
                      placeholder="Ej: Fuego Clase A"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Categoría *</label>
                    <select
                      required
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="tipo_fuego">Tipos de Fuego</option>
                      <option value="tipo_extintor">Tipos de Extintor</option>
                      <option value="normativa">Normativas</option>
                      <option value="mantenimiento">Mantenimiento</option>
                      <option value="uso">Uso y Aplicaciones</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Descripción Corta *</label>
                  <textarea
                    required
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                    placeholder="Breve descripción (1-2 líneas)"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={labelStyle}>Tipo de Fuego</label>
                    <input
                      type="text"
                      value={formData.tipoFuego}
                      onChange={(e) => setFormData({ ...formData, tipoFuego: e.target.value })}
                      style={inputStyle}
                      placeholder="A, B, C, D, K"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Tipo de Extintor</label>
                    <input
                      type="text"
                      value={formData.tipoExtintor}
                      onChange={(e) => setFormData({ ...formData, tipoExtintor: e.target.value })}
                      style={inputStyle}
                      placeholder="ABC, CO2, HCFC"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Capacidad</label>
                    <input
                      type="text"
                      value={formData.capacidad}
                      onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })}
                      style={inputStyle}
                      placeholder="5kg, 10kg"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Aplicación</label>
                  <input
                    type="text"
                    value={formData.aplicacion}
                    onChange={(e) => setFormData({ ...formData, aplicacion: e.target.value })}
                    style={inputStyle}
                    placeholder="Hogar, Comercio, Industria"
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Contenido Detallado *</label>
                  <textarea
                    required
                    value={formData.contenidoDetallado}
                    onChange={(e) => setFormData({ ...formData, contenidoDetallado: e.target.value })}
                    style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                    placeholder="Descripción completa del recurso educativo..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Orden</label>
                    <input
                      type="number"
                      value={formData.orden}
                      onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) || 0 })}
                      style={inputStyle}
                      min="0"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Estado</label>
                    <select
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ padding: '24px', borderTop: '2px solid #e5e7eb', flexShrink: 0, display: 'flex', gap: '12px', justifyContent: 'flex-end', backgroundColor: 'white', borderRadius: '0 0 16px 16px' }}>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  style={{ padding: '12px 24px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ padding: '12px 24px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {editingRecurso ? 'Actualizar' : 'Crear'} Recurso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const getCategoriaLabel = (categoria) => {
  const labels = {
    tipo_fuego: 'Tipo de Fuego',
    tipo_extintor: 'Tipo Extintor',
    normativa: 'Normativa',
    mantenimiento: 'Mantenimiento',
    uso: 'Uso/Aplicación',
  };
  return labels[categoria] || categoria;
};

const getCategoriaColor = (categoria) => {
  const colors = {
    tipo_fuego: { bg: '#fee2e2', text: '#dc2626' },
    tipo_extintor: { bg: '#dbeafe', text: '#2563eb' },
    normativa: { bg: '#fef3c7', text: '#f59e0b' },
    mantenimiento: { bg: '#d1fae5', text: '#059669' },
    uso: { bg: '#e0e7ff', text: '#6366f1' },
  };
  return colors[categoria] || { bg: '#f3f4f6', text: '#6b7280' };
};

const headerStyle = { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' };
const cellStyle = { padding: '12px 16px', fontSize: '14px' };
const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#374151' };
const inputStyle = { width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s ease' };

export default RecursosEducativosPage;
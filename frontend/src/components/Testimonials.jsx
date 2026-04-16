import { useState, useEffect } from 'react';
import { Star, Quote, Send, Trash2, Filter, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/testimonios';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterRating, setFilterRating] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);
  const [deleteEmail, setDeleteEmail] = useState('');
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    text: '',
    rating: 5,
    userEmail: ''
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  useEffect(() => {
    if (filterRating === 0) {
      setFilteredTestimonials(testimonials);
    } else {
      setFilteredTestimonials(testimonials.filter(t => t.rating === filterRating));
    }
  }, [filterRating, testimonials]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const loadTestimonials = async () => {
    try {
      const response = await axios.get(`${API_URL}/public`);
      setTestimonials(response.data);
    } catch (error) {
      console.error('Error al cargar testimonios:', error);
      showToast('Error al cargar testimonios', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.text || !formData.userEmail) {
      showToast('Por favor completa todos los campos obligatorios', 'error');
      return;
    }

    setLoading(true);

    try {
      await axios.post(API_URL, formData);
      
      await loadTestimonials();
      setFormData({ name: '', company: '', text: '', rating: 5, userEmail: '' });
      setShowForm(false);
      showToast('¡Gracias por tu comentario!', 'success');
    } catch (error) {
      console.error('Error al guardar:', error);
      showToast('Error al guardar tu comentario', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (testimonial) => {
    setTestimonialToDelete(testimonial);
    setDeleteEmail('');
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setTestimonialToDelete(null);
    setDeleteEmail('');
  };

  const confirmDelete = async () => {
    if (!deleteEmail) {
      showToast('Por favor ingresa tu email', 'error');
      return;
    }

    try {
      await axios.delete(`${API_URL}/own/${testimonialToDelete.id}`, {
        data: { userEmail: deleteEmail }
      });

      await loadTestimonials();
      closeDeleteModal();
      showToast('Comentario eliminado correctamente', 'success');
    } catch (error) {
      console.error('Error al eliminar:', error);
      if (error.response?.status === 403) {
        showToast('Email incorrecto. No se puede eliminar el comentario', 'error');
      } else {
        showToast('Error al eliminar el comentario', 'error');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ marginBottom: '64px' }}>
      {/* Toast */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 9999,
          animation: 'slideInRight 0.3s ease-out'
        }}>
          {toast.message}
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9998,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            backgroundColor: colors.cardBg,
            padding: '32px',
            borderRadius: '16px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            border: `2px solid ${colors.border}`,
            animation: 'scaleIn 0.3s ease-out'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: colors.text,
                margin: 0
              }}>
                Confirmar eliminación
              </h3>
              <button
                onClick={closeDeleteModal}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: colors.textSecondary
                }}
              >
                <X size={24} />
              </button>
            </div>

            <p style={{
              color: colors.textSecondary,
              marginBottom: '24px',
              lineHeight: '1.6'
            }}>
              Para eliminar tu comentario, por favor ingresá el email que usaste al crearlo:
            </p>

            <input
              type="email"
              value={deleteEmail}
              onChange={(e) => setDeleteEmail(e.target.value)}
              placeholder="tu@email.com"
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${colors.border}`,
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: colors.background,
                color: colors.text,
                marginBottom: '24px'
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') confirmDelete();
              }}
            />

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={closeDeleteModal}
                style={{
                  padding: '12px 24px',
                  backgroundColor: colors.cardBg,
                  color: colors.text,
                  border: `2px solid ${colors.border}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <h2 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: colors.text,
          margin: 0
        }}>
          Lo que dicen nuestros clientes
        </h2>
        
        <button
          onClick={() => setShowForm(!showForm)}
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
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
        >
          <Send size={20} />
          {showForm ? 'Cancelar' : 'Dejar Comentario'}
        </button>
      </div>

      {/* Filtro */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '32px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={20} color={colors.text} />
          <span style={{ color: colors.text, fontWeight: 'bold' }}>Filtrar:</span>
        </div>
        <button
          onClick={() => setFilterRating(0)}
          style={{
            padding: '8px 16px',
            backgroundColor: filterRating === 0 ? '#ef4444' : colors.cardBg,
            color: filterRating === 0 ? 'white' : colors.text,
            border: `2px solid ${filterRating === 0 ? '#ef4444' : colors.border}`,
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Todos
        </button>
        {[5, 4, 3, 2, 1].map((rating) => (
          <button
            key={rating}
            onClick={() => setFilterRating(rating)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 16px',
              backgroundColor: filterRating === rating ? '#ef4444' : colors.cardBg,
              color: filterRating === rating ? 'white' : colors.text,
              border: `2px solid ${filterRating === rating ? '#ef4444' : colors.border}`,
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            <Star size={16} fill={filterRating === rating ? 'white' : '#fbbf24'} color="#fbbf24" />
            {rating}
          </button>
        ))}
      </div>

      {/* Formulario */}
      {showForm && (
        <div style={{
          backgroundColor: colors.cardBg,
          padding: '32px',
          borderRadius: '12px',
          boxShadow: colors.shadow,
          border: `2px solid ${colors.border}`,
          marginBottom: '32px',
          animation: 'slideDown 0.3s ease-out'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '24px',
            color: colors.text
          }}>
            Dejanos tu opinión
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: colors.text
              }}>
                Nombre *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="Tu nombre"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid ' + colors.border,
                  borderRadius: '8px',
                  fontSize: '16px',
                  backgroundColor: colors.background,
                  color: colors.text
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: colors.text
              }}>
                Email * (para poder borrar tu comentario después)
              </label>
              <input
                type="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleChange}
                required
                placeholder="tu@email.com"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid ' + colors.border,
                  borderRadius: '8px',
                  fontSize: '16px',
                  backgroundColor: colors.background,
                  color: colors.text
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: colors.text
              }}>
                Empresa (opcional)
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                maxLength={100}
                placeholder="Nombre de tu empresa"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid ' + colors.border,
                  borderRadius: '8px',
                  fontSize: '16px',
                  backgroundColor: colors.background,
                  color: colors.text
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: colors.text
              }}>
                Tu comentario *
              </label>
              <textarea
                name="text"
                value={formData.text}
                onChange={handleChange}
                required
                maxLength={1000}
                rows={4}
                placeholder="Cuéntanos tu experiencia..."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid ' + colors.border,
                  borderRadius: '8px',
                  fontSize: '16px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  backgroundColor: colors.background,
                  color: colors.text
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: colors.text
              }}>
                Calificación *
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <Star
                      size={32}
                      fill={star <= formData.rating ? '#fbbf24' : 'none'}
                      color={star <= formData.rating ? '#fbbf24' : '#d1d5db'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                backgroundColor: loading ? '#9ca3af' : '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <Send size={20} />
              {loading ? 'Enviando...' : 'Enviar Comentario'}
            </button>
          </form>
        </div>
      )}

      {/* Lista */}
      {filteredTestimonials.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '64px 32px',
          backgroundColor: colors.cardBg,
          borderRadius: '12px',
          border: `2px solid ${colors.border}`,
          color: colors.textSecondary
        }}>
          <p style={{ fontSize: '18px' }}>
            {filterRating === 0 
              ? 'Todavía no hay comentarios. ¡Sé el primero en dejar uno!'
              : `No hay comentarios con ${filterRating} estrellas`
            }
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              style={{
                backgroundColor: colors.cardBg,
                padding: '32px',
                borderRadius: '12px',
                boxShadow: colors.shadow,
                border: `2px solid ${colors.border}`,
                position: 'relative'
              }}
            >
              <Quote size={40} color="#ef4444" style={{ position: 'absolute', top: '16px', right: '16px', opacity: 0.2 }} />
              
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} fill="#fbbf24" color="#fbbf24" />
                ))}
              </div>
              
              <p style={{ fontSize: '16px', lineHeight: '1.6', color: colors.text, marginBottom: '16px', fontStyle: 'italic' }}>
                "{testimonial.text}"
              </p>
              
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontWeight: 'bold', color: colors.text }}>{testimonial.name}</p>
                {testimonial.company && <p style={{ fontSize: '14px', color: colors.textSecondary }}>{testimonial.company}</p>}
                <p style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '4px' }}>
                  {new Date(testimonial.createdAt).toLocaleDateString('es-AR')}
                </p>
              </div>

              <button
                onClick={() => openDeleteModal(testimonial)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  backgroundColor: 'transparent',
                  color: '#ef4444',
                  border: `2px solid #ef4444`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef4444';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#ef4444';
                }}
              >
                <Trash2 size={16} />
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Testimonials;
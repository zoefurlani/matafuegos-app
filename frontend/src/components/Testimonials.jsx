import { useState, useEffect } from 'react';
import { Star, Quote, Send } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTheme } from '../contexts/ThemeContext';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    text: '',
    rating: 5
  });

  // Detectar si estamos usando window.storage o localStorage
  const isClaudeStorage = typeof window !== 'undefined' && window.storage;

  // Cargar testimonios al iniciar
  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      if (isClaudeStorage) {
        // Usar window.storage (Claude Artifacts)
        const result = await window.storage.list('testimonial:');
        if (result && result.keys && result.keys.length > 0) {
          const testimonialPromises = result.keys.map(async (key) => {
            try {
              const data = await window.storage.get(key);
              if (data && data.value) {
                return JSON.parse(data.value);
              }
            } catch (error) {
              console.error('Error al cargar testimonio:', key, error);
            }
            return null;
          });
          
          const loadedTestimonials = await Promise.all(testimonialPromises);
          const validTestimonials = loadedTestimonials.filter(t => t !== null);
          validTestimonials.sort((a, b) => b.id - a.id);
          setTestimonials(validTestimonials);
        }
      } else {
        // Usar localStorage (desarrollo local)
        const stored = localStorage.getItem('testimonials');
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.sort((a, b) => b.id - a.id);
          setTestimonials(parsed);
        }
      }
    } catch (error) {
      console.log('Error al cargar testimonios:', error);
      setTestimonials([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.text) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);

    try {
      const newTestimonial = {
        ...formData,
        id: Date.now(),
        date: new Date().toLocaleDateString('es-AR')
      };

      if (isClaudeStorage) {
        // Guardar en window.storage (Claude Artifacts)
        await window.storage.set(
          `testimonial:${newTestimonial.id}`,
          JSON.stringify(newTestimonial),
          true
        );
      } else {
        // Guardar en localStorage (desarrollo local)
        const currentTestimonials = [...testimonials, newTestimonial];
        localStorage.setItem('testimonials', JSON.stringify(currentTestimonials));
      }

      // Actualizar lista local
      setTestimonials([newTestimonial, ...testimonials]);

      // Resetear formulario
      setFormData({
        name: '',
        company: '',
        text: '',
        rating: 5
      });
      setShowForm(false);

      alert('¡Gracias por tu comentario! 🎉');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('❌ Error al guardar tu comentario. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div style={{ marginBottom: '64px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '48px',
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

      {/* Formulario para nuevo comentario */}
      {showForm && (
        <div style={{
          backgroundColor: colors.cardBg,
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
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
                placeholder="Tu nombre"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid ' + colors.border,
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.3s ease',
                  backgroundColor: colors.background,
                  color: colors.text
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#ef4444'}
                onBlur={(e) => e.currentTarget.style.borderColor = colors.border}
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
                placeholder="Nombre de tu empresa"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid ' + colors.border,
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.3s ease',
                  backgroundColor: colors.background,
                  color: colors.text
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#ef4444'}
                onBlur={(e) => e.currentTarget.style.borderColor = colors.border}
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
                  transition: 'border-color 0.3s ease',
                  backgroundColor: colors.background,
                  color: colors.text
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#ef4444'}
                onBlur={(e) => e.currentTarget.style.borderColor = colors.border}
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
                      padding: 0,
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
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
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#dc2626';
              }}
              onMouseOut={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#ef4444';
              }}
            >
              <Send size={20} />
              {loading ? 'Enviando...' : 'Enviar Comentario'}
            </button>
          </form>
        </div>
      )}

      {/* Lista de testimonios */}
      {testimonials.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '64px 32px',
          backgroundColor: colors.cardBg,
          borderRadius: '12px',
          color: colors.textSecondary
        }}>
          <p style={{ fontSize: '18px' }}>
            Todavía no hay comentarios. ¡Sé el primero en dejar uno!
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              style={{
                backgroundColor: colors.cardBg,
                padding: '32px',
                borderRadius: '12px',
                boxShadow: colors.shadow,
                position: 'relative',
                transition: 'all 0.3s ease'
              }}
            >
              <Quote 
                size={40} 
                color="#ef4444" 
                style={{ 
                  position: 'absolute', 
                  top: '16px', 
                  right: '16px',
                  opacity: 0.2
                }} 
              />
              
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} fill="#fbbf24" color="#fbbf24" />
                ))}
              </div>
              
              <p style={{ 
                fontSize: '16px', 
                lineHeight: '1.6',
                color: colors.text,
                marginBottom: '16px',
                fontStyle: 'italic'
              }}>
                "{testimonial.text}"
              </p>
              
              <div>
                <p style={{ fontWeight: 'bold', color: colors.text }}>
                  {testimonial.name}
                </p>
                {testimonial.company && (
                  <p style={{ fontSize: '14px', color: colors.textSecondary }}>
                    {testimonial.company}
                  </p>
                )}
                <p style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '4px' }}>
                  {testimonial.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Testimonials;
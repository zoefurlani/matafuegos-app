import Navbar from '../components/Navbar';
import Breadcrumbs from '../components/Breadcrumbs';
import Footer from '../components/Footer';
import { useTheme } from '../contexts/ThemeContext';
import { Wrench, Calendar, CheckCircle, AlertCircle, ClipboardCheck, Shield } from 'lucide-react';

function Mantenimiento() {
  const { colors } = useTheme();

  const services = [
    {
      icon: Wrench,
      title: 'Recarga Anual',
      description: 'Servicio completo de recarga con agente extintor certificado',
      price: 'Desde $15.000',
      includes: [
        'Vaciado completo del cilindro',
        'Inspección interna del tanque',
        'Recarga con agente nuevo certificado',
        'Prueba de presión',
        'Precinto de seguridad',
        'Certificado oficial'
      ]
    },
    {
      icon: ClipboardCheck,
      title: 'Inspección Técnica',
      description: 'Revisión completa del estado del equipo',
      price: 'Desde $8.000',
      includes: [
        'Verificación de presión',
        'Estado de manguera y boquilla',
        'Revisión de seguros y precintos',
        'Check del manómetro',
        'Inspección visual externa',
        'Informe técnico detallado'
      ]
    },
    {
      icon: Shield,
      title: 'Prueba Hidráulica',
      description: 'Cada 5 años según normativa vigente',
      price: 'Desde $20.000',
      includes: [
        'Desmontaje completo',
        'Prueba de presión hidrostática',
        'Pintura anticorrosiva',
        'Cambio de válvulas si es necesario',
        'Recarga completa',
        'Certificación oficial'
      ]
    }
  ];

  const schedule = [
    { year: 'Año 1', action: 'Recarga + Inspección' },
    { year: 'Año 2', action: 'Recarga + Inspección' },
    { year: 'Año 3', action: 'Recarga + Inspección' },
    { year: 'Año 4', action: 'Recarga + Inspección' },
    { year: 'Año 5', action: 'Prueba Hidráulica + Recarga' },
  ];

  return (
    <>
      <Navbar />
      <Breadcrumbs />
      <div style={{
        backgroundColor: colors.background,
        minHeight: '100vh',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '48px 32px'
        }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '64px'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              marginBottom: '24px',
              boxShadow: '0 8px 20px rgba(239, 68, 68, 0.3)'
            }}>
              <Wrench size={40} color="white" />
            </div>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: '16px',
              transition: 'color 0.3s ease'
            }}>
              Mantenimiento Profesional
            </h1>
            <p style={{
              fontSize: '20px',
              color: colors.textSecondary,
              maxWidth: '700px',
              margin: '0 auto',
              transition: 'color 0.3s ease'
            }}>
              Mantenemos tus equipos en óptimas condiciones siguiendo las normativas vigentes
            </p>
          </div>

          {/* Alert Box */}
          <div style={{
            backgroundColor: colors.cardBg,
            border: '2px solid #ef4444',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '48px',
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-start'
          }}>
            <AlertCircle size={24} color="#ef4444" style={{ flexShrink: 0, marginTop: '4px' }} />
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: colors.text,
                marginBottom: '8px'
              }}>
                ¡Importante!
              </h3>
              <p style={{
                fontSize: '15px',
                color: colors.textSecondary,
                lineHeight: '1.6',
                margin: 0
              }}>
                La recarga anual es OBLIGATORIA según la Ley 19.587 de Higiene y Seguridad en el Trabajo. 
                El incumplimiento puede resultar en multas y responsabilidad legal en caso de siniestros.
              </p>
            </div>
          </div>

          {/* Services Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            marginBottom: '64px'
          }}>
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: colors.cardBg,
                    padding: '32px',
                    borderRadius: '16px',
                    border: '2px solid ' + colors.border,
                    boxShadow: colors.shadow,
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.borderColor = '#ef4444';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(239, 68, 68, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = colors.border;
                    e.currentTarget.style.boxShadow = colors.shadow;
                  }}
                >
                  <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#ef4444',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                  }}>
                    <Icon size={32} color="white" />
                  </div>

                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: colors.text,
                    marginBottom: '8px'
                  }}>
                    {service.title}
                  </h3>

                  <p style={{
                    fontSize: '15px',
                    color: colors.textSecondary,
                    marginBottom: '16px'
                  }}>
                    {service.description}
                  </p>

                  <div style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#ef4444',
                    marginBottom: '24px'
                  }}>
                    {service.price}
                  </div>

                  <div style={{
                    borderTop: '1px solid ' + colors.border,
                    paddingTop: '20px',
                    flex: 1
                  }}>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: colors.text,
                      marginBottom: '12px'
                    }}>
                      Incluye:
                    </p>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0
                    }}>
                      {service.includes.map((item, idx) => (
                        <li key={idx} style={{
                          fontSize: '14px',
                          color: colors.textSecondary,
                          marginBottom: '8px',
                          paddingLeft: '24px',
                          position: 'relative'
                        }}>
                          <CheckCircle size={16} color="#10b981" style={{
                            position: 'absolute',
                            left: 0,
                            top: '2px'
                          }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button style={{
                    marginTop: '24px',
                    padding: '14px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
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
                  onClick={() => window.open('https://wa.me/5491234567890?text=Hola, necesito información sobre ' + service.title, '_blank')}>
                    Solicitar Servicio
                  </button>
                </div>
              );
            })}
          </div>

          {/* Schedule Timeline */}
          <div style={{
            backgroundColor: colors.cardBg,
            padding: '48px 32px',
            borderRadius: '16px',
            border: '2px solid ' + colors.border,
            boxShadow: colors.shadow
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '32px'
            }}>
              <Calendar size={32} color="#ef4444" />
              <h2 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: colors.text,
                margin: 0
              }}>
                Cronograma de Mantenimiento
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px'
            }}>
              {schedule.map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: '20px',
                    backgroundColor: colors.background,
                    borderRadius: '12px',
                    border: '2px solid ' + (index === 4 ? '#ef4444' : colors.border),
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.borderColor = '#ef4444';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.borderColor = index === 4 ? '#ef4444' : colors.border;
                  }}
                >
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#ef4444',
                    marginBottom: '8px'
                  }}>
                    {item.year}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: colors.textSecondary,
                    lineHeight: '1.4'
                  }}>
                    {item.action}
                  </div>
                </div>
              ))}
            </div>

            <p style={{
              fontSize: '14px',
              color: colors.textSecondary,
              textAlign: 'center',
              marginTop: '24px',
              fontStyle: 'italic'
            }}>
              * Cada 5 años se debe realizar prueba hidráulica obligatoria
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Mantenimiento;
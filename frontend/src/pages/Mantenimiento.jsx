import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../contexts/ThemeContext';
import { Wrench, Calendar, CheckCircle, AlertCircle, ClipboardCheck, Shield, Clock } from 'lucide-react';

function Mantenimiento() {
  const { colors } = useTheme();
  const services = [
    {
      icon: Wrench,
      title: 'Recarga de Extintores',
      description: 'Servicio de recarga para mantener tu equipo en condiciones óptimas',
      includes: [
        'Descarga completa del equipo',
        'Control del estado general del cilindro',
        'Recarga con agente nuevo según el tipo de extintor',
        'Verificación de presión',
        'Colocación de precinto y tarjeta de control'
      ]
    },
    {
      icon: ClipboardCheck,
      title: 'Control y Revisión',
      description: 'Chequeo del estado del extintor antes de la recarga',
      includes: [
        'Revisión visual del cilindro',
        'Control de manómetro',
        'Chequeo de manguera y boquilla',
        'Verificación de seguro y pasador',
        'Confirmación de fecha de vencimiento'
      ]
    },
    {
      icon: Shield,
      title: 'Venta de Extintores',
      description: 'Extintores nuevos listos para instalar',
      includes: [
        'Extintores ABC para hogar y comercio',
        'Extintores de CO2 para equipos eléctricos',
        'Asesoramiento según necesidad',
        'Equipos con carga inicial incluida',
        'Entrega inmediata'
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
      <div style={{
        backgroundColor: colors.background,
        minHeight: '100vh',
        transition: 'all 0.3s ease',
        paddingTop: '80px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '48px 32px'
        }} className="mantenimiento-container">
          <div style={{
            textAlign: 'center',
            marginBottom: '64px'
          }} className="header-section">
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
            }} className="header-icon">
              <Wrench size={40} color="white" />
            </div>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: '16px',
              transition: 'color 0.3s ease'
            }} className="header-title">
              Mantenimiento Profesional
            </h1>
            <p style={{
              fontSize: '20px',
              color: colors.textSecondary,
              maxWidth: '700px',
              margin: '0 auto',
              transition: 'color 0.3s ease'
            }} className="header-description">
              Mantenemos tus equipos en óptimas condiciones siguiendo las normativas vigentes
            </p>
          </div>

          <div style={{
            backgroundColor: colors.cardBg,
            border: '2px solid #ef4444',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '48px',
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-start'
          }} className="alert-box">
            <AlertCircle size={24} color="#ef4444" style={{ flexShrink: 0, marginTop: '4px' }} />
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: colors.text,
                marginBottom: '8px'
              }} className="alert-title">
                ¡Importante!
              </h3>
              <p style={{
                fontSize: '15px',
                color: colors.textSecondary,
                lineHeight: '1.6',
                margin: 0
              }} className="alert-text">
                La recarga anual es OBLIGATORIA según la Ley 19.587 de Higiene y Seguridad en el Trabajo. 
                El incumplimiento puede resultar en multas y responsabilidad legal en caso de siniestros.
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            marginBottom: '32px'
          }} className="services-grid">
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
                  className="service-card"
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
                  }} className="service-title">
                    {service.title}
                  </h3>

                  <p style={{
                    fontSize: '15px',
                    color: colors.textSecondary,
                    marginBottom: '24px'
                  }} className="service-description">
                    {service.description}
                  </p>

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
                </div>
              );
            })}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '64px'
          }} className="cta-button-container">
            <button 
              style={{
                padding: '18px 48px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
              }}
              className="cta-button"
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#ef4444';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
              }}
              onClick={() => window.open('https://wa.me/543482445650?text=Hola, necesito información sobre servicios de mantenimiento', '_blank')}
            >
              Solicitar Servicio
            </button>
          </div>

          <div style={{
            backgroundColor: colors.cardBg,
            padding: '48px 32px',
            borderRadius: '16px',
            border: '2px solid ' + colors.border,
            boxShadow: colors.shadow,
            marginBottom: '32px'
          }} className="schedule-section">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '32px'
            }} className="schedule-header">
              <Calendar size={32} color="#ef4444" />
              <h2 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: colors.text,
                margin: 0
              }} className="schedule-title">
                Cronograma de Mantenimiento
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px'
            }} className="schedule-grid">
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
                  className="schedule-item"
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
                  }} className="schedule-year">
                    {item.year}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: colors.textSecondary,
                    lineHeight: '1.4'
                  }} className="schedule-action">
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
            }} className="schedule-note">
              * Cada 5 años se debe realizar prueba hidráulica obligatoria
            </p>
          </div>

          <div style={{
            backgroundColor: colors.cardBg,
            padding: '48px 32px',
            borderRadius: '16px',
            border: '2px solid ' + colors.border,
            boxShadow: colors.shadow
          }} className="lifespan-section">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px'
            }} className="lifespan-header">
              <Clock size={32} color="#ef4444" />
              <h2 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: colors.text,
                margin: 0
              }} className="lifespan-title">
                Vida Útil del Matafuego
              </h2>
            </div>

            <p style={{
              fontSize: '18px',
              color: colors.text,
              lineHeight: '1.8',
              marginBottom: '24px'
            }} className="lifespan-intro">
              Un matafuego tiene una vida útil de aproximadamente <strong style={{ color: '#ef4444' }}>25 años</strong> desde su fecha de fabricación. Sin embargo, esta duración puede variar significativamente dependiendo de diversos factores:
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '24px'
            }} className="factors-grid">
              <div style={{
                padding: '20px',
                backgroundColor: colors.background,
                borderRadius: '12px',
                border: '2px solid ' + colors.border
              }} className="factor-card">
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#ef4444',
                  marginBottom: '8px'
                }} className="factor-title">
                  Condiciones de almacenamiento
                </h4>
                <p style={{
                  fontSize: '14px',
                  color: colors.textSecondary,
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  Un lugar seco, ventilado y protegido prolonga la vida útil del equipo
                </p>
              </div>

              <div style={{
                padding: '20px',
                backgroundColor: colors.background,
                borderRadius: '12px',
                border: '2px solid ' + colors.border
              }} className="factor-card">
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#ef4444',
                  marginBottom: '8px'
                }} className="factor-title">
                  Exposición climática
                </h4>
                <p style={{
                  fontSize: '14px',
                  color: colors.textSecondary,
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  Los cambios de temperatura, humedad y lluvia aceleran el deterioro del cilindro
                </p>
              </div>

              <div style={{
                padding: '20px',
                backgroundColor: colors.background,
                borderRadius: '12px',
                border: '2px solid ' + colors.border
              }} className="factor-card">
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#ef4444',
                  marginBottom: '8px'
                }} className="factor-title">
                  Mantenimiento preventivo
                </h4>
                <p style={{
                  fontSize: '14px',
                  color: colors.textSecondary,
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  Las recargas anuales y pruebas hidráulicas garantizan el correcto funcionamiento
                </p>
              </div>

              <div style={{
                padding: '20px',
                backgroundColor: colors.background,
                borderRadius: '12px',
                border: '2px solid ' + colors.border
              }} className="factor-card">
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#ef4444',
                  marginBottom: '8px'
                }} className="factor-title">
                  Ubicación del equipo
                </h4>
                <p style={{
                  fontSize: '14px',
                  color: colors.textSecondary,
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  Interior vs exterior: la intemperie reduce significativamente la durabilidad
                </p>
              </div>
            </div>

            <div style={{
              backgroundColor: colors.cardBg,
              border: '2px solid #ef4444',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start'
            }} className="lifespan-alert">
              <AlertCircle size={24} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{
                  fontSize: '15px',
                  color: colors.textSecondary,
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  <strong style={{ color: colors.text }}>Importante:</strong> Si tu matafuego está expuesto a la intemperie o 
                  presenta signos visibles de oxidación, golpes o deterioro, su vida útil puede reducirse drásticamente. En estos casos, recomendamos una inspección técnica inmediata para evaluar su estado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <style>{`
        /* Tablet */
        @media (max-width: 768px) {
          .mantenimiento-container {
            padding: 32px 24px !important;
          }

          .header-section {
            margin-bottom: 48px !important;
          }

          .header-icon {
            width: 64px !important;
            height: 64px !important;
            margin-bottom: 20px !important;
          }

          .header-icon svg {
            width: 32px !important;
            height: 32px !important;
          }

          .header-title {
            font-size: 36px !important;
          }

          .header-description {
            font-size: 18px !important;
          }

          .alert-box {
            padding: 20px !important;
            flex-direction: column !important;
            gap: 12px !important;
          }

          .alert-title {
            font-size: 16px !important;
          }

          .alert-text {
            font-size: 14px !important;
          }

          .services-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }

          .service-card {
            padding: 24px !important;
          }

          .service-title {
            font-size: 20px !important;
          }

          .cta-button {
            padding: 16px 40px !important;
            font-size: 16px !important;
            width: 100% !important;
          }

          .schedule-section,
          .lifespan-section {
            padding: 32px 24px !important;
          }

          .schedule-header,
          .lifespan-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }

          .schedule-header svg,
          .lifespan-header svg {
            width: 28px !important;
            height: 28px !important;
          }

          .schedule-title,
          .lifespan-title {
            font-size: 28px !important;
          }

          .schedule-grid {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)) !important;
            gap: 12px !important;
          }

          .schedule-item {
            padding: 16px !important;
          }

          .schedule-year {
            font-size: 18px !important;
          }

          .schedule-action {
            font-size: 13px !important;
          }

          .lifespan-intro {
            font-size: 16px !important;
          }

          .factors-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }

          .factor-card {
            padding: 16px !important;
          }

          .factor-title {
            font-size: 15px !important;
          }

          .lifespan-alert {
            flex-direction: column !important;
            padding: 16px !important;
          }
        }

        /* Mobile pequeño */
        @media (max-width: 480px) {
          .mantenimiento-container {
            padding: 24px 16px !important;
          }

          .header-icon {
            width: 56px !important;
            height: 56px !important;
          }

          .header-icon svg {
            width: 28px !important;
            height: 28px !important;
          }

          .header-title {
            font-size: 28px !important;
          }

          .header-description {
            font-size: 16px !important;
          }

          .alert-box {
            padding: 16px !important;
          }

          .service-card {
            padding: 20px !important;
          }

          .cta-button {
            padding: 14px 32px !important;
            font-size: 15px !important;
          }

          .schedule-section,
          .lifespan-section {
            padding: 24px 16px !important;
          }

          .schedule-title,
          .lifespan-title {
            font-size: 24px !important;
          }

          .schedule-grid {
            grid-template-columns: 1fr !important;
          }

          .lifespan-intro {
            font-size: 15px !important;
          }
        }
      `}</style>
    </>
  );
}

export default Mantenimiento;
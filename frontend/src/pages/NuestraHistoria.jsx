import Navbar from '../components/Navbar';
import Breadcrumbs from '../components/Breadcrumbs';
import Footer from '../components/Footer';
import { useTheme } from '../contexts/ThemeContext';
import { Users, Award, Target, Heart, TrendingUp, Shield } from 'lucide-react';

function NuestraHistoria() {
  const { colors } = useTheme();

  const timeline = [
    {
      year: '2008',
      title: 'Nuestros Inicios',
      description: 'Fundación de ZD Matafuegos con el objetivo de brindar seguridad a la comunidad de Malabrigo.'
    },
    {
      year: '2012',
      title: 'Certificación IRAM',
      description: 'Obtuvimos la certificación IRAM, respaldando nuestro compromiso con la calidad.'
    },
    {
      year: '2015',
      title: 'Expansión de Servicios',
      description: 'Incorporamos servicios de capacitación y asesoramiento en seguridad contra incendios.'
    },
    {
      year: '2018',
      title: 'Tecnología de Vanguardia',
      description: 'Renovamos nuestro equipamiento con tecnología de última generación para ofrecer mejor servicio.'
    },
    {
      year: '2023',
      title: 'Más de 500 Clientes',
      description: 'Alcanzamos la confianza de más de 500 clientes satisfechos en toda la región.'
    }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Seguridad',
      description: 'La seguridad de nuestros clientes es nuestra máxima prioridad'
    },
    {
      icon: Heart,
      title: 'Compromiso',
      description: 'Comprometidos con la calidad y el servicio de excelencia'
    },
    {
      icon: Award,
      title: 'Profesionalismo',
      description: 'Equipo técnico certificado y altamente capacitado'
    },
    {
      icon: TrendingUp,
      title: 'Innovación',
      description: 'Constantemente actualizados con las últimas tecnologías'
    }
  ];

  const stats = [
    { number: '15+', label: 'Años de Experiencia' },
    { number: '500+', label: 'Clientes Satisfechos' },
    { number: '24/7', label: 'Servicio de Emergencia' },
    { number: '100%', label: 'Certificado' }
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
              <Users size={40} color="white" />
            </div>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: '16px',
              transition: 'color 0.3s ease'
            }}>
              Nuestra Historia
            </h1>
            <p style={{
              fontSize: '20px',
              color: colors.textSecondary,
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6',
              transition: 'color 0.3s ease'
            }}>
              Más de 15 años protegiendo hogares y empresas en Santa Fe. 
              Conocé nuestra trayectoria y compromiso con la seguridad.
            </p>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            marginBottom: '64px'
          }}>
            {stats.map((stat, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: colors.cardBg,
                  padding: '32px',
                  borderRadius: '16px',
                  textAlign: 'center',
                  border: '2px solid ' + colors.border,
                  boxShadow: colors.shadow,
                  transition: 'all 0.3s ease'
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
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#ef4444',
                  marginBottom: '8px'
                }}>
                  {stat.number}
                </div>
                <div style={{
                  fontSize: '16px',
                  color: colors.textSecondary,
                  fontWeight: '600'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div style={{
            marginBottom: '64px'
          }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: '48px',
              textAlign: 'center'
            }}>
              Nuestra Trayectoria
            </h2>

            <div style={{
              position: 'relative'
            }}>
              {/* Línea vertical */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                bottom: 0,
                width: '4px',
                backgroundColor: colors.border,
                transform: 'translateX(-50%)'
              }} />

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '48px'
              }}>
                {timeline.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: index % 2 === 0 ? '1fr auto 1fr' : '1fr auto 1fr',
                      gap: '32px',
                      alignItems: 'center'
                    }}
                  >
                    {/* Contenido izquierda */}
                    {index % 2 === 0 ? (
                      <div style={{
                        backgroundColor: colors.cardBg,
                        padding: '24px',
                        borderRadius: '12px',
                        border: '2px solid ' + colors.border,
                        boxShadow: colors.shadow,
                        textAlign: 'right'
                      }}>
                        <div style={{
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color: '#ef4444',
                          marginBottom: '8px'
                        }}>
                          {item.year}
                        </div>
                        <h3 style={{
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: colors.text,
                          marginBottom: '8px'
                        }}>
                          {item.title}
                        </h3>
                        <p style={{
                          fontSize: '15px',
                          color: colors.textSecondary,
                          margin: 0,
                          lineHeight: '1.5'
                        }}>
                          {item.description}
                        </p>
                      </div>
                    ) : <div />}

                    {/* Punto central */}
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#ef4444',
                      borderRadius: '50%',
                      border: '4px solid ' + colors.background,
                      boxShadow: '0 0 0 4px ' + colors.border,
                      zIndex: 1
                    }} />

                    {/* Contenido derecha */}
                    {index % 2 !== 0 ? (
                      <div style={{
                        backgroundColor: colors.cardBg,
                        padding: '24px',
                        borderRadius: '12px',
                        border: '2px solid ' + colors.border,
                        boxShadow: colors.shadow
                      }}>
                        <div style={{
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color: '#ef4444',
                          marginBottom: '8px'
                        }}>
                          {item.year}
                        </div>
                        <h3 style={{
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: colors.text,
                          marginBottom: '8px'
                        }}>
                          {item.title}
                        </h3>
                        <p style={{
                          fontSize: '15px',
                          color: colors.textSecondary,
                          margin: 0,
                          lineHeight: '1.5'
                        }}>
                          {item.description}
                        </p>
                      </div>
                    ) : <div />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Values */}
          <div>
            <h2 style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: '48px',
              textAlign: 'center'
            }}>
              Nuestros Valores
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '32px'
            }}>
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    style={{
                      backgroundColor: colors.cardBg,
                      padding: '32px',
                      borderRadius: '16px',
                      border: '2px solid ' + colors.border,
                      boxShadow: colors.shadow,
                      textAlign: 'center',
                      transition: 'all 0.3s ease'
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
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                    }}>
                      <Icon size={32} color="white" />
                    </div>
                    <h3 style={{
                      fontSize: '22px',
                      fontWeight: 'bold',
                      color: colors.text,
                      marginBottom: '12px'
                    }}>
                      {value.title}
                    </h3>
                    <p style={{
                      fontSize: '15px',
                      color: colors.textSecondary,
                      margin: 0,
                      lineHeight: '1.6'
                    }}>
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default NuestraHistoria;
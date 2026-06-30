import Navbar from '../components/Navbar';
import Breadcrumbs from '../components/Breadcrumbs';
import Footer from '../components/Footer';
import { useTheme } from '../contexts/ThemeContext';
import { Book, Shield, FileText, AlertTriangle, CheckCircle, Download, ExternalLink } from 'lucide-react';

function CentroConocimiento() {
  const { colors } = useTheme();

  const articles = [
    {
      icon: Shield,
      title: 'Tipos de Matafuegos',
      description: 'Conocé las diferencias entre matafuegos ABC, BC, AFFF, K y CO2. Cada tipo está diseñado para combatir clases específicas de fuego.',
      content: [
        'Matafuego ABC (Polvo Químico Seco): Apto para fuegos Clase A, B y C. Es el más versátil y utilizado en comercios, oficinas y hogares.',
        'Matafuego BC (Polvo Químico Seco): Indicado para fuegos Clase B y C. Ideal para líquidos inflamables y equipos eléctricos.',
        'Matafuego AFFF (Espuma): Especial para fuegos Clase A y B. Muy eficaz en líquidos inflamables porque forma una película que sofoca el fuego.',
        'Matafuego CO2 (Dióxido de Carbono): Especial para fuegos eléctricos. No deja residuos y es recomendado para tableros y equipos sensibles.',
        'Matafuego Clase K: Diseñado para aceites y grasas de cocina. Fundamental en restaurantes y cocinas industriales.',
        'Clase A: Combustibles sólidos como madera, papel, cartón y telas.',
        'Clase B: Líquidos inflamables como gasolina, alcoholes, pinturas y aceites.',
        'Clase C: Equipos eléctricos energizados.',
        'Clase K: Aceites y grasas vegetales o animales utilizadas en cocina.',
        'La correcta selección del matafuego y su mantenimiento anual garantizan una respuesta efectiva ante una emergencia.'
      ]
    },
    {
      icon: FileText,
      title: 'Normativas Vigentes',
      description: 'Cumplimiento de la Ley 19.587 de Higiene y Seguridad en el Trabajo, Decreto 351/79 y normativas complementarias IRAM.',
      content: [
        'Control, mantenimiento y verificación anual obligatoria',
        'Recarga periódica según tipo de agente extintor',
        'Señalización reglamentaria y ubicación visible',
        'Instalación a altura normativa y con acceso libre de obstrucciones',
        'Tarjeta identificatoria y oblea vigente',
        'Certificación emitida por técnico habilitado'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Señales de Mantenimiento',
      description: 'Identificá cuándo tu matafuego necesita servicio técnico inmediato.',
      content: [
        'Manómetro en zona roja o amarilla',
        'Manguera agrietada o deteriorada',
        'Precinto de seguridad roto',
        'Oxidación visible en el cilindro',
        'Golpes o abolladuras en el cuerpo'
      ]
    },
    {
      icon: CheckCircle,
      title: 'Uso Correcto',
      description: 'Técnica P.A.S.S. para el uso efectivo del matafuegos en caso de emergencia.',
      content: [
        'P - Presionar: Quitar el precinto de seguridad',
        'A - Apuntar: Dirigir la boquilla a la base del fuego',
        'S - Sostener (Squeeze): Apretar el gatillo firmemente',
        'S - Barrer (Sweep): Mover de lado a lado cubriendo el área'
      ]
    }
  ];

  const recursos = [
    {
      nombre: 'Guía de Prevención de Incendios',
      descripcion: 'Uso de extintores, plan de evacuación y medidas preventivas (SRT)',
      url: 'https://www.argentina.gob.ar/sites/default/files/01_guia_prevencion_de_incendios_ok.pdf',
      tipo: 'PDF - SRT'
    },
    {
      nombre: 'Prevención de Incendios Forestales',
      descripcion: 'Cartilla educativa sobre prevención y manejo del fuego',
      url: 'https://www.argentina.gob.ar/sites/default/files/2018/03/cartilla_para_docentes_de_escuelas_primarias_2023_-_prevencion_de_incendios_forestales.pdf',
      tipo: 'PDF - Gobierno Nacional'
    },
    {
      nombre: 'Prevención en el Hogar - SINAGIR',
      descripcion: 'Recomendaciones oficiales para prevenir incendios domésticos',
      url: 'https://www.argentina.gob.ar/sinagir/incendios-estructurales/prevencion',
      tipo: 'Web - SINAGIR'
    }
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
              <Book size={40} color="white" />
            </div>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: '16px',
              transition: 'color 0.3s ease'
            }}>
              Centro de Conocimiento
            </h1>
            <p style={{
              fontSize: '20px',
              color: colors.textSecondary,
              maxWidth: '700px',
              margin: '0 auto',
              transition: 'color 0.3s ease'
            }}>
              Información esencial sobre seguridad contra incendios, normativas y mantenimiento de equipos
            </p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            marginBottom: '64px'
          }}>
            {articles.map((article, index) => {
              const Icon = article.icon;
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
                    cursor: 'pointer'
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
                    marginBottom: '12px',
                    transition: 'color 0.3s ease'
                  }}>
                    {article.title}
                  </h3>
                  
                  <p style={{
                    fontSize: '15px',
                    color: colors.textSecondary,
                    marginBottom: '20px',
                    lineHeight: '1.6',
                    transition: 'color 0.3s ease'
                  }}>
                    {article.description}
                  </p>
                  
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {article.content.map((item, idx) => (
                      <li key={idx} style={{
                        fontSize: '14px',
                        color: colors.textSecondary,
                        marginBottom: '10px',
                        paddingLeft: '24px',
                        position: 'relative',
                        transition: 'color 0.3s ease'
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: 0,
                          color: '#ef4444',
                          fontWeight: 'bold'
                        }}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div style={{
            backgroundColor: '#ef4444',
            padding: '48px 32px',
            borderRadius: '16px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              pointerEvents: 'none'
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Download size={48} color="white" style={{ marginBottom: '20px' }} />
              <h2 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '16px'
              }}>
                Material Informativo Oficial
              </h2>
              <p style={{
                fontSize: '18px',
                color: 'white',
                marginBottom: '32px',
                opacity: 0.95
              }}>
                Accedé a guías y manuales del Gobierno Nacional
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px',
                marginTop: '32px'
              }}>
                {recursos.map((recurso, idx) => (
                  <a
                    key={idx}
                    href={recurso.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '20px',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '8px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      textAlign: 'left'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      width: '100%'
                    }}>
                      <span style={{
                        fontSize: '12px',
                        color: '#ef4444',
                        fontWeight: 'bold',
                        backgroundColor: '#fee2e2',
                        padding: '4px 8px',
                        borderRadius: '6px'
                      }}>
                        {recurso.tipo}
                      </span>
                      <ExternalLink size={18} color="#ef4444" />
                    </div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#111827',
                      margin: 0
                    }}>
                      {recurso.nombre}
                    </h3>
                    <p style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      {recurso.descripcion}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CentroConocimiento;
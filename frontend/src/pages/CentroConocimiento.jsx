import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, Download, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { generatePDFFromHTML, generateWordDocument, generateCSV } from '../utils/pdfGenerator';

const CentroConocimiento = () => {
  const navigate = useNavigate();
  const [expandedCard, setExpandedCard] = useState(null);
  const [generatingFile, setGeneratingFile] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(null);

  const recursos = [
    {
      id: 1,
      titulo: 'Tipos de Extintores',
      categoria: 'Guía Técnica',
      contenido: `
        <h2>Clasificación de Extintores según el tipo de fuego</h2>
        
        <h3>Clase A - Fuegos de Sólidos</h3>
        <p>Materiales como madera, papel, cartón, telas y algunos plásticos. Estos fuegos dejan cenizas y brasas.</p>
        <ul>
          <li><strong>Extintor recomendado:</strong> Agua, Espuma, Polvo ABC</li>
          <li><strong>Identificación:</strong> Triángulo verde con letra A</li>
          <li><strong>Usos comunes:</strong> Oficinas, hogares, almacenes</li>
        </ul>

        <h3>Clase B - Fuegos de Líquidos</h3>
        <p>Líquidos inflamables como gasolina, aceites, pinturas, solventes y gases inflamables.</p>
        <ul>
          <li><strong>Extintor recomendado:</strong> CO2, Polvo ABC, Espuma</li>
          <li><strong>Identificación:</strong> Cuadrado rojo con letra B</li>
          <li><strong>Usos comunes:</strong> Talleres, estaciones de servicio, industrias</li>
        </ul>

        <h3>Clase C - Fuegos Eléctricos</h3>
        <p>Equipos eléctricos energizados como computadoras, motores, transformadores.</p>
        <ul>
          <li><strong>Extintor recomendado:</strong> CO2, Polvo ABC (nunca usar agua)</li>
          <li><strong>Identificación:</strong> Círculo azul con letra C</li>
          <li><strong>Usos comunes:</strong> Centros de cómputo, salas eléctricas</li>
        </ul>

        <h3>Clase D - Fuegos de Metales</h3>
        <p>Metales combustibles como magnesio, titanio, potasio y sodio.</p>
        <ul>
          <li><strong>Extintor recomendado:</strong> Polvo especial para metales</li>
          <li><strong>Identificación:</strong> Estrella amarilla con letra D</li>
          <li><strong>Usos comunes:</strong> Laboratorios, industrias metalúrgicas</li>
        </ul>

        <h3>Clase K - Fuegos de Cocina</h3>
        <p>Aceites y grasas de cocina a altas temperaturas.</p>
        <ul>
          <li><strong>Extintor recomendado:</strong> Agente químico húmedo específico</li>
          <li><strong>Identificación:</strong> Hexágono negro con letra K</li>
          <li><strong>Usos comunes:</strong> Cocinas comerciales, restaurantes</li>
        </ul>

        <h3>Mantenimiento y Verificación</h3>
        <p><strong>Recuerde:</strong> Los extintores deben inspeccionarse mensualmente y recargarse anualmente o después de cada uso.</p>
      `,
    },
    {
      id: 2,
      titulo: 'Normativas de Seguridad',
      categoria: 'Marco Legal',
      contenido: `
        <h2>Normativas Argentinas sobre Seguridad contra Incendios</h2>
        
        <h3>Ley Nacional 19.587 - Higiene y Seguridad en el Trabajo</h3>
        <p>Establece las condiciones básicas de seguridad e higiene en los lugares de trabajo en toda la República Argentina.</p>
        <ul>
          <li>Obligación de contar con sistemas de prevención y extinción</li>
          <li>Capacitación obligatoria del personal</li>
          <li>Inspecciones periódicas de seguridad</li>
        </ul>

        <h3>Decreto 351/79 - Reglamentación de la Ley 19.587</h3>
        <p>Reglamenta específicamente los aspectos técnicos de protección contra incendios:</p>
        <ul>
          <li><strong>Capítulo 18:</strong> Protección contra incendios</li>
          <li><strong>Anexo VII:</strong> Características constructivas y de instalación</li>
          <li>Cálculo de carga de fuego y potencial extintor</li>
          <li>Distancias máximas de recorrido hasta extintores</li>
        </ul>

        <h3>Normas IRAM</h3>
        <h4>IRAM 3517 - Extintores Portátiles</h4>
        <ul>
          <li>Clasificación y ensayos de extintores</li>
          <li>Requisitos de rotulado e identificación</li>
          <li>Procedimientos de inspección y mantenimiento</li>
        </ul>

        <h4>IRAM 3546 - Señalización de Seguridad</h4>
        <ul>
          <li>Colores y símbolos de seguridad</li>
          <li>Ubicación y dimensiones de señales</li>
          <li>Señalización fotoluminiscente</li>
        </ul>

        <h3>Código de Edificación (Municipal)</h3>
        <p>Cada municipio establece requisitos específicos según el tipo de edificación:</p>
        <ul>
          <li>Viviendas unifamiliares: Extintor ABC 5kg mínimo</li>
          <li>Edificios de departamentos: Extintores cada 200m² por piso</li>
          <li>Comercios e industrias: Cálculo según carga de fuego</li>
          <li>Instalación de sistemas de detección y alarma</li>
        </ul>

        <h3>Responsabilidades del Titular</h3>
        <ul>
          <li>Mantener equipos en condiciones operativas</li>
          <li>Realizar mantenimiento anual certificado</li>
          <li>Capacitar al personal en uso de extintores</li>
          <li>Mantener libreta de inspecciones actualizada</li>
          <li>Contratar servicios habilitados</li>
        </ul>

        <h3>Sanciones por Incumplimiento</h3>
        <p>El incumplimiento de las normativas puede resultar en:</p>
        <ul>
          <li>Multas económicas</li>
          <li>Clausura del establecimiento</li>
          <li>Responsabilidad civil y penal en caso de siniestros</li>
        </ul>
      `,
    },
    {
      id: 3,
      titulo: 'Uso Correcto de Extintores',
      categoria: 'Capacitación',
      contenido: `
        <h2>Guía Completa para el Uso de Extintores</h2>
        
        <h3>Antes de usar el extintor</h3>
        <h4>1. Evaluar la situación</h4>
        <ul>
          <li>¿El fuego es pequeño y controlable? (menor a 1m²)</li>
          <li>¿Tengo vía de escape segura?</li>
          <li>¿Hay humo tóxico o mucho calor?</li>
          <li>¿Ya se alertó a otras personas?</li>
        </ul>
        <p><strong>IMPORTANTE:</strong> Si el fuego es grande o dudas, EVACUA y llama al 100.</p>

        <h4>2. Identificar el tipo de fuego</h4>
        <ul>
          <li>Fuego clase A: Usa ABC, espuma o agua</li>
          <li>Fuego clase B: Usa ABC o CO2 (nunca agua)</li>
          <li>Fuego clase C: Usa CO2 o ABC (nunca agua)</li>
        </ul>

        <h3>Técnica P.A.S.S. (Jalar - Apuntar - Apretar - Barrer)</h3>
        
        <h4>P - PULL (Jalar el pasador)</h4>
        <ul>
          <li>Rompe el precinto de seguridad</li>
          <li>Jala el pasador de seguridad</li>
          <li>Verifica que la manguera esté libre</li>
        </ul>

        <h4>A - AIM (Apuntar a la base)</h4>
        <ul>
          <li>Mantente a 2-3 metros del fuego</li>
          <li>Apunta la boquilla hacia la BASE de las llamas</li>
          <li>Nunca apuntes hacia arriba de las llamas</li>
          <li>Posiciónate con el viento a tu espalda</li>
        </ul>

        <h4>S - SQUEEZE (Apretar la manija)</h4>
        <ul>
          <li>Aprieta firmemente la manija</li>
          <li>Mantén presión constante</li>
          <li>El agente comenzará a salir inmediatamente</li>
        </ul>

        <h4>S - SWEEP (Barrer de lado a lado)</h4>
        <ul>
          <li>Mueve la boquilla de lado a lado</li>
          <li>Avanza lentamente hacia el fuego</li>
          <li>Cubre toda el área en llamas</li>
          <li>Continúa hasta que se apaguen las llamas</li>
        </ul>

        <h3>Después de extinguir el fuego</h3>
        <ul>
          <li><strong>Observa:</strong> El fuego puede reavivarse</li>
          <li><strong>Retrocede:</strong> Mantén distancia segura</li>
          <li><strong>Ventila:</strong> Abre ventanas si es seguro</li>
          <li><strong>Reporta:</strong> Informa del incidente</li>
          <li><strong>Recarga:</strong> Lleva el extintor a recargar inmediatamente</li>
        </ul>

        <h3>Errores Comunes a Evitar</h3>
        <ul>
          <li>❌ Apuntar a las llamas en vez de a la base</li>
          <li>❌ Acercarse demasiado al fuego</li>
          <li>❌ Dar la espalda a tu vía de escape</li>
          <li>❌ Usar agua en fuegos eléctricos o de aceite</li>
          <li>❌ Intentar apagar fuegos grandes</li>
          <li>❌ No llamar a los bomberos si hay dudas</li>
        </ul>

        <h3>Capacitación Práctica</h3>
        <p>Recomendamos realizar prácticas con fuego real al menos una vez al año. Contacta a ZD Matafuegos para coordinar capacitaciones en tu empresa.</p>
      `,
    },
    {
      id: 4,
      titulo: 'Prevención de Incendios',
      categoria: 'Prevención',
      contenido: `
        <h2>Guía de Prevención de Incendios en el Hogar y Empresa</h2>
        
        <h3>El Triángulo del Fuego</h3>
        <p>Para que exista fuego se necesitan tres elementos:</p>
        <ul>
          <li><strong>Combustible:</strong> Material que puede arder</li>
          <li><strong>Oxígeno:</strong> Del aire (21%)</li>
          <li><strong>Calor:</strong> Fuente de ignición</li>
        </ul>
        <p><strong>Prevención = Eliminar uno de estos elementos</strong></p>

        <h3>Prevención en el Hogar</h3>
        
        <h4>Cocina (Mayor causa de incendios domésticos)</h4>
        <ul>
          <li>✅ Nunca dejes la cocina desatendida mientras cocinas</li>
          <li>✅ Mantén materiales inflamables alejados de la hornalla</li>
          <li>✅ Limpia regularmente campanas y filtros de grasa</li>
          <li>✅ Ten un extintor clase K o ABC cerca</li>
          <li>❌ Nunca uses agua en fuegos de aceite</li>
        </ul>

        <h4>Instalación Eléctrica</h4>
        <ul>
          <li>✅ Revisa cables deteriorados o pelados</li>
          <li>✅ No sobrecargues enchufes con "triples"</li>
          <li>✅ Desenchufa electrodomésticos que no uses</li>
          <li>✅ Instala disyuntores diferenciales</li>
          <li>✅ Contrata electricista matriculado para reparaciones</li>
          <li>❌ Nunca uses cables dañados</li>
        </ul>

        <h3>Prevención en Empresas</h3>
        
        <h4>Plan de Prevención</h4>
        <ul>
          <li>Evaluación de riesgos específicos</li>
          <li>Identificación de materiales peligrosos</li>
          <li>Cálculo de carga de fuego</li>
          <li>Señalización de vías de evacuación</li>
          <li>Iluminación de emergencia</li>
        </ul>

        <h3>Detectores de Humo</h3>
        <p><strong>Instalación recomendada:</strong></p>
        <ul>
          <li>Uno por cada dormitorio</li>
          <li>Uno en cada piso</li>
          <li>Uno en pasillos</li>
          <li>En el techo o pared alta (el humo sube)</li>
        </ul>

        <h3>Qué hacer en caso de incendio</h3>
        <ul>
          <li><strong>Mantén la calma</strong></li>
          <li><strong>Activa la alarma</strong> si hay</li>
          <li><strong>Llama al 100</strong></li>
          <li><strong>Evacua inmediatamente</strong></li>
          <li><strong>NO regreses</strong> por ningún motivo</li>
        </ul>
      `,
    },
  ];

  const handleDownload = async (titulo, contenido, formato) => {
    setGeneratingFile(true);
    setShowDownloadMenu(null);
    
    try {
      let success = false;
      
      switch(formato) {
        case 'pdf':
          success = await generatePDFFromHTML(titulo, contenido);
          break;
        case 'word':
          success = await generateWordDocument(titulo, contenido);
          break;
        case 'csv':
          success = generateCSV(titulo, contenido);
          break;
        default:
          success = false;
      }
      
      if (success) {
        alert(`✅ Archivo ${formato.toUpperCase()} descargado exitosamente`);
      } else {
        alert('❌ Error al generar el archivo');
      }
    } catch (error) {
      console.error('Error al generar archivo:', error);
      alert('❌ Error al generar el archivo. Por favor intenta nuevamente.');
    } finally {
      setGeneratingFile(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#e5e7eb', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 32px', flex: 1 }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            backgroundColor: '#374151',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            marginBottom: '32px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#374151'}
        >
          <ArrowLeft size={20} /> Volver
        </button>

        <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
          Centro de Conocimiento
        </h1>
        <p style={{ fontSize: '20px', color: '#6b7280', marginBottom: '48px' }}>
          Lee la información completa y descarga en el formato que prefieras
        </p>

        {generatingFile && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '40px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <FileText size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Generando archivo...</h3>
              <p style={{ color: '#6b7280' }}>Por favor espera un momento</p>
            </div>
          </div>
        )}

        <div style={{
          display: 'grid',
          gap: '24px'
        }}>
          {recursos.map((recurso) => (
            <div
              key={recurso.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Header de la tarjeta */}
              <div
                onClick={() => setExpandedCard(expandedCard === recurso.id ? null : recurso.id)}
                style={{
                  padding: '24px 32px',
                  backgroundColor: '#f9fafb',
                  borderBottom: '2px solid #e5e7eb',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              >
                <div>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginBottom: '8px'
                  }}>
                    {recurso.categoria}
                  </span>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                    {recurso.titulo}
                  </h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Menú desplegable de descargas */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDownloadMenu(showDownloadMenu === recurso.id ? null : recurso.id);
                      }}
                      disabled={generatingFile}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        backgroundColor: generatingFile ? '#9ca3af' : '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: generatingFile ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        if (!generatingFile) {
                          e.currentTarget.style.backgroundColor = '#dc2626';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!generatingFile) {
                          e.currentTarget.style.backgroundColor = '#ef4444';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      <Download size={18} /> Descargar
                      <ChevronDown size={16} />
                    </button>

                    {/* Menú de opciones */}
                    {showDownloadMenu === recurso.id && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '8px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 10,
                        minWidth: '180px',
                        overflow: 'hidden',
                        animation: 'fadeIn 0.2s ease'
                      }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(recurso.titulo, recurso.contenido, 'pdf');
                          }}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: '#374151',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          📄 Descargar PDF
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(recurso.titulo, recurso.contenido, 'word');
                          }}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: '#374151',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          📝 Descargar Word
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(recurso.titulo, recurso.contenido, 'csv');
                          }}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: '#374151',
                            transition: 'background-color 0.2s ease',
                            borderTop: '1px solid #e5e7eb'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          📊 Descargar CSV
                        </button>
                      </div>
                    )}
                  </div>

                  {expandedCard === recurso.id ? (
                    <ChevronUp size={28} color="#6b7280" />
                  ) : (
                    <ChevronDown size={28} color="#6b7280" />
                  )}
                </div>
              </div>

              {/* Contenido expandible */}
              {expandedCard === recurso.id && (
                <div style={{
                  padding: '32px',
                  animation: 'fadeIn 0.3s ease'
                }}>
                  <div 
                    style={{
                      fontSize: '16px',
                      lineHeight: '1.8',
                      color: '#374151'
                    }}
                    dangerouslySetInnerHTML={{ __html: recurso.contenido }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Nota informativa */}
        <div style={{
          marginTop: '48px',
          padding: '24px',
          backgroundColor: '#dbeafe',
          border: '2px solid #3b82f6',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '16px', color: '#1e40af', marginBottom: '8px' }}>
            <strong>¿Necesitas capacitación presencial?</strong>
          </p>
          <p style={{ fontSize: '14px', color: '#1e40af' }}>
            Ofrecemos cursos prácticos con fuego real para empresas y organizaciones.
            Contáctanos para más información.
          </p>
        </div>
      </main>
      <Footer />

      {/* CSS para animaciones */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        h2 {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
          margin-top: 24px;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 3px solid #ef4444;
        }

        h3 {
          font-size: 22px;
          font-weight: bold;
          color: #374151;
          margin-top: 24px;
          margin-bottom: 12px;
        }

        h4 {
          font-size: 18px;
          font-weight: bold;
          color: #4b5563;
          margin-top: 16px;
          margin-bottom: 8px;
        }

        ul {
          margin-left: 24px;
          margin-bottom: 16px;
        }

        ol {
          margin-left: 24px;
          margin-bottom: 16px;
        }

        li {
          margin-bottom: 8px;
          line-height: 1.6;
        }

        p {
          margin-bottom: 16px;
        }

        strong {
          color: #1f2937;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default CentroConocimiento;
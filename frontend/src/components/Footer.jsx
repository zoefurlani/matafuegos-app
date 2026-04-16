import { MapPin, Phone, Mail, Clock, ArrowUp, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function ScrollToTopButton() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <>
      <button onClick={scrollToTop} className="scroll-top-btn">
        <svg className="progress-ring" width="56" height="56">
          <circle
            className="progress-ring-circle"
            stroke="#ef4444"
            strokeWidth="3"
            fill="transparent"
            r="24"
            cx="28"
            cy="28"
            style={{
              strokeDasharray: `${2 * Math.PI * 24}`,
              strokeDashoffset: `${2 * Math.PI * 24 * (1 - scrollProgress / 100)}`
            }}
          />
        </svg>
        <ArrowUp color="white" size={24} className="arrow-icon" />
      </button>

      <style>{`
        .scroll-top-btn {
          position: fixed;
          bottom: 100px;
          right: 24px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: #1f2937;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
          transition: all 0.3s ease;
          z-index: 998;
          animation: slideInRight 0.3s ease-out;
        }

        .scroll-top-btn:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.6);
          background-color: #ef4444;
        }

        .progress-ring {
          position: absolute;
          top: 0;
          left: 0;
          transform: rotate(-90deg);
        }

        .progress-ring-circle {
          transition: stroke-dashoffset 0.3s ease;
        }

        .arrow-icon {
          position: relative;
          z-index: 1;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .scroll-top-btn {
            bottom: 80px;
            right: 16px;
            width: 48px;
            height: 48px;
          }

          .progress-ring {
            width: 48px;
            height: 48px;
          }

          .progress-ring circle {
            r: 20;
            cx: 24;
            cy: 24;
          }

          .arrow-icon {
            width: 20px;
            height: 20px;
          }
        }

        /* Mobile pequeño */
        @media (max-width: 480px) {
          .scroll-top-btn {
            bottom: 70px;
            right: 12px;
            width: 44px;
            height: 44px;
          }

          .progress-ring {
            width: 44px;
            height: 44px;
          }

          .progress-ring circle {
            r: 18;
            cx: 22;
            cy: 22;
          }

          .arrow-icon {
            width: 18px;
            height: 18px;
          }
        }
      `}</style>
    </>
  );
}

function Footer() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openModal(type) {
    setActiveModal(type);
  }

  function closeModal() {
    setActiveModal(null);
  }

  const currentYear = new Date().getFullYear();

  const footerStyle = {
    backgroundColor: colors.backgroundAlt,
    borderTop: '2px solid ' + colors.border,
    transition: 'all 0.3s ease'
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '64px 32px 32px'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '48px',
    marginBottom: '48px'
  };

  const linkStyle = {
    color: colors.textSecondary,
    textDecoration: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'inline-block'
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px'
  };

  const modalCardStyle = {
    backgroundColor: colors.backgroundAlt,
    borderRadius: '16px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '80vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    animation: 'modalSlideIn 0.3s ease-out'
  };

  const links = [
    { label: 'Inicio', path: '/' },
    { label: 'Guía Técnica', path: '/guia-tecnica' },
    { label: 'Mantenimiento', path: '/mantenimiento' },
    { label: 'Manual del Usuario', path: '/manual-usuario' },
    { label: 'Ubicación', path: '/ubicacion' }
  ];

  const modalContent = {
    terms: {
      title: 'Términos y Condiciones',
      content: `
        <h3>1. Aceptación de Términos</h3>
        <p>Al utilizar nuestros servicios, usted acepta estos términos y condiciones en su totalidad.</p>
        
        <h3>2. Servicios Ofrecidos</h3>
        <p>ZD Matafuegos ofrece servicios de venta, recarga, mantenimiento y capacitación en equipos contra incendios.</p>
        
        <h3>3. Responsabilidades del Cliente</h3>
        <p>El cliente debe proporcionar información precisa sobre sus necesidades y mantener los equipos según las recomendaciones.</p>
        
        <h3>4. Garantías</h3>
        <p>Todos nuestros productos y servicios cuentan con garantía según las normativas vigentes y especificaciones del fabricante.</p>
        
        <h3>5. Limitaciones de Responsabilidad</h3>
        <p>ZD Matafuegos no se responsabiliza por daños derivados del uso inadecuado de los equipos o falta de mantenimiento.</p>
        
        <h3>6. Modificaciones</h3>
        <p>Nos reservamos el derecho de modificar estos términos en cualquier momento.</p>
      `
    },
    privacy: {
      title: 'Política de Privacidad',
      content: `
        <h3>1. Información que Recopilamos</h3>
        <p>Recopilamos información de contacto necesaria para brindar nuestros servicios: nombre, teléfono, email y dirección.</p>
        
        <h3>2. Uso de la Información</h3>
        <p>Utilizamos su información para:</p>
        <ul>
          <li>Brindar nuestros servicios de mantenimiento y venta</li>
          <li>Enviar recordatorios de mantenimiento</li>
          <li>Comunicar ofertas y novedades (si usted lo autoriza)</li>
        </ul>
        
        <h3>3. Protección de Datos</h3>
        <p>Implementamos medidas de seguridad para proteger su información personal.</p>
        
        <h3>4. Compartir Información</h3>
        <p>No compartimos su información personal con terceros sin su consentimiento.</p>
        
        <h3>5. Sus Derechos</h3>
        <p>Usted tiene derecho a acceder, modificar o eliminar su información personal en cualquier momento.</p>
        
        <h3>6. Contacto</h3>
        <p>Para consultas sobre privacidad, contacte a: zdmatafuegos@gmail.com</p>
      `
    },
    cookies: {
      title: 'Política de Cookies',
      content: `
        <h3>1. ¿Qué son las Cookies?</h3>
        <p>Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita nuestro sitio web.</p>
        
        <h3>2. Cookies que Utilizamos</h3>
        <p><strong>Cookies Esenciales:</strong> Necesarias para el funcionamiento básico del sitio (modo oscuro/claro, preferencias).</p>
        <p><strong>Cookies de Rendimiento:</strong> Nos ayudan a entender cómo los visitantes usan nuestro sitio.</p>
        
        <h3>3. Cookies de Terceros</h3>
        <p>No utilizamos cookies de terceros para publicidad o seguimiento.</p>
        
        <h3>4. Control de Cookies</h3>
        <p>Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad del sitio.</p>
        
        <h3>5. Duración</h3>
        <p>Las cookies esenciales se mantienen hasta que usted las elimine. Las de rendimiento expiran en 30 días.</p>
        
        <h3>6. Actualizaciones</h3>
        <p>Esta política puede actualizarse periódicamente. La fecha de última modificación aparecerá al inicio.</p>
      `
    }
  };

  return (
    <>
      <footer style={footerStyle}>
        <div style={containerStyle} className="footer-container">
          <div style={gridStyle} className="footer-grid">
            {/* Columna 1: Info empresa */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }} className="footer-logo-section">
                <img 
                  src="/logoof.png" 
                  alt="ZD Matafuegos" 
                  style={{ height: '50px', filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.4))' }}
                  className="footer-logo"
                />
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: colors.text, margin: 0 }} className="footer-title">
                    ZD MATAFUEGOS
                  </h3>
                  <p style={{ fontSize: '12px', color: '#ef4444', margin: 0, fontWeight: '600' }} className="footer-subtitle">
                    Tu seguridad, nuestra prioridad
                  </p>
                </div>
              </div>
            </div>

            {/* Columna 2: Enlaces */}
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: colors.text, marginBottom: '20px' }} className="footer-section-title">
                Enlaces Rápidos
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {links.map(function(link) {
                  return (
                    <li key={link.path} style={{ marginBottom: '12px' }}>
                      <a 
                        onClick={function() { navigate(link.path); scrollToTop(); }} 
                        style={linkStyle}
                        onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                        onMouseOut={(e) => e.currentTarget.style.color = colors.textSecondary}
                      >
                        → {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Columna 3: Contacto */}
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: colors.text, marginBottom: '20px' }} className="footer-section-title">
                Contacto
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <MapPin size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ color: colors.text, fontSize: '14px', margin: 0, fontWeight: '600' }}>Dirección</p>
                    <p style={{ color: colors.textSecondary, fontSize: '14px', margin: '4px 0 0 0' }}>25 de Mayo N°1675</p>
                    <p style={{ color: colors.textSecondary, fontSize: '14px', margin: '2px 0 0 0' }}>Romang, Santa Fe (3555)</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Phone size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ color: colors.text, fontSize: '14px', margin: 0, fontWeight: '600' }}>Teléfono / WhatsApp</p>
                    <a 
                      href="tel:+5493482445650" 
                      style={{ color: colors.textSecondary, fontSize: '14px', margin: '4px 0 0 0', textDecoration: 'none', display: 'block' }}
                      onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                      onMouseOut={(e) => e.currentTarget.style.color = colors.textSecondary}
                    >
                      +54 9 3482 44-5650
                    </a>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Mail size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ color: colors.text, fontSize: '14px', margin: 0, fontWeight: '600' }}>Email</p>
                    <a 
                      href="mailto:zdmatafuegos@gmail.com" 
                      style={{ color: colors.textSecondary, fontSize: '14px', margin: '4px 0 0 0', textDecoration: 'none', display: 'block' }}
                      onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                      onMouseOut={(e) => e.currentTarget.style.color = colors.textSecondary}
                    >
                      zdmatafuegos@gmail.com
                    </a>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Clock size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ color: colors.text, fontSize: '14px', margin: 0, fontWeight: '600' }}>Horarios</p>
                    <p style={{ color: colors.textSecondary, fontSize: '14px', margin: '4px 0 0 0' }}>
                      Lunes a Sábado
                    </p>
                    <p style={{ color: colors.textSecondary, fontSize: '14px', margin: '2px 0 0 0' }}>
                      9:00 - 13:00 | 16:00 - 20:00
                    </p>
                    <p style={{ color: '#ef4444', fontSize: '14px', margin: '4px 0 0 0', fontWeight: '600' }}>
                      Domingo: Cerrado
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: colors.border, margin: '32px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }} className="footer-bottom">
            <div style={{ color: colors.textSecondary, fontSize: '14px' }} className="footer-copyright">
              © {currentYear} ZD Matafuegos. Todos los derechos reservados.
            </div>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }} className="footer-legal-links">
              <a 
                onClick={function() { openModal('terms'); }} 
                style={{ color: colors.textSecondary, fontSize: '14px', textDecoration: 'none', cursor: 'pointer' }}
                onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                onMouseOut={(e) => e.currentTarget.style.color = colors.textSecondary}
              >
                Términos y Condiciones
              </a>
              <a 
                onClick={function() { openModal('privacy'); }} 
                style={{ color: colors.textSecondary, fontSize: '14px', textDecoration: 'none', cursor: 'pointer' }}
                onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                onMouseOut={(e) => e.currentTarget.style.color = colors.textSecondary}
              >
                Política de Privacidad
              </a>
              <a 
                onClick={function() { openModal('cookies'); }} 
                style={{ color: colors.textSecondary, fontSize: '14px', textDecoration: 'none', cursor: 'pointer' }}
                onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                onMouseOut={(e) => e.currentTarget.style.color = colors.textSecondary}
              >
                Política de Cookies
              </a>
            </div>
          </div>
        </div>

        <ScrollToTopButton />
      </footer>

      {/* Modal */}
      {activeModal && (
        <div style={modalOverlayStyle} onClick={closeModal}>
          <div style={modalCardStyle} onClick={function(e) { e.stopPropagation(); }} className="modal-content">
            <div style={{ padding: '24px', borderBottom: '2px solid ' + colors.border, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="modal-header">
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.text, margin: 0 }} className="modal-title">
                {modalContent[activeModal].title}
              </h2>
              <button 
                onClick={closeModal} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <X size={24} color={colors.text} />
              </button>
            </div>
            <div 
              style={{ padding: '24px', color: colors.text, lineHeight: '1.8' }} 
              className="modal-body"
              dangerouslySetInnerHTML={{ __html: modalContent[activeModal].content }} 
            />
            <div style={{ padding: '24px', borderTop: '1px solid ' + colors.border, textAlign: 'right' }} className="modal-footer">
              <button 
                onClick={closeModal} 
                style={{ padding: '12px 24px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Tablet y Mobile - Grid a 1 columna */
        @media (max-width: 768px) {
          .footer-container {
            padding: 48px 24px 24px !important;
          }

          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }

          .footer-bottom {
            flex-direction: column !important;
            text-align: center !important;
          }

          .footer-legal-links {
            justify-content: center !important;
            gap: 16px !important;
          }

          .modal-content {
            max-width: 95% !important;
          }

          .modal-header {
            padding: 16px !important;
          }

          .modal-title {
            font-size: 20px !important;
          }

          .modal-body {
            padding: 20px 16px !important;
          }

          .modal-footer {
            padding: 16px !important;
          }
        }

        /* Mobile pequeño */
        @media (max-width: 480px) {
          .footer-container {
            padding: 32px 16px 20px !important;
          }

          .footer-grid {
            gap: 24px !important;
          }

          .footer-logo {
            height: 40px !important;
          }

          .footer-title {
            font-size: 18px !important;
          }

          .footer-subtitle {
            font-size: 10px !important;
          }

          .footer-section-title {
            font-size: 16px !important;
            margin-bottom: 16px !important;
          }

          .footer-copyright {
            font-size: 12px !important;
          }

          .footer-legal-links {
            flex-direction: column !important;
            gap: 12px !important;
            align-items: center !important;
          }

          .footer-legal-links a {
            font-size: 12px !important;
          }

          .modal-title {
            font-size: 18px !important;
          }

          .modal-body {
            font-size: 14px !important;
            padding: 16px !important;
          }

          .modal-body h3 {
            font-size: 16px !important;
          }
        }
      `}</style>
    </>
  );
}

export default Footer;
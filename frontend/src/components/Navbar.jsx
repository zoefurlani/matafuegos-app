import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Mail } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme, colors } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const menuItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Guía Técnica', path: '/guia-tecnica' },
    { label: 'Mantenimiento', path: '/mantenimiento' },
    { label: 'Manual de Usuario', path: '/manual-usuario' },
    { label: 'Ubicación', path: '/ubicacion' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: isScrolled ? colors.navbarScrolled : colors.navbar,
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        boxShadow: isScrolled ? colors.shadow : 'none',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px'
        }} className="navbar-container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '80px'
          }}>
            <div 
              onClick={() => handleNavigation('/')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}
              className="logo-container"
            >
              <img 
                src="/logoof.png"
                alt="ZD Matafuegos" 
                style={{
                  height: '55px',
                  width: 'auto'
                }}
                className="logo-img"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <h1 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: colors.text,
                  margin: 0,
                  letterSpacing: '0.5px',
                  transition: 'color 0.3s ease',
                  lineHeight: 1
                }} className="logo-title">
                  ZD MATAFUEGOS
                </h1>
                <p style={{
                  fontSize: '10px',
                  color: '#ef4444',
                  margin: 0,
                  fontWeight: 'bold',
                  marginTop: '6px',
                  lineHeight: 1
                }} className="logo-subtitle">
                  Tu seguridad es nuestra prioridad
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <div style={{
                display: 'none',
                gap: '4px'
              }} className="desktop-menu">
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: isActive(item.path) ? '#ef4444' : 'transparent',
                      color: isActive(item.path) ? 'white' : colors.text,
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseOver={(e) => {
                      if (!isActive(item.path)) {
                        e.currentTarget.style.backgroundColor = colors.hover;
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isActive(item.path)) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginLeft: '12px'
              }}>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=zdmatafuegos@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#ef4444',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none'
                  }}
                  className="contact-button"
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#ef4444';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  title="Enviar email a zdmatafuegos@gmail.com"
                >
                  <Mail size={24} color="white" />
                </a>

                <button
                  onClick={toggleTheme}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#fbbf24',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  className="theme-button"
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f59e0b';
                    e.currentTarget.style.transform = 'scale(1.1) rotate(15deg)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#fbbf24';
                    e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  }}
                >
                  {theme === 'light' ? (
                    <Moon size={24} color="white" />
                  ) : (
                    <Sun size={24} color="white" />
                  )}
                </button>

                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: colors.cardBg,
                    border: `2px solid ${colors.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  className="mobile-menu-button"
                >
                  {isMobileMenuOpen ? (
                    <X size={24} color={colors.text} />
                  ) : (
                    <Menu size={24} color={colors.text} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div style={{
        position: 'fixed',
        top: '80px',
        left: 0,
        right: 0,
        backgroundColor: colors.navbar,
        backdropFilter: 'blur(10px)',
        transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        zIndex: 999,
        maxHeight: 'calc(100vh - 80px)',
        overflowY: 'auto',
        boxShadow: isMobileMenuOpen ? colors.shadow : 'none'
      }}>
        <div style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              style={{
                padding: '16px',
                backgroundColor: isActive(item.path) ? '#ef4444' : colors.cardBg,
                color: isActive(item.path) ? 'white' : colors.text,
                border: `2px solid ${isActive(item.path) ? '#ef4444' : colors.border}`,
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left'
              }}
              onMouseOver={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.backgroundColor = colors.hover;
                }
              }}
              onMouseOut={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.backgroundColor = colors.cardBg;
                }
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        /* Por defecto: ocultar menú desktop, mostrar hamburguesa */
        .desktop-menu {
          display: none;
        }
        
        .mobile-menu-button {
          display: flex;
        }

        /* Desktop - Mostrar menú, ocultar hamburguesa */
        @media (min-width: 968px) {
          .desktop-menu {
            display: flex !important;
          }
          .mobile-menu-button {
            display: none !important;
          }
        }

        /* Mobile y Tablet - Ocultar menú desktop */
        @media (max-width: 967px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-button {
            display: flex !important;
          }
        }

        /* Mobile pequeño - Ajustes de logo y botones */
        @media (max-width: 480px) {
          .navbar-container {
            padding: 0 12px !important;
          }
          
          .logo-img {
            height: 40px !important;
          }
          
          .logo-title {
            font-size: 18px !important;
          }
          
          .logo-subtitle {
            font-size: 8px !important;
          }
          
          .contact-button,
          .theme-button,
          .mobile-menu-button {
            width: 40px !important;
            height: 40px !important;
          }
          
          .contact-button svg,
          .theme-button svg,
          .mobile-menu-button svg {
            width: 20px !important;
            height: 20px !important;
          }
        }

        /* Tablet - Reducir gap entre botones */
        @media (max-width: 768px) and (min-width: 481px) {
          .logo-container {
            gap: 8px !important;
          }
        }
      `}</style>
    </>
  );
}

export default Navbar;
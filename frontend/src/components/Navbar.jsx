import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Mail, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme, colors } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Centro de Conocimiento', path: '/centro-conocimiento' },
    { label: 'Mantenimiento', path: '/mantenimiento' },
    { label: 'Manual de Usuario', path: '/manual-usuario' },
    { label: 'Ubicación', path: '/ubicacion' },
    { label: 'Nuestra Historia', path: '/nuestra-historia' }
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
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '80px'
          }}>
            {/* Logo */}
            <div 
              onClick={() => handleNavigation('/')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}
            >
              <img 
                src="/logoof.png"
                alt="ZD Matafuegos" 
                style={{
                  height: '55px',
                  width: 'auto'
                }}
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
                }}>
                  ZD MATAFUEGOS
                </h1>
                <p style={{
                  fontSize: '10px',
                  color: '#ef4444',
                  margin: 0,
                  fontWeight: 'bold',
                  marginTop: '6px',
                  lineHeight: 1
                }}>
                  Tu seguridad es nuestra prioridad
                </p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {/* Menu Items - Hidden on mobile */}
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

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginLeft: '12px'
              }}>
                {/* Contact Button */}
                <button
                  onClick={() => window.location.href = 'mailto:zdmatafuegos1@gmail.com'}
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
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#ef4444';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <Mail size={24} color="white" />
                </button>

                {/* Theme Toggle */}
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

                {/* User/Admin Button con indicador de sesión */}
                <button
                  onClick={() => navigate(isAuthenticated ? '/admin/dashboard' : '/login')}
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
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#ef4444';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <User size={24} color="white" />
                  {/* Indicador verde si está autenticado */}
                  {isAuthenticated && (
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#10b981',
                      borderRadius: '50%',
                      border: '2px solid white',
                      boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)'
                    }} />
                  )}
                </button>

                {/* Mobile Menu Button */}
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

      {/* Mobile Menu */}
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

      {/* CSS for responsive menu */}
      <style>{`
        @media (min-width: 968px) {
          .desktop-menu {
            display: flex !important;
          }
          .mobile-menu-button {
            display: none !important;
          }
        }

        @media (max-width: 967px) {
          .desktop-menu {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

export default Navbar;
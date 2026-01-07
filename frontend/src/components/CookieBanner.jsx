import { useState, useEffect } from 'react';
import { X, Cookie, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

function CookieBanner() {
  const { colors } = useTheme();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  function acceptAll() {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true
    };
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setShowBanner(false);
  }

  function rejectAll() {
    const onlyEssential = {
      essential: true,
      analytics: false,
      marketing: false
    };
    localStorage.setItem('cookieConsent', JSON.stringify(onlyEssential));
    setShowBanner(false);
  }

  function savePreferences() {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    setShowBanner(false);
    setShowSettings(false);
  }

  if (!showBanner) return null;

  const bannerStyle = {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    right: '20px',
    maxWidth: '500px',
    backgroundColor: colors.backgroundAlt,
    border: '2px solid ' + colors.border,
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    zIndex: 10000,
    animation: 'slideUp 0.4s ease-out',
    overflow: 'hidden'
  };

  const settingsModalStyle = {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    right: '20px',
    maxWidth: '600px',
    backgroundColor: colors.backgroundAlt,
    border: '2px solid ' + colors.border,
    borderRadius: '16px',
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4)',
    zIndex: 10001,
    animation: 'slideUp 0.4s ease-out',
    maxHeight: '80vh',
    overflow: 'auto'
  };

  if (showSettings) {
    return (
      <>
        <div style={settingsModalStyle}>
          <div style={{ padding: '24px', borderBottom: '2px solid ' + colors.border, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Settings size={24} color="#ef4444" />
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: colors.text, margin: 0 }}>
                Configuración de Cookies
              </h3>
            </div>
            <button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
              <X size={24} color={colors.text} />
            </button>
          </div>

          <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: colors.text, margin: '0 0 4px 0' }}>
                    🔒 Cookies Esenciales
                  </h4>
                  <p style={{ fontSize: '13px', color: colors.textSecondary, margin: 0 }}>
                    Necesarias para el funcionamiento básico del sitio (modo oscuro, preferencias).
                  </p>
                </div>
                <div style={{
                  padding: '6px 12px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  SIEMPRE ACTIVAS
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: colors.text, margin: '0 0 4px 0' }}>
                    📊 Cookies de Análisis
                  </h4>
                  <p style={{ fontSize: '13px', color: colors.textSecondary, margin: 0 }}>
                    Nos ayudan a entender cómo usas el sitio para mejorarlo (Google Analytics).
                  </p>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px', marginLeft: '16px', flexShrink: 0 }}>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: preferences.analytics ? '#ef4444' : '#9ca3af',
                    transition: '0.4s',
                    borderRadius: '26px'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '',
                      height: '20px',
                      width: '20px',
                      left: preferences.analytics ? '27px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      transition: '0.4s',
                      borderRadius: '50%'
                    }} />
                  </span>
                </label>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: colors.text, margin: '0 0 4px 0' }}>
                    🎯 Cookies de Marketing
                  </h4>
                  <p style={{ fontSize: '13px', color: colors.textSecondary, margin: 0 }}>
                    Usadas para mostrarte contenido relevante (actualmente no las usamos).
                  </p>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px', marginLeft: '16px', flexShrink: 0 }}>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: preferences.marketing ? '#ef4444' : '#9ca3af',
                    transition: '0.4s',
                    borderRadius: '26px'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '',
                      height: '20px',
                      width: '20px',
                      left: preferences.marketing ? '27px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      transition: '0.4s',
                      borderRadius: '50%'
                    }} />
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div style={{ padding: '24px', borderTop: '1px solid ' + colors.border, display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowSettings(false)}
              style={{
                padding: '12px 24px',
                backgroundColor: 'transparent',
                color: colors.text,
                border: '2px solid ' + colors.border,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              onClick={savePreferences}
              style={{
                padding: '12px 24px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Guardar Preferencias
            </button>
          </div>
        </div>

        <style>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(50px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 768px) {
            label {
              transform: scale(0.9);
            }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <div style={bannerStyle}>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
            <Cookie size={32} color="#ef4444" style={{ flexShrink: 0 }} />
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: colors.text, margin: '0 0 8px 0' }}>
                Este sitio usa cookies 🍪
              </h3>
              <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0, lineHeight: '1.6' }}>
                Utilizamos cookies esenciales para mejorar tu experiencia. Puedes aceptar todas o configurar tus preferencias.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowSettings(true)}
              style={{
                flex: '1 1 auto',
                padding: '12px 16px',
                backgroundColor: 'transparent',
                color: colors.text,
                border: '2px solid ' + colors.border,
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
              }}
            >
              ⚙️ Configurar
            </button>
            <button
              onClick={rejectAll}
              style={{
                flex: '1 1 auto',
                padding: '12px 16px',
                backgroundColor: colors.background,
                color: colors.text,
                border: '2px solid ' + colors.border,
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
              }}
            >
              Rechazar
            </button>
            <button
              onClick={acceptAll}
              style={{
                flex: '1 1 auto',
                padding: '12px 16px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
              }}
            >
              ✓ Aceptar Todo
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 600px) {
          div[style*="maxWidth: 500px"] {
            left: 10px !important;
            right: 10px !important;
            bottom: 10px !important;
          }
        }
      `}</style>
    </>
  );
}

export default CookieBanner;
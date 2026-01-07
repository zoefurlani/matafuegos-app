import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [particles, setParticles] = useState([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Generar partículas de fuego
  useEffect(() => {
    const particleCount = 40;
    const newParticles = [];
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
        size: 4 + Math.random() * 8
      });
    }
    
    setParticles(newParticles);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = login(username, password);
      
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Usuario o contraseña incorrectos');
        setPassword('');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0a0a0a',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Efecto de fuego con partículas */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 1
      }}>
        {/* Gradiente de fuego de fondo */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60%',
          background: 'radial-gradient(ellipse at bottom, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.08) 30%, transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite'
        }} />

        {/* Partículas de fuego */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              bottom: '-20px',
              left: `${particle.x}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(255, 100, 50, 0.8) 0%, rgba(239, 68, 68, 0.4) 50%, transparent 100%)`,
              animation: `float ${particle.duration}s ease-in infinite`,
              animationDelay: `${particle.delay}s`,
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.6)',
              filter: 'blur(1px)'
            }}
          />
        ))}

        {/* Ondas de calor */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '150%',
          height: '100%',
          background: 'radial-gradient(ellipse at bottom, rgba(239, 68, 68, 0.05) 0%, transparent 50%)',
          animation: 'wave 8s ease-in-out infinite'
        }} />
      </div>

      {/* Login Card */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: 'rgba(31, 41, 55, 0.95)',
        padding: '48px 40px',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 100px rgba(239, 68, 68, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(239, 68, 68, 0.1)',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 20px',
            backgroundColor: '#ef4444',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4), 0 0 40px rgba(239, 68, 68, 0.2)',
            animation: 'glow 2s ease-in-out infinite'
          }}>
            <Lock size={40} color="white" />
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '8px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            Panel de Administración
          </h1>
          <p style={{
            color: '#9ca3af',
            fontSize: '14px'
          }}>
            ZD Matafuegos - Acceso Restringido
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(127, 29, 29, 0.9)',
            border: '2px solid #ef4444',
            padding: '14px 16px',
            borderRadius: '8px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'shake 0.5s, fadeIn 0.3s'
          }}>
            <AlertCircle size={20} color="#ef4444" />
            <span style={{ color: '#fca5a5', fontSize: '14px', fontWeight: '500' }}>
              {error}
            </span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#d1d5db',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              Usuario
            </label>
            <div style={{ position: 'relative' }}>
              <User 
                size={20} 
                color="#6b7280" 
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1
                }}
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="Ingresá tu usuario"
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 48px',
                  backgroundColor: 'rgba(55, 65, 81, 0.8)',
                  border: '2px solid #4b5563',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#ef4444';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#4b5563';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#d1d5db',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <Lock 
                size={20} 
                color="#6b7280" 
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1
                }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Ingresá tu contraseña"
                style={{
                  width: '100%',
                  padding: '14px 48px 14px 48px',
                  backgroundColor: 'rgba(55, 65, 81, 0.8)',
                  border: '2px solid #4b5563',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#ef4444';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#4b5563';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  zIndex: 1
                }}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#6b7280" />
                ) : (
                  <Eye size={20} color="#6b7280" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: loading ? '#6b7280' : '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(239, 68, 68, 0.4)'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#dc2626';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.5)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#ef4444';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
              }
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '3px solid rgba(255,255,255,0.3)',
                  borderTop: '3px solid white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                Verificando...
              </span>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        {/* Back to Home */}
        <div style={{
          textAlign: 'center',
          marginTop: '28px',
          paddingTop: '28px',
          borderTop: '1px solid rgba(55, 65, 81, 0.8)'
        }}>
          <a 
            href="/"
            style={{
              color: '#9ca3af',
              fontSize: '14px',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              fontWeight: '500'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
            onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
          >
            ← Volver al sitio público
          </a>
        </div>
      </div>

      {/* Animaciones CSS */}
      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px) scale(0);
            opacity: 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes wave {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(-20px);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4), 0 0 40px rgba(239, 68, 68, 0.2);
          }
          50% {
            box-shadow: 0 8px 32px rgba(239, 68, 68, 0.6), 0 0 60px rgba(239, 68, 68, 0.3);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default LoginPage;
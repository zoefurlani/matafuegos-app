import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  RefreshCw, 
  LogOut,
  Menu,
  X,
  Flame,
  Shield,
  ShoppingCart,
  FileText,
  BookOpen
} from 'lucide-react';

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin-zd-m8k3x7p2/dashboard' },
    { icon: Users, label: 'Clientes', path: '/admin-zd-m8k3x7p2/clientes' },
    { icon: Flame, label: 'Extintores', path: '/admin-zd-m8k3x7p2/extintores' },
    { icon: RefreshCw, label: 'Recargas', path: '/admin-zd-m8k3x7p2/recargas' },
    { icon: ShoppingCart, label: 'Ventas', path: '/admin-zd-m8k3x7p2/ventas' },
    { icon: FileText, label: 'Comprobantes', path: '/admin-zd-m8k3x7p2/comprobantes' },
    { icon: BookOpen, label: 'Recursos Educativos', path: '/admin-zd-m8k3x7p2/recursos-educativos' },
    { icon: Package, label: 'Inventario', path: '/admin-zd-m8k3x7p2/inventario' }
  ];

  const usuariosItem = { 
    icon: Shield, 
    label: 'Usuarios', 
    path: '/admin-zd-m8k3x7p2/usuarios',
    onlySuperAdmin: true
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f3f4f6'
    }}>
      {/* SIDEBAR */}
      <aside style={{
        width: sidebarOpen ? '280px' : '80px',
        backgroundColor: '#1f2937',
        transition: 'width 0.3s ease',
        position: 'fixed',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        boxShadow: '4px 0 12px rgba(0,0,0,0.1)'
      }}>
        {/* HEADER */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #374151',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          {sidebarOpen && (
            <div>
              <h1 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white',
                margin: 0
              }}>
                ZD Matafuegos
              </h1>
              <p style={{
                fontSize: '12px',
                color: '#9ca3af',
                margin: '4px 0 0 0'
              }}>
                Panel de Administración
              </p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: '#374151',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#374151'}
          >
            {sidebarOpen ? (
              <X size={20} color="white" />
            ) : (
              <Menu size={20} color="white" />
            )}
          </button>
        </div>
        
        {/* NAVEGACIÓN CON SCROLL */}
        <nav style={{ 
          padding: '16px',
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  marginBottom: '8px',
                  backgroundColor: active ? '#ef4444' : 'transparent',
                  color: active ? 'white' : '#d1d5db',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: active ? 'bold' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left'
                }}
                onMouseOver={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = '#374151';
                }}
                onMouseOut={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
          
          {user?.rol === 'super_admin' && (
            <>
              {sidebarOpen && (
                <div style={{
                  height: '1px',
                  backgroundColor: '#374151',
                  margin: '16px 0'
                }}></div>
              )}
              
              <button
                onClick={() => navigate(usuariosItem.path)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  marginBottom: '8px',
                  backgroundColor: isActive(usuariosItem.path) ? '#ef4444' : 'transparent',
                  color: isActive(usuariosItem.path) ? 'white' : '#d1d5db',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: isActive(usuariosItem.path) ? 'bold' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left'
                }}
                onMouseOver={(e) => {
                  if (!isActive(usuariosItem.path)) e.currentTarget.style.backgroundColor = '#374151';
                }}
                onMouseOut={(e) => {
                  if (!isActive(usuariosItem.path)) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <usuariosItem.icon size={20} />
                {sidebarOpen && <span>{usuariosItem.label}</span>}
              </button>
            </>
          )}
        </nav>
        
        {/* FOOTER FIJO AL FONDO */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid #374151',
          backgroundColor: '#1f2937',
          flexShrink: 0
        }}>
          {sidebarOpen && (
            <div style={{
              padding: '12px',
              backgroundColor: '#374151',
              borderRadius: '8px',
              marginBottom: '12px'
            }}>
              <p style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: 'white',
                margin: 0
              }}>
                {user?.username}
              </p>
              <p style={{
                fontSize: '12px',
                color: '#9ca3af',
                margin: '4px 0 0 0'
              }}>
                {user?.rol === 'super_admin' ? 'Super Admin' :
                  user?.rol === 'admin' ? 'Administrador' :
                  'Usuario'}
              </p>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              backgroundColor: '#7f1d1d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#991b1b';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#7f1d1d';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>
      
      {/* CONTENIDO PRINCIPAL */}
      <main style={{
        marginLeft: sidebarOpen ? '280px' : '80px',
        width: sidebarOpen ? 'calc(100% - 280px)' : 'calc(100% - 80px)',
        transition: 'all 0.3s ease',
        minHeight: '100vh',
        padding: '32px',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {children}
        </div>
      </main>

      {/* ESTILOS PARA SCROLLBAR NEGRA */}
      <style>{`
        aside::-webkit-scrollbar {
          width: 8px;
        }
        
        aside::-webkit-scrollbar-track {
          background: #1f2937;
        }
        
        aside::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 4px;
        }
        
        aside::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }

        /* Para Firefox */
        aside {
          scrollbar-width: thin;
          scrollbar-color: #374151 #1f2937;
        }
      `}</style>
    </div>
  );
}

export default AdminLayout;
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
  Flame
} from 'lucide-react';

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Clientes', path: '/admin/clientes' },
    { icon: Flame, label: 'Extintores', path: '/admin/extintores' },
    { icon: RefreshCw, label: 'Recargas', path: '/admin/recargas' },
    { icon: Package, label: 'Inventario', path: '/admin/inventario' }
  ];

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
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '280px' : '80px',
        backgroundColor: '#1f2937',
        transition: 'width 0.3s ease',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
        zIndex: 1000,
        boxShadow: '4px 0 12px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #374151',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
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

        {/* Menu Items */}
        <nav style={{ padding: '16px' }}>
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
        </nav>

        {/* User Info & Logout */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px',
          borderTop: '1px solid #374151',
          backgroundColor: '#1f2937'
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
                Administrador
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

      {/* Main Content */}
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
    </div>
  );
}

export default AdminLayout;
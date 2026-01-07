import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

function Breadcrumbs() {
  const navigate = useNavigate();
  const location = useLocation();
  const { colors } = useTheme();

  const routeNames = {
    '/': 'Inicio',
    '/centro-conocimiento': 'Centro de Conocimiento',
    '/mantenimiento': 'Mantenimiento',
    '/manual-usuario': 'Manual del Usuario',
    '/ubicacion': 'Ubicación',
    '/nuestra-historia': 'Nuestra Historia'
  };

  const currentPath = location.pathname;
  const currentName = routeNames[currentPath];

  if (currentPath === '/') return null;

  return (
    <div className="breadcrumbs-container">
      <div className="breadcrumbs-content">
        <button onClick={() => navigate('/')} className="breadcrumb-item home">
          <Home size={16} />
          <span>Inicio</span>
        </button>
        
        <ChevronRight size={16} className="breadcrumb-separator" />
        
        <span className="breadcrumb-item current">
          {currentName}
        </span>
      </div>

      <style>{`
        .breadcrumbs-container {
          background-color: ${colors.backgroundAlt};
          border-bottom: 1px solid ${colors.border};
          padding: 12px 0;
          margin-bottom: 32px;
          position: sticky;
          top: 70px;
          z-index: 40;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .breadcrumbs-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 32px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: ${colors.textSecondary};
          transition: all 0.3s ease;
        }

        .breadcrumb-item.home {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .breadcrumb-item.home:hover {
          background-color: ${colors.background};
          color: #ef4444;
        }

        .breadcrumb-item.current {
          color: ${colors.text};
          font-weight: 600;
        }

        .breadcrumb-separator {
          color: ${colors.border};
        }

        @media (max-width: 768px) {
          .breadcrumbs-container {
            top: 70px;
          }

          .breadcrumbs-content {
            padding: 0 16px;
          }

          .breadcrumb-item span {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}

export default Breadcrumbs;
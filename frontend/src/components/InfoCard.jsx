import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

function InfoCard({ title, description, image, link }) {
  const navigate = useNavigate();
  const { colors } = useTheme();

  return (
    <div 
      onClick={() => navigate(link)}
      style={{
        position: 'relative',
        height: '100%',
        minHeight: '250px',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: colors.shadow,
        transition: 'all 0.3s ease'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(239, 68, 68, 0.2)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = colors.shadow;
      }}
    >
      <img
        src={image}
        alt={title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '24px'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '8px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.9)',
          marginBottom: '16px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
        }}>
          {description}
        </p>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#eae4e4',
          fontSize: '14px',
          fontWeight: 'bold',
          backgroundColor: '#ef4444',
          padding: '8px 16px',
          borderRadius: '8px',
          width: 'fit-content'
        }}>
          Ver más <ArrowRight size={16} />
        </div>
      </div>
    </div>
  );
}

export default InfoCard;
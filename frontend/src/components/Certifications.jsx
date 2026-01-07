import { useTheme } from '../contexts/ThemeContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Award, Shield, CheckCircle } from 'lucide-react';

function Certifications() {
  const { colors } = useTheme();
  const [ref, isVisible] = useScrollAnimation(0.3);

  const certifications = [
    { 
      name: 'IRAM', 
      description: 'Normas Argentinas',
      icon: Award,
      color: '#ef4444'
    },
    { 
      name: 'ART', 
      description: 'Riesgos del Trabajo',
      icon: Shield,
      color: '#3b82f6'
    },
    { 
      name: 'ISO 9001', 
      description: 'Calidad Certificada',
      icon: CheckCircle,
      color: '#10b981'
    }
  ];

  const containerStyle = {
    marginBottom: '64px',
    transition: 'all 0.8s ease-out',
    overflow: 'hidden',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(50px)'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '48px'
  };

  const titleStyle = {
    fontSize: '36px',
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: '16px'
  };

  const subtitleStyle = {
    fontSize: '18px',
    color: colors.textSecondary
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '32px',
    maxWidth: '900px',
    margin: '0 auto'
  };

  return (
    <div ref={ref} style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Certificado por:</h2>
        <p style={subtitleStyle}>Trabajamos bajo los más altos estándares de calidad</p>
      </div>

      <div style={gridStyle}>
        {certifications.map((cert, index) => {
          const Icon = cert.icon;
          return (
            <div
              key={index}
              style={{
                textAlign: 'center',
                padding: '32px 24px',
                backgroundColor: colors.cardBg,
                border: '2px solid ' + colors.border,
                borderRadius: '16px',
                boxShadow: colors.shadow,
                transition: 'all 0.3s ease',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'scale(1)' : 'scale(0.8)',
                transitionDelay: (index * 0.2) + 's'
              }}
              onMouseOver={function(e) {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = cert.color;
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(239, 68, 68, 0.2)';
              }}
              onMouseOut={function(e) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = colors.border;
                e.currentTarget.style.boxShadow = colors.shadow;
              }}
            >
              <div style={{
                width: '100px',
                height: '100px',
                backgroundColor: colors.background,
                border: '3px solid ' + cert.color,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={function(e) {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.4)';
              }}
              onMouseOut={function(e) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <Icon size={48} color={cert.color} />
              </div>
              <h3 style={{
                fontSize: '22px',
                fontWeight: 'bold',
                color: colors.text,
                marginBottom: '8px'
              }}>
                {cert.name}
              </h3>
              <p style={{
                fontSize: '14px',
                color: colors.textSecondary,
                fontWeight: '600',
                margin: 0
              }}>
                {cert.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Certifications;
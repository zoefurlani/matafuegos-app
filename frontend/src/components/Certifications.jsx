import { useTheme } from '../contexts/ThemeContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Award } from 'lucide-react';

function Certifications() {
  const { colors } = useTheme();
  const [ref, isVisible] = useScrollAnimation(0.3);

  const certifications = [
    { 
      name: 'IRAM', 
      description: 'Normas Argentinas',
      icon: Award,
      color: '#ef4444'
    }
  ];

  const containerStyle = {
    marginBottom: '60px',
    transition: 'all 0.8s ease-out',
    overflow: 'hidden',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(50px)'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '40px'
  };

  const titleStyle = {
    fontSize: '40px',
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: '0' 
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '32px',
    maxWidth: '950px',
    margin: '0 auto'
  };
return (
  <div ref={ref} style={containerStyle}>
    <div style={headerStyle}>
      <h2 style={titleStyle}>Certificado por:</h2>
    </div>

    <div style={gridStyle}>
      {certifications.map((cert, index) => {
        const Icon = cert.icon;
        return (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              padding: '32px',
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
              flexShrink: 0,
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

            <div style={{ flex: 1 }}>
              <h3 style={{
                fontSize: '22px',
                fontWeight: 'bold',
                color: colors.text,
                marginBottom: '12px'
              }}>
                {cert.name}
              </h3>
              <p style={{
                fontSize: '14px',
                color: colors.textSecondary,
                lineHeight: '1.6',
                margin: 0
              }}>
                Las normas IRAM son estándares técnicos creados por el Instituto Argentino de Normalización y Certificación (IRAM) que establecen requisitos de calidad, seguridad y funcionamiento para productos, servicios y procesos en Argentina.
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
}

export default Certifications;
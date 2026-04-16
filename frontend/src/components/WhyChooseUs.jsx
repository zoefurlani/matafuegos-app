import { Shield, Award, Calendar, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

function WhyChooseUs() {
  const { colors } = useTheme();
  const [ref, isVisible] = useScrollAnimation(0.2);

  const reasons = [
    {
      icon: Award,
      title: 'Certificación IRAM',
      description: 'Trabajamos bajo las normativas vigentes y estándares de calidad'
    },
    {
      icon: Calendar,
      title: 'Desde 2018',
      description: '8 años de experiencia protegiendo hogares y empresas en la región'
    },
    {
      icon: Shield,
      title: 'Equipos Certificados',
      description: 'Cumplimos con todas las normativas IRAM para tu seguridad'
    },
    {
      icon: CheckCircle,
      title: 'Garantía Incluida',
      description: 'Respaldamos nuestro trabajo con garantía certificada'
    }
  ];

  return (
    <div 
      ref={ref}
      style={{ 
        marginBottom: '64px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
        transition: 'all 0.8s ease-out'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{ 
          fontSize: '36px', 
          fontWeight: 'bold', 
          color: colors.text,
          marginBottom: '16px',
          transition: 'color 0.3s ease'
        }}>
          ¿Por qué elegirnos?
        </h2>
        <p style={{ 
          fontSize: '18px', 
          color: colors.textSecondary,
          maxWidth: '600px',
          margin: '0 auto',
          transition: 'color 0.3s ease'
        }}>
          Compromiso y calidad en cada servicio
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px'
      }}>
        {reasons.map((reason, index) => {
          const Icon = reason.icon;
          return (
            <div
              key={index}
              style={{
                backgroundColor: colors.cardBg,
                padding: '32px',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: colors.shadow,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: '2px solid ' + colors.border,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: (index * 0.1) + 's'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(239, 68, 68, 0.2)';
                e.currentTarget.style.borderColor = '#ef4444';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = colors.shadow;
                e.currentTarget.style.borderColor = colors.border;
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#ef4444',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
              }}>
                <Icon size={32} color="white" />
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: colors.text,
                marginBottom: '12px',
                transition: 'color 0.3s ease'
              }}>
                {reason.title}
              </h3>
              <p style={{
                fontSize: '14px',
                color: colors.textSecondary,
                lineHeight: '1.6',
                transition: 'color 0.3s ease'
              }}>
                {reason.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WhyChooseUs;
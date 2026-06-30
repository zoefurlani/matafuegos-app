import { useTheme } from '../contexts/ThemeContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Phone, ClipboardCheck, Wrench, Award } from 'lucide-react';

function WorkProcess() {
  const { colors } = useTheme();
  const [ref, isVisible] = useScrollAnimation(0.2);

  const steps = [
    {
      number: '01',
      icon: Phone,
      title: 'Contacto Inicial',
      description: 'Nos contactás por teléfono, email o WhatsApp y coordinamos una visita.',
      color: '#ef4444'
    },
    {
      number: '02',
      icon: ClipboardCheck,
      title: 'Evaluación',
      description: 'Nuestro técnico evalúa tus necesidades y te brinda un presupuesto sin cargo.',
      color: '#f59e0b'
    },
    {
      number: '03',
      icon: Wrench,
      title: 'Servicio',
      description: 'Realizamos el trabajo con equipos de última generación y personal capacitado.',
      color: '#3b82f6'
    },
    {
      number: '04',
      icon: Award,
      title: 'Certificación',
      description: 'Entregamos certificado oficial firmado por técnico matriculado.',
      color: '#10b981'
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
      <div style={{
        textAlign: 'center',
        marginBottom: '48px'
      }}>
        <h2 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: colors.text,
          marginBottom: '16px'
        }}>
          ¿Cómo Trabajamos?
        </h2>
        <p style={{
          fontSize: '18px',
          color: colors.textSecondary,
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Nuestro proceso garantiza la mejor atención y resultados profesionales
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '32px',
        position: 'relative'
      }}>
        {/* Línea conectora en desktop */}
        <div className="process-line" style={{
          position: 'absolute',
          top: '80px',
          left: '15%',
          right: '15%',
          height: '4px',
          backgroundColor: colors.border,
          zIndex: 0
        }} />

        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={index}
              style={{
                position: 'relative',
                zIndex: 1,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'scale(1)' : 'scale(0.8)',
                transition: 'all 0.6s ease-out',
                transitionDelay: (index * 0.15) + 's'
              }}
            >
              {/* Número grande de fondo */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '20px',
                fontSize: '120px',
                fontWeight: 'bold',
                color: colors.border,
                opacity: 0.1,
                zIndex: 0,
                lineHeight: 1
              }}>
                {step.number}
              </div>

              <div style={{
                backgroundColor: colors.cardBg,
                padding: '32px 24px',
                borderRadius: '16px',
                border: '2px solid ' + colors.border,
                boxShadow: colors.shadow,
                transition: 'all 0.3s ease',
                position: 'relative',
                height: '100%'
              }}
              onMouseOver={function(e) {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = step.color;
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(239, 68, 68, 0.2)';
              }}
              onMouseOut={function(e) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = colors.border;
                e.currentTarget.style.boxShadow = colors.shadow;
              }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: step.color,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  transition: 'transform 0.3s ease'
                }}
                onMouseOver={function(e) {
                  e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                }}
                onMouseOut={function(e) {
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                }}
                >
                  <Icon size={40} color="white" />
                </div>

                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: colors.text,
                  marginBottom: '12px',
                  textAlign: 'center'
                }}>
                  {step.title}
                </h3>

                <p style={{
                  fontSize: '14px',
                  color: colors.textSecondary,
                  lineHeight: '1.6',
                  textAlign: 'center',
                  margin: 0
                }}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .process-line {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default WorkProcess;
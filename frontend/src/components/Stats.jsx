import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

function Stats() {
  const [ref, isVisible] = useScrollAnimation(0.3);
  const [counts, setCounts] = useState({ exp: 0, clients: 0, services: 0, certified: 0 });
  const { colors } = useTheme();

  const finalValues = {
    exp: 8,           // ⭐ Desde 2018
    clients: 1000,    // ⭐ 1000+ clientes
    services: 5000,   // ⭐ 5000+ servicios/recargas
    certified: 100    // ⭐ 100% Cumplimiento normativo
  };

  useEffect(() => {
    if (isVisible) {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;

      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        
        const progress = currentStep / steps;
        
        setCounts({
          exp: Math.floor(finalValues.exp * progress),
          clients: Math.floor(finalValues.clients * progress),
          services: Math.floor(finalValues.services * progress),
          certified: Math.floor(finalValues.certified * progress)
        });

        if (currentStep >= steps) {
          setCounts(finalValues);
          clearInterval(timer);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isVisible]);

  const statsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '32px',
    marginBottom: '64px',
    padding: '48px 32px',
    backgroundColor: colors.cardBg,
    border: '2px solid ' + colors.border,
    borderRadius: '16px',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
    transition: 'all 0.8s ease-out'
  };

  const statItemStyle = {
    textAlign: 'center'
  };

  const statNumberStyle = {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: '8px'
  };

  const statLabelStyle = {
    color: colors.textSecondary,
    fontSize: '16px'
  };

  return (
    <div ref={ref} style={statsContainerStyle}>
      <div style={statItemStyle}>
        <div style={statNumberStyle}>
          {counts.exp}+
        </div>
        <div style={statLabelStyle}>
          Años de Experiencia
        </div>
      </div>

      <div style={statItemStyle}>
        <div style={statNumberStyle}>
          {counts.clients.toLocaleString()}+
        </div>
        <div style={statLabelStyle}>
          Clientes Satisfechos
        </div>
      </div>

      <div style={statItemStyle}>
        <div style={statNumberStyle}>
          {counts.services.toLocaleString()}+
        </div>
        <div style={statLabelStyle}>
          Servicios Realizados
        </div>
      </div>

      <div style={statItemStyle}>
        <div style={statNumberStyle}>
          {counts.certified}%
        </div>
        <div style={statLabelStyle}>
          Cumplimiento Normativo
        </div>
      </div>
    </div>
  );
}

export default Stats;
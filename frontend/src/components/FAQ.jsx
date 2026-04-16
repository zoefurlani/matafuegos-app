import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

function FAQ() {
  const { colors } = useTheme();
  const [openIndex, setOpenIndex] = useState(null);
  const [ref, isVisible] = useScrollAnimation(0.2);

  // ⭐ Solo 3 preguntas
  const faqs = [
    {
      question: '¿Cada cuánto debo recargar mi matafuego?',
      answer: 'La recarga debe realizarse anualmente o cuando el manómetro indique baja presión. También es obligatoria después de cualquier uso, aunque sea parcial. El mantenimiento preventivo anual garantiza que el equipo funcione correctamente en caso de emergencia.'
    },
    {
      question: '¿Qué tipo de extintor necesito para mi negocio?',
      answer: 'Depende del tipo de actividad. Para oficinas se recomienda ABC, para cocinas K (grasa), para equipos electrónicos CO2, y para comercios generalmente ABC. Te asesoramos sin cargo para determinar el extintor más adecuado según las características de tu establecimiento.'
    },
    {
      question: '¿Cuál es la vida útil de un matafuego?',
      answer: 'Los matafuegos tienen una vida útil de aproximadamente 20 años desde su fabricación, siempre que reciban el mantenimiento adecuado. Es fundamental realizar la recarga anual y la prueba hidráulica cada 5 años para garantizar su correcto funcionamiento.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div 
      ref={ref}
      className={isVisible ? 'faq-visible' : 'faq-hidden'}
    >
      <div className="faq-header">
        <h2>Preguntas Frecuentes</h2>
        <p>Resolvemos tus dudas sobre seguridad contra incendios</p>
      </div>

      <div className="faq-container">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className={isOpen ? 'faq-item open' : 'faq-item'}
              style={{
                transitionDelay: `${index * 0.1}s`
              }}
            >
              <button 
                onClick={() => toggleFAQ(index)}
                className="faq-question"
              >
                <span>{faq.question}</span>
                <ChevronDown 
                  size={24} 
                  className={isOpen ? 'icon-rotated' : 'icon-normal'}
                />
              </button>
              <div className={isOpen ? 'faq-answer open' : 'faq-answer'}>
                <div className="faq-answer-content">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .faq-hidden,
        .faq-visible {
          margin-bottom: 64px;
          transition: all 0.8s ease-out;
        }

        .faq-hidden {
          opacity: 0;
          transform: translateY(50px);
        }

        .faq-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .faq-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .faq-header h2 {
          font-size: 36px;
          font-weight: bold;
          color: ${colors.text};
          margin-bottom: 16px;
        }

        .faq-header p {
          font-size: 18px;
          color: ${colors.textSecondary};
        }

        .faq-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .faq-item {
          background-color: ${colors.cardBg};
          border: 2px solid ${colors.border};
          border-radius: 12px;
          margin-bottom: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateX(-20px);
        }

        .faq-visible .faq-item {
          opacity: 1;
          transform: translateX(0);
        }

        .faq-item:hover {
          border-color: #ef4444;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
        }

        .faq-item.open {
          border-color: #ef4444;
        }

        .faq-question {
          width: 100%;
          padding: 20px 24px;
          background: none;
          border: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          text-align: left;
          font-size: 16px;
          font-weight: 600;
          color: ${colors.text};
          transition: all 0.3s ease;
        }

        .faq-question:hover {
          color: #ef4444;
        }

        .icon-normal {
          transition: transform 0.3s ease;
          color: ${colors.textSecondary};
        }

        .icon-rotated {
          transform: rotate(180deg);
          transition: transform 0.3s ease;
          color: #ef4444;
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease, padding 0.4s ease;
        }

        .faq-answer.open {
          max-height: 500px;
        }

        .faq-answer-content {
          padding: 0 24px 20px;
          font-size: 15px;
          line-height: 1.7;
          color: ${colors.textSecondary};
        }

        @media (max-width: 768px) {
          .faq-header h2 {
            font-size: 28px;
          }

          .faq-header p {
            font-size: 16px;
          }

          .faq-question {
            font-size: 15px;
            padding: 16px 20px;
          }

          .faq-answer-content {
            padding: 0 20px 16px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}

export default FAQ;
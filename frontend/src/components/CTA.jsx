import { Phone, Mail } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

function CTA() {
  const [ref, isVisible] = useScrollAnimation(0.3);

  const containerClass = isVisible ? 'cta-visible' : 'cta-hidden';

  return (
    <div ref={ref} className={containerClass}>
      <div className="cta-content">
        <h2>¿Necesitás asesoramiento?</h2>
        <p>Contactanos ahora y un especialista te atenderá</p>

        <div className="cta-buttons">
          <a href="tel:+5491234567890" className="cta-phone-btn">
            <Phone size={20} />
            Llamar Ahora
          </a>

          <a href="mailto:info@zdmatafuegos.com" className="cta-email-btn">
            <Mail size={20} />
            Enviar Email
          </a>
        </div>
      </div>

      <style>{`
        .cta-hidden,
        .cta-visible {
          background-color: #ef4444;
          padding: 64px 32px;
          border-radius: 16px;
          margin-bottom: 64px;
          text-align: center;
          position: relative;
          overflow: hidden;
          transition: all 0.8s ease-out;
        }

        .cta-hidden {
          opacity: 0;
          transform: scale(0.95);
        }

        .cta-visible {
          opacity: 1;
          transform: scale(1);
        }

        .cta-content {
          position: relative;
          z-index: 1;
        }

        .cta-content h2 {
          font-size: 36px;
          font-weight: bold;
          color: white;
          margin-bottom: 16px;
        }

        .cta-content p {
          font-size: 18px;
          color: white;
          margin-bottom: 32px;
          opacity: 0.95;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-phone-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
          background-color: white;
          color: #ef4444;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .cta-phone-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        }

        .cta-email-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
          background-color: transparent;
          color: white;
          border: 2px solid white;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .cta-email-btn:hover {
          background-color: white;
          color: #ef4444;
          transform: translateY(-4px);
        }

        @media (max-width: 768px) {
          .cta-content h2 {
            font-size: 28px;
          }
          .cta-content p {
            font-size: 16px;
          }
          .cta-phone-btn,
          .cta-email-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

export default CTA;
import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsApp = () => {
    window.open('https://wa.me/5491234567890?text=Hola,%20necesito%20información%20sobre%20matafuegos', '_blank');
  };

  return (
    <>
      <div className="whatsapp-float">
        {isOpen && (
          <div className="whatsapp-popup">
            <div className="whatsapp-popup-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: '#25D366',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <MessageCircle color="white" size={28} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>
                    ZD Matafuegos
                  </h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
                    Responde en minutos
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} color="#6b7280" />
              </button>
            </div>
            <div className="whatsapp-popup-body">
              <div className="whatsapp-message">
                <p>👋 ¡Hola! ¿En qué podemos ayudarte?</p>
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '12px 0 16px' }}>
                Estamos disponibles para responder tus consultas sobre matafuegos, mantenimiento y capacitaciones.
              </p>
              <button 
                onClick={handleWhatsApp}
                className="whatsapp-cta-btn"
              >
                <MessageCircle size={20} />
                Iniciar Conversación
              </button>
            </div>
          </div>
        )}

        <button 
          className="whatsapp-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
          <span className="whatsapp-pulse"></span>
        </button>
      </div>

      <style>{`
        .whatsapp-float {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 16px;
        }

        .whatsapp-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
          transition: all 0.3s ease;
          position: relative;
          animation: bounce 2s infinite;
        }

        .whatsapp-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 30px rgba(37, 211, 102, 0.6);
        }

        .whatsapp-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(37, 211, 102, 0.4);
          animation: pulse 2s infinite;
        }

        .whatsapp-popup {
          width: 320px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          animation: slideUp 0.3s ease-out;
        }

        .whatsapp-popup-header {
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
        }

        .whatsapp-popup-body {
          padding: 20px;
        }

        .whatsapp-message {
          background: #f3f4f6;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 8px;
          position: relative;
        }

        .whatsapp-message::before {
          content: '';
          position: absolute;
          top: 0;
          left: -8px;
          width: 0;
          height: 0;
          border-top: 8px solid #f3f4f6;
          border-left: 8px solid transparent;
        }

        .whatsapp-message p {
          margin: 0;
          font-size: 14px;
          color: #1f2937;
        }

        .whatsapp-cta-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .whatsapp-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.3);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .whatsapp-float {
            bottom: 16px;
            right: 16px;
          }

          .whatsapp-btn {
            width: 56px;
            height: 56px;
          }

          .whatsapp-popup {
            width: calc(100vw - 32px);
            max-width: 320px;
          }
        }
      `}</style>
    </>
  );
}

export default WhatsAppButton;
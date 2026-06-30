import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../contexts/ThemeContext';
import { FileText, AlertTriangle, CheckCircle, XCircle, Flame, Phone } from 'lucide-react';

function ManualUsuario() {
  const { colors } = useTheme();

  const steps = [
    {
      number: '1',
      title: 'Evaluar la Situación',
      description: 'Antes de actuar, determina si es seguro intentar apagar el fuego',
      details: [
        'Fuego pequeño y contenido',
        'Vía de escape despejada',
        'Humo mínimo',
        'Matafuego adecuado para el tipo de fuego'
      ],
      warning: 'Si el fuego es grande, evacúa inmediatamente y llama a emergencias'
    },
    {
      number: '2',
      title: 'P - Presionar (Pull)',
      description: 'Rompe el precinto de seguridad',
      details: [
        'Ubícate a 2-3 metros del fuego',
        'Rompe el precinto tirando del anillo',
        'Mantén el matafuegos en posición vertical',
        'Verifica que el manómetro esté en verde'
      ]
    },
    {
      number: '3',
      title: 'A - Apuntar (Aim)',
      description: 'Dirige la boquilla a la BASE del fuego',
      details: [
        'Apunta a la base, NO a las llamas',
        'Mantén distancia de seguridad (2-3m)',
        'Inclínate ligeramente hacia adelante',
        'Mantén firmeza en el agarre'
      ]
    },
    {
      number: '4',
      title: 'S - Sostener (Squeeze)',
      description: 'Aprieta el gatillo con firmeza',
      details: [
        'Presiona el gatillo completamente',
        'Mantén presión constante',
        'No sueltes hasta apagar el fuego',
        'Controla la descarga'
      ]
    },
    {
      number: '5',
      title: 'S - Barrer (Sweep)',
      description: 'Mueve de lado a lado cubriendo toda el área',
      details: [
        'Movimientos horizontales amplios',
        'Cubre toda la base del fuego',
        'Avanza lentamente a medida que se apaga',
        'Continúa hasta que el fuego esté extinguido'
      ]
    }
  ];

  const dos = [
    'Mantener la calma',
    'Verificar que sea el extintor correcto',
    'Evacuar a personas del área',
    'Llamar a emergencias si el fuego crece',
    'Usar en espacios ventilados',
    'Verificar extinciones completas'
  ];

  const donts = [
    'NO uses agua en fuegos eléctricos',
    'NO le des la espalda al fuego',
    'NO inhales el agente extintor',
    'NO uses extintores vencidos',
    'NO intentes apagar fuegos grandes',
    'NO reutilices sin recarga profesional'
  ];

  return (
    <>
      <Navbar />
      <div style={{
        backgroundColor: colors.background,
        minHeight: '100vh',
        transition: 'all 0.3s ease',
        paddingTop: '80px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '48px 32px'
        }} className="manual-container">
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '64px'
          }} className="header-section">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              marginBottom: '24px',
              boxShadow: '0 8px 20px rgba(239, 68, 68, 0.3)'
            }} className="header-icon">
              <FileText size={40} color="white" />
            </div>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: '16px',
              transition: 'color 0.3s ease'
            }} className="header-title">
              Manual del Usuario
            </h1>
            <p style={{
              fontSize: '20px',
              color: colors.textSecondary,
              maxWidth: '700px',
              margin: '0 auto',
              transition: 'color 0.3s ease'
            }} className="header-description">
              Guía paso a paso para el uso correcto del matafuegos en caso de emergencia
            </p>
          </div>

          {/* Emergency Alert */}
          <div style={{
            backgroundColor: '#9b1414', 
            border: '2px solid #911414',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '48px',
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-start'
          }} className="emergency-alert">
            <Phone size={24} color="#ffffff" style={{ flexShrink: 0, marginTop: '4px' }} />
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '8px'
              }} className="alert-title">
                Números de Emergencia
              </h3>
              <div style={{
                display: 'flex',
                gap: '24px',
                flexWrap: 'wrap',
                fontSize: '15px',
                color: '#ffffff'
              }} className="emergency-numbers">
                <span><strong>Bomberos:</strong> 100</span>
                <span><strong>Policía:</strong> 911</span>
                <span><strong>Emergencias:</strong> 107</span>
              </div>
            </div>
          </div>

          <div style={{
            marginBottom: '64px'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: '32px',
              textAlign: 'center'
            }} className="steps-title">
              Técnica P.A.S.S.
            </h2>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              {steps.map((step, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: colors.cardBg,
                    padding: '32px',
                    borderRadius: '16px',
                    border: '2px solid ' + colors.border,
                    boxShadow: colors.shadow,
                    transition: 'all 0.3s ease'
                  }}
                  className="step-card"
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#ef4444';
                    e.currentTarget.style.transform = 'translateX(8px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    gap: '24px',
                    alignItems: 'flex-start'
                  }} className="step-content">
                    <div style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: '#ef4444',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                      fontWeight: 'bold',
                      color: 'white',
                      flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                    }} className="step-number">
                      {step.number}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: colors.text,
                        marginBottom: '8px'
                      }} className="step-title">
                        {step.title}
                      </h3>

                      <p style={{
                        fontSize: '16px',
                        color: colors.textSecondary,
                        marginBottom: '16px'
                      }} className="step-description">
                        {step.description}
                      </p>

                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '8px'
                      }} className="step-details">
                        {step.details.map((detail, idx) => (
                          <li key={idx} style={{
                            fontSize: '14px',
                            color: colors.textSecondary,
                            paddingLeft: '24px',
                            position: 'relative'
                          }}>
                            <CheckCircle size={16} color="#10b981" style={{
                              position: 'absolute',
                              left: 0,
                              top: '2px'
                            }} />
                            {detail}
                          </li>
                        ))}
                      </ul>

                      {step.warning && (
                        <div style={{
                          marginTop: '16px',
                          padding: '12px 16px',
                          backgroundColor: '#fef3c7',
                          border: '1px solid #f59e0b',
                          borderRadius: '8px',
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'flex-start'
                        }} className="step-warning">
                          <AlertTriangle size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <p style={{
                            fontSize: '14px',
                            color: '#92400e',
                            margin: 0,
                            fontWeight: '600'
                          }}>
                            {step.warning}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px'
          }} className="dos-donts-grid">
            <div style={{
              backgroundColor: colors.cardBg,
              padding: '32px',
              borderRadius: '16px',
              border: '2px solid #10b981',
              boxShadow: colors.shadow
            }} className="dos-card">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px'
              }}>
                <CheckCircle size={32} color="#10b981" />
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: colors.text,
                  margin: 0
                }} className="dos-title">
                  SÍ Hacer
                </h3>
              </div>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {dos.map((item, index) => (
                  <li key={index} style={{
                    fontSize: '15px',
                    color: colors.textSecondary,
                    marginBottom: '12px',
                    paddingLeft: '28px',
                    position: 'relative',
                    lineHeight: '1.5'
                  }}>
                    <CheckCircle size={18} color="#10b981" style={{
                      position: 'absolute',
                      left: 0,
                      top: '2px'
                    }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{
              backgroundColor: colors.cardBg,
              padding: '32px',
              borderRadius: '16px',
              border: '2px solid #ef4444',
              boxShadow: colors.shadow
            }} className="donts-card">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px'
              }}>
                <XCircle size={32} color="#ef4444" />
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: colors.text,
                  margin: 0
                }} className="donts-title">
                  NO Hacer
                </h3>
              </div>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {donts.map((item, index) => (
                  <li key={index} style={{
                    fontSize: '15px',
                    color: colors.textSecondary,
                    marginBottom: '12px',
                    paddingLeft: '28px',
                    position: 'relative',
                    lineHeight: '1.5'
                  }}>
                    <XCircle size={18} color="#ef4444" style={{
                      position: 'absolute',
                      left: 0,
                      top: '2px'
                    }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <style>{`
        /* Tablet */
        @media (max-width: 768px) {
          .manual-container {
            padding: 32px 24px !important;
          }

          .header-section {
            margin-bottom: 48px !important;
          }

          .header-icon {
            width: 64px !important;
            height: 64px !important;
          }

          .header-icon svg {
            width: 32px !important;
            height: 32px !important;
          }

          .header-title {
            font-size: 36px !important;
          }

          .header-description {
            font-size: 18px !important;
          }

          .emergency-alert {
            padding: 20px !important;
            flex-direction: column !important;
          }

          .alert-title {
            font-size: 16px !important;
          }

          .emergency-numbers {
            flex-direction: column !important;
            gap: 12px !important;
          }

          .steps-title {
            font-size: 28px !important;
          }

          .step-card {
            padding: 24px !important;
          }

          .step-content {
            flex-direction: column !important;
            gap: 16px !important;
          }

          .step-number {
            width: 50px !important;
            height: 50px !important;
            font-size: 24px !important;
          }

          .step-title {
            font-size: 20px !important;
          }

          .step-description {
            font-size: 15px !important;
          }

          .step-details {
            grid-template-columns: 1fr !important;
          }

          .dos-donts-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }

          .dos-card,
          .donts-card {
            padding: 24px !important;
          }

          .dos-title,
          .donts-title {
            font-size: 20px !important;
          }
        }

        /* Mobile pequeño */
        @media (max-width: 480px) {
          .manual-container {
            padding: 24px 16px !important;
          }

          .header-icon {
            width: 56px !important;
            height: 56px !important;
          }

          .header-icon svg {
            width: 28px !important;
            height: 28px !important;
          }

          .header-title {
            font-size: 28px !important;
          }

          .header-description {
            font-size: 16px !important;
          }

          .emergency-alert {
            padding: 16px !important;
          }

          .emergency-numbers {
            font-size: 14px !important;
          }

          .steps-title {
            font-size: 24px !important;
          }

          .step-card {
            padding: 20px !important;
          }

          .step-number {
            width: 44px !important;
            height: 44px !important;
            font-size: 20px !important;
          }

          .step-title {
            font-size: 18px !important;
          }

          .step-description {
            font-size: 14px !important;
          }

          .step-warning {
            padding: 10px 12px !important;
          }

          .dos-card,
          .donts-card {
            padding: 20px !important;
          }

          .dos-title,
          .donts-title {
            font-size: 18px !important;
          }
        }
      `}</style>
    </>
  );
}

export default ManualUsuario;
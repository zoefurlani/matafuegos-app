import { useState, useEffect } from 'react';

function Loader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-content">
        <img 
          src="/logoof.png" 
          alt="ZD Matafuegos" 
          className="loader-logo"
        />
        <div className="loader-text">
          <h1>ZD MATAFUEGOS</h1>
          <p>Tu seguridad es nuestra prioridad</p>
        </div>
        <div className="loader-bar-container">
          <div className="loader-bar" style={{ width: `${progress}%` }} />
        </div>
        <p className="loader-percentage">{progress}%</p>
      </div>

      <style>{`
        .loader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          animation: fadeOut 0.5s ease-out 1.8s forwards;
        }

        .loader-content {
          text-align: center;
          animation: scaleIn 0.5s ease-out;
        }

        .loader-logo {
          width: 120px;
          height: auto;
          margin-bottom: 24px;
          filter: drop-shadow(0 0 20px rgba(239, 68, 68, 0.6));
          animation: pulse 2s ease-in-out infinite;
        }

        .loader-text h1 {
          font-size: 32px;
          font-weight: bold;
          color: white;
          margin: 0 0 8px 0;
          letter-spacing: 3px;
          text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
        }

        .loader-text p {
          font-size: 14px;
          color: #ef4444;
          margin: 0 0 32px 0;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .loader-bar-container {
          width: 300px;
          height: 6px;
          background-color: rgba(255,255,255,0.1);
          border-radius: 10px;
          overflow: hidden;
          margin: 0 auto 16px;
        }

        .loader-bar {
          height: 100%;
          background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
          border-radius: 10px;
          transition: width 0.3s ease-out;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.6);
        }

        .loader-percentage {
          font-size: 18px;
          font-weight: bold;
          color: white;
          margin: 0;
        }

        @keyframes fadeOut {
          to {
            opacity: 0;
            pointer-events: none;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @media (max-width: 480px) {
          .loader-logo {
            width: 80px;
          }

          .loader-text h1 {
            font-size: 24px;
          }

          .loader-bar-container {
            width: 200px;
          }
        }
      `}</style>
    </div>
  );
}

export default Loader;
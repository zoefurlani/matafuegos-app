import { createContext, useContext, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X, AlertCircle } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return context;
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmModal, setConfirmModal] = useState(null);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (message, duration) => addToast(message, 'success', duration);
  const error = (message, duration) => addToast(message, 'error', duration);
  const warning = (message, duration) => addToast(message, 'warning', duration);
  const info = (message, duration) => addToast(message, 'info', duration);

  const confirm = (message, options = {}) => {
    return new Promise((resolve) => {
      setConfirmModal({
        message,
        title: options.title || '¿Estás seguro?',
        confirmText: options.confirmText || 'Aceptar',
        cancelText: options.cancelText || 'Cancelar',
        onConfirm: () => {
          setConfirmModal(null);
          resolve(true);
        },
        onCancel: () => {
          setConfirmModal(null);
          resolve(false);
        }
      });
    });
  };

  return (
    <ToastContext.Provider value={{ success, error, warning, info, confirm }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {confirmModal && <ConfirmModal {...confirmModal} />}
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onRemove }) {
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      maxWidth: '400px'
    }}>
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function Toast({ toast, onRemove }) {
  const config = {
    success: {
      icon: CheckCircle,
      color: '#ffffff',        
      bg: '#059669',           
      border: '#059669'        
    },
    error: {
      icon: XCircle,
      color: '#ffffff',        
      bg: '#dc2626',           
      border: '#dc2626'        
    },
    warning: {
      icon: AlertTriangle,
      color: '#ffffff',     
      bg: '#d97706',        
      border: '#d97706'     
    },
    info: {
      icon: Info,
      color: '#ffffff',     
      bg: '#3b82f6',        
      border: '#2563eb'     
    }
  };

  const { icon: Icon, color, bg, border } = config[toast.type] || config.info;

  return (
    <div
      style={{
        backgroundColor: bg, 
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '300px',
        border: `2px solid ${border}`,
        animation: 'slideIn 0.3s ease-out',
        position: 'relative'
      }}
    >
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>


      <div style={{
        width: '40px',
        height: '40px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)', 
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Icon size={24} color="#ffffff" /> 
      </div>

      <div style={{ flex: 1, fontSize: '15px', color: '#ffffff', fontWeight: '500' }}> 
        {toast.message}
      </div>

      <button
        onClick={() => onRemove(toast.id)}
        style={{
          padding: '4px',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#ffffff',  
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          transition: 'background-color 0.2s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'} 
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <X size={18} />
      </button>
    </div>
  );
}

function ConfirmModal({ message, title, confirmText, cancelText, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div style={{
        backgroundColor: '#2d3748',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '450px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        animation: 'scaleIn 0.3s ease-out'
      }}>
        <h3 style={{
          fontSize: '22px',
          fontWeight: 'bold',
          color: '#ffffff',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          {title}
        </h3>

        <p style={{
          fontSize: '16px',
          color: '#e2e8f0',
          marginBottom: '32px',
          textAlign: 'center',
          lineHeight: '1.6'
        }}>
          {message}
        </p>

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center'
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '12px 32px',
              backgroundColor: '#4a5568',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minWidth: '120px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#2d3748';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#4a5568';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            style={{
              padding: '12px 32px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
              minWidth: '120px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#dc2626';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#ef4444';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
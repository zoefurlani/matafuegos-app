import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowLeft, MapPin, Phone, Mail, Clock } from 'lucide-react';

const Ubicacion = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#e5e7eb' }}>
      <Navbar />
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 32px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            backgroundColor: '#374151',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            marginBottom: '32px'
          }}
        >
          <ArrowLeft size={20} /> Volver
        </button>

        <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
          Nuestra Ubicación
        </h1>
        <p style={{ fontSize: '20px', color: '#6b7280', marginBottom: '48px' }}>
          Encuéntranos y contáctanos
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <MapPin size={32} color="#ef4444" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Dirección</h3>
            <p style={{ color: '#6b7280' }}>
              25 de Mayo N°1675<br />
              Romang, Santa Fe<br />
              Argentina
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <Phone size={32} color="#ef4444" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Teléfono</h3>
            <p style={{ color: '#6b7280' }}>
              +54 9 123 456-7890<br />
              WhatsApp disponible
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <Mail size={32} color="#ef4444" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Email</h3>
            <p style={{ color: '#6b7280' }}>
              info@zdmatafuegos.com<br />
              ventas@zdmatafuegos.com
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <Clock size={32} color="#ef4444" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Horarios</h3>
            <p style={{ color: '#6b7280' }}>
              Lunes a Viernes: 8:00 - 18:00<br />
              Sábados: 9:00 - 13:00<br />
              Emergencias: 24/7
            </p>
          </div>
        </div>

        {/* Mapa de Google Maps */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
            Cómo llegar
          </h2>
          <div style={{
            position: 'relative',
            paddingBottom: '56.25%',
            height: 0,
            overflow: 'hidden',
            borderRadius: '8px'
          }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3464.123456789!2d-59.1234567!3d-29.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDA3JzI0LjQiUyA1OcKwMDcnMjQuNCJX!5e0!3m2!1ses!2sar!4v1234567890123!5m2!1ses!2sar"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p style={{
            marginTop: '16px',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            * Reemplaza la URL del iframe con la ubicación real de tu negocio desde Google Maps
          </p>
        </div>
      </main>
    </div>
  );
};

export default Ubicacion;
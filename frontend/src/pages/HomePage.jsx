import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';
import Stats from '../components/Stats';
import WhyChooseUs from '../components/WhyChooseUs';
import InfoCard from '../components/InfoCard';
import Testimonials from '../components/Testimonials';
import Certifications from '../components/Certifications';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import CookieBanner from '../components/CookieBanner';
import Loader from '../components/Loader';
import { useTheme } from '../contexts/ThemeContext';

function HomePage() {
  const { colors } = useTheme();

  return (
    <>
      <Loader />
      <div style={{
        backgroundColor: colors.background,
        minHeight: '100vh',
        transition: 'all 0.3s ease'
      }}>
        <Navbar />
        
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '32px'
        }} className="home-container">
          <Carousel />
          <Stats />
          <WhyChooseUs />

          <div style={{ marginBottom: '64px' }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '48px'
            }} className="services-header">
              <h2 style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: colors.text,
                marginBottom: '16px',
                transition: 'color 0.3s ease'
              }} className="services-title">
                Nuestros Servicios
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows: 'repeat(2, 250px)',
              gap: '32px'
            }} className="services-grid">
              <div style={{ gridColumn: '1', gridRow: '1' }} className="service-card">
                <InfoCard
                  title="GUÍA TÉCNICA"
                  description="Información esencial sobre matafuegos"
                  image="/img/centro-conocimiento.jpg"
                  link="/guia-tecnica"
                />
              </div>

              <div style={{ gridColumn: '2', gridRow: '1 / 3' }} className="service-card service-card-tall">
                <div style={{ height: '100%' }}>
                  <InfoCard
                    title="MANTENIMIENTO"
                    description="Servicios profesionales certificados"
                    image="/img/mantenimiento.jpg"
                    link="/mantenimiento"
                  />
                </div>
              </div>

              <div style={{ gridColumn: '3', gridRow: '1' }} className="service-card">
                <InfoCard
                  title="UBICACIÓN"
                  description="Encontranos en Romang"
                  image="/img/ubicacion.jpg"
                  link="/ubicacion"
                />
              </div>

              <div style={{ gridColumn: '1', gridRow: '2' }} className="service-card">
                <InfoCard
                  title="MANUAL PARA EL USUARIO"
                  description="Guía completa de uso"
                  image="/img/manual-usuario.jpg"
                  link="/manual-usuario"
                />
              </div>

              <div style={{ gridColumn: '3', gridRow: '2' }} className="service-card">
                <InfoCard
                  title="NUESTRA HISTORIA"
                  description="Conocé nuestra trayectoria"
                  image="/img/historia.jpg"
                  link="/nuestra-historia"
                />
              </div>
            </div>
          </div>

          <Testimonials />
          <Certifications />
          <FAQ />
        </div>

        <Footer />
        <WhatsAppButton />
        <CookieBanner />
      </div>

      <style>{`
        @media (max-width: 1024px) and (min-width: 769px) {
          .home-container {
            padding: 24px !important;
          }

          .services-title {
            font-size: 32px !important;
          }

          .services-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-template-rows: auto !important;
            gap: 24px !important;
          }

          .service-card {
            grid-column: auto !important;
            grid-row: auto !important;
          }

          .service-card-tall {
            grid-row: auto !important;
          }

          .service-card-tall > div {
            height: 250px !important;
          }
        }

        @media (max-width: 768px) {
          .home-container {
            padding: 20px 16px !important;
          }

          .services-header {
            margin-bottom: 32px !important;
          }

          .services-title {
            font-size: 28px !important;
          }

          .services-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto !important;
            gap: 20px !important;
          }

          .service-card {
            grid-column: 1 !important;
            grid-row: auto !important;
          }

          .service-card-tall {
            grid-row: auto !important;
          }

          .service-card-tall > div {
            height: 250px !important;
          }
        }

        @media (max-width: 480px) {
          .home-container {
            padding: 16px 12px !important;
          }

          .services-header {
            margin-bottom: 24px !important;
          }

          .services-title {
            font-size: 24px !important;
            margin-bottom: 12px !important;
          }

          .services-grid {
            gap: 16px !important;
          }

          .service-card-tall > div {
            height: 220px !important;
          }
        }
      `}</style>
    </>
  );
}

export default HomePage;
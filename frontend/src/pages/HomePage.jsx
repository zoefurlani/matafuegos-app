import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';
import Stats from '../components/Stats';
import WhyChooseUs from '../components/WhyChooseUs';
import InfoCard from '../components/InfoCard';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
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
        }}>
          <Carousel />
          <Stats />
          <WhyChooseUs />

          <div style={{ marginBottom: '64px' }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '48px'
            }}>
              <h2 style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: colors.text,
                marginBottom: '16px',
                transition: 'color 0.3s ease'
              }}>
                Nuestros Servicios
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows: 'repeat(2, 250px)',
              gap: '32px'
            }}>
              {/* Card 1 - Arriba izquierda */}
              <div style={{ gridColumn: '1', gridRow: '1' }}>
                <InfoCard
                  title="CENTRO DE CONOCIMIENTO"
                  description="Información esencial sobre matafuegos"
                  image="/img/centro-conocimiento.jpg"
                  link="/centro-conocimiento"
                />
              </div>

              {/* Card 3 - Centro, ocupa 2 filas (ALTA) */}
              <div style={{ gridColumn: '2', gridRow: '1 / 3' }}>
                <div style={{ height: '100%' }}>
                  <InfoCard
                    title="MANTENIMIENTO"
                    description="Servicios profesionales certificados"
                    image="/img/mantenimiento.jpg"
                    link="/mantenimiento"
                  />
                </div>
              </div>

              {/* Card 4 - Arriba derecha */}
              <div style={{ gridColumn: '3', gridRow: '1' }}>
                <InfoCard
                  title="UBICACIÓN"
                  description="Encontranos en Malabrigo"
                  image="/img/ubicacion.jpg"
                  link="/ubicacion"
                />
              </div>

              {/* Card 2 - Abajo izquierda */}
              <div style={{ gridColumn: '1', gridRow: '2' }}>
                <InfoCard
                  title="MANUAL PARA EL USUARIO"
                  description="Guía completa de uso"
                  image="/img/manual-usuario.jpg"
                  link="/manual-usuario"
                />
              </div>

              {/* Card 5 - Abajo derecha */}
              <div style={{ gridColumn: '3', gridRow: '2' }}>
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
          <CTA />
          <Certifications />
          <FAQ />
        </div>

        <Footer />
        <WhatsAppButton />
        <CookieBanner />
      </div>

      <style>{`
        @media (max-width: 1024px) {
          div[style*="repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto !important;
          }

          div[style*="gridColumn"] {
            grid-column: 1 !important;
            grid-row: auto !important;
          }
        }
      `}</style>
    </>
  );
}

export default HomePage;
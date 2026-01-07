import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const slides = [
    {
      id: 1,
      image: '/img/carousel/slide1.jpg',
      title: 'CUMPLÍ CON LAS NORMAS',
      subtitle: 'CUIDÁ TU SEGURIDAD'
    },
    {
      id: 2,
      image: '/img/carousel/slide2.jpg',
      title: 'PROTECCIÓN PROFESIONAL',
      subtitle: 'Equipos certificados y garantizados'
    },
    {
      id: 3,
      image: '/img/carousel/slide3.jpg',
      title: 'CAPACITACIÓN EXPERTA',
      subtitle: 'Entrenamiento para tu equipo'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const parallaxOffset = scrollY * 0.5;

  return (
    <>
      {/* Contador de slides */}
      <div style={{
        position: 'absolute',
        top: '24px',
        right: '24px',
        padding: '8px 16px',
        backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        color: 'white',
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: 3
      }}>
        {currentSlide + 1} / {slides.length}
      </div>

      <div className="carousel-container">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={index === currentSlide ? 'slide active' : 'slide'}
          >
            <img
              src={slide.image}
              alt={`Slide ${slide.id}`}
              style={{
                transform: `translateY(${parallaxOffset}px)`
              }}
            />

            <div className="slide-overlay" />

            <div className="slide-text">
              <h2 className="slide-title">{slide.title}</h2>
              <p className="slide-subtitle">{slide.subtitle}</p>
            </div>
          </div>
        ))}

        <button onClick={prevSlide} className="carousel-btn carousel-btn-prev">
          <ChevronLeft size={32} color="white" />
        </button>

        <button onClick={nextSlide} className="carousel-btn carousel-btn-next">
          <ChevronRight size={32} color="white" />
        </button>

        <div className="carousel-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={index === currentSlide ? 'dot active' : 'dot'}
            />
          ))}
        </div>
      </div>

      <style>{`
        .carousel-container {
          position: relative;
          width: 100%;
          height: 500px;
          border-radius: 16px;
          overflow: hidden;
          margin-top: 80px;
          margin-bottom: 48px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 1s ease-in-out;
          pointer-events: none;
        }

        .slide.active {
          opacity: 1;
          pointer-events: auto;
        }

        .slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.1s ease-out;
        }

        .slide-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%);
        }

        .slide-text {
          position: absolute;
          top: 50%;
          left: 120px;
          transform: translateY(-50%);
          max-width: 600px;
          z-index: 2;
          animation: slideInLeft 0.8s ease-out;
        }

        .slide-title {
          font-size: 56px;
          font-weight: bold;
          color: white;
          margin-bottom: 16px;
          text-shadow: 3px 3px 10px rgba(0,0,0,0.8);
          line-height: 1.2;
          letter-spacing: 2px;
        }

        .slide-subtitle {
          font-size: 28px;
          color: white;
          text-shadow: 2px 2px 8px rgba(0,0,0,0.8);
          font-weight: 500;
        }

        .carousel-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 56px;
          height: 56px;
          background-color: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 3;
          transition: all 0.3s ease;
        }

        .carousel-btn:hover {
          background-color: rgba(255,255,255,0.4);
          transform: translateY(-50%) scale(1.1);
        }

        .carousel-btn-prev {
          left: 24px;
        }

        .carousel-btn-next {
          right: 24px;
        }

        .carousel-dots {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          z-index: 3;
        }

        .dot {
          width: 12px;
          height: 12px;
          background-color: rgba(255,255,255,0.5);
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dot.active {
          width: 40px;
          background-color: #ef4444;
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateY(-50%) translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }

        @media (max-width: 1024px) {
          .carousel-container {
            height: 400px;
            margin-top: 80px;
            margin-bottom: 32px;
            border-radius: 12px;
          }
          
          .slide-text {
            left: 60px;
            max-width: 450px;
          }
          
          .slide-title {
            font-size: 40px;
            letter-spacing: 1px;
            margin-bottom: 12px;
          }
          
          .slide-subtitle {
            font-size: 20px;
          }
          
          .carousel-btn {
            width: 48px;
            height: 48px;
          }
          
          .carousel-btn svg {
            width: 28px;
            height: 28px;
          }
          
          .carousel-btn-prev {
            left: 16px;
          }
          
          .carousel-btn-next {
            right: 16px;
          }
        }

        @media (max-width: 768px) {
          .carousel-container {
            height: 350px;
            margin-top: 80px;
            margin-bottom: 24px;
            border-radius: 8px;
          }
          
          .slide-text {
            left: 40px;
            right: 40px;
            max-width: calc(100% - 80px);
          }
          
          .slide-title {
            font-size: 32px;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
          }
          
          .slide-subtitle {
            font-size: 16px;
          }
          
          .carousel-btn {
            width: 40px;
            height: 40px;
          }
          
          .carousel-btn svg {
            width: 24px;
            height: 24px;
          }
          
          .carousel-btn-prev {
            left: 12px;
          }
          
          .carousel-btn-next {
            right: 12px;
          }
          
          .carousel-dots {
            bottom: 16px;
            gap: 8px;
          }
          
          .dot {
            width: 8px;
            height: 8px;
          }
        }

        @media (max-width: 480px) {
          .carousel-container {
            height: 280px;
            margin-top: 80px;
            margin-bottom: 16px;
          }
          
          .slide-text {
            left: 20px;
            right: 20px;
            max-width: calc(100% - 40px);
          }
          
          .slide-title {
            font-size: 24px;
            letter-spacing: 0px;
          }
          
          .slide-subtitle {
            font-size: 14px;
          }
          
          .carousel-btn {
            width: 36px;
            height: 36px;
          }
          
          .carousel-btn svg {
            width: 20px;
            height: 20px;
          }
          
          .carousel-btn-prev {
            left: 8px;
          }
          
          .carousel-btn-next {
            right: 8px;
          }
          
          .carousel-dots {
            bottom: 12px;
            gap: 6px;
          }
        }
      `}</style>
    </>
  );
};

export default Carousel;
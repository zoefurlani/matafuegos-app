import { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  DollarSign,
  Flame,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { dashboardAPI, clientesAPI, extintoresAPI, recargasAPI, inventarioAPI } from '../../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalExtintores: 0,
    recargasMes: 0,
    stockBajo: 0,
    extintoresVencidos: 0,
    proximosVencer: 0,
    ingresosMes: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener datos de diferentes endpoints
        const [clientes, extintores, productosStock] = await Promise.all([
          clientesAPI.getAll().catch(() => []),
          extintoresAPI.getAll().catch(() => []),
          inventarioAPI.getProductosBajoStock().catch(() => [])
        ]);

        // Calcular estadísticas
        const ahora = new Date();
        const mesActual = ahora.getMonth();
        const añoActual = ahora.getFullYear();

        // Filtrar extintores próximos a vencer (60 días)
        const proximosVencer = extintores.filter(ext => {
          if (!ext.fechaVencimiento) return false;
          const fechaVenc = new Date(ext.fechaVencimiento);
          const diasRestantes = Math.floor((fechaVenc - ahora) / (1000 * 60 * 60 * 24));
          return diasRestantes > 0 && diasRestantes <= 60;
        });

        // Filtrar extintores vencidos
        const vencidos = extintores.filter(ext => {
          if (!ext.fechaVencimiento) return false;
          const fechaVenc = new Date(ext.fechaVencimiento);
          return fechaVenc < ahora;
        });

        setStats({
          totalClientes: clientes.length,
          totalExtintores: extintores.length,
          recargasMes: 0, // Necesitaríamos endpoint específico
          stockBajo: productosStock.length,
          extintoresVencidos: vencidos.length,
          proximosVencer: proximosVencer.length,
          ingresosMes: 0 // Necesitaríamos cálculo de recargas del mes
        });

        setError(null);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        setError('Error al cargar las estadísticas. Por favor, verifica que el backend esté corriendo.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cards = [
    {
      title: 'Total Clientes',
      value: stats.totalClientes,
      icon: Users,
      color: '#3b82f6',
      bgColor: '#dbeafe',
      trend: '+12%'
    },
    {
      title: 'Extintores Activos',
      value: stats.totalExtintores,
      icon: Flame,
      color: '#10b981',
      bgColor: '#d1fae5',
      trend: '+5%'
    },
    {
      title: 'Recargas del Mes',
      value: stats.recargasMes,
      icon: RefreshCw,
      color: '#8b5cf6',
      bgColor: '#ede9fe',
      trend: '+8%'
    },
    {
      title: 'Ingresos del Mes',
      value: stats.ingresosMes > 0 ? `$${stats.ingresosMes.toLocaleString()}` : '$0',
      icon: DollarSign,
      color: '#059669',
      bgColor: '#d1fae5',
      trend: '+15%'
    },
    {
      title: 'Stock Bajo',
      value: stats.stockBajo,
      icon: AlertTriangle,
      color: '#f59e0b',
      bgColor: '#fef3c7',
      alert: true
    },
    {
      title: 'Extintores Vencidos',
      value: stats.extintoresVencidos,
      icon: AlertTriangle,
      color: '#ef4444',
      bgColor: '#fee2e2',
      alert: true
    },
    {
      title: 'Próximos a Vencer',
      value: stats.proximosVencer,
      icon: Calendar,
      color: '#f97316',
      bgColor: '#ffedd5',
      alert: true
    },
    {
      title: 'Todo al Día',
      value: stats.totalExtintores > 0 
        ? `${Math.round(((stats.totalExtintores - stats.extintoresVencidos) / stats.totalExtintores) * 100)}%`
        : '0%',
      icon: CheckCircle,
      color: '#10b981',
      bgColor: '#d1fae5'
    }
  ];

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60vh',
        gap: '20px'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '6px solid #e5e7eb',
          borderTop: '6px solid #ef4444',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#6b7280', fontSize: '16px' }}>Cargando estadísticas...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '32px',
        backgroundColor: '#fee2e2',
        border: '2px solid #ef4444',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '20px', color: '#7f1d1d', marginBottom: '8px' }}>
          Error al cargar datos
        </h2>
        <p style={{ color: '#991b1b', marginBottom: '16px' }}>
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '12px 24px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '8px'
        }}>
          Dashboard
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#6b7280'
        }}>
          Resumen general del sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: card.alert ? `2px solid ${card.color}` : 'none',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: card.bgColor,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={24} color={card.color} />
                </div>
                {card.trend && (
                  <span style={{
                    fontSize: '14px',
                    color: '#10b981',
                    fontWeight: 'bold'
                  }}>
                    {card.trend}
                  </span>
                )}
              </div>
              
              <h3 style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '4px'
              }}>
                {card.value}
              </h3>
              
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                {card.title}
              </p>
            </div>
          );
        })}
      </div>

      {/* Alertas Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '16px'
        }}>
          Alertas Recientes
        </h2>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {stats.extintoresVencidos > 0 && (
            <div style={{
              padding: '16px',
              backgroundColor: '#fee2e2',
              borderLeft: '4px solid #ef4444',
              borderRadius: '8px'
            }}>
              <p style={{
                fontSize: '14px',
                color: '#7f1d1d',
                fontWeight: 'bold'
              }}>
                🔴 {stats.extintoresVencidos} extintor{stats.extintoresVencidos > 1 ? 'es' : ''} con vencimiento vencido - Requiere atención inmediata
              </p>
            </div>
          )}
          
          {stats.stockBajo > 0 && (
            <div style={{
              padding: '16px',
              backgroundColor: '#fef3c7',
              borderLeft: '4px solid #f59e0b',
              borderRadius: '8px'
            }}>
              <p style={{
                fontSize: '14px',
                color: '#78350f',
                fontWeight: 'bold'
              }}>
                🟡 {stats.stockBajo} producto{stats.stockBajo > 1 ? 's' : ''} con stock bajo - Realizar pedido pronto
              </p>
            </div>
          )}
          
          {stats.proximosVencer > 0 && (
            <div style={{
              padding: '16px',
              backgroundColor: '#ffedd5',
              borderLeft: '4px solid #f97316',
              borderRadius: '8px'
            }}>
              <p style={{
                fontSize: '14px',
                color: '#7c2d12',
                fontWeight: 'bold'
              }}>
                🟠 {stats.proximosVencer} extintor{stats.proximosVencer > 1 ? 'es' : ''} próximo{stats.proximosVencer > 1 ? 's' : ''} a vencer (60 días) - Programar visitas
              </p>
            </div>
          )}

          {stats.extintoresVencidos === 0 && stats.stockBajo === 0 && stats.proximosVencer === 0 && (
            <div style={{
              padding: '16px',
              backgroundColor: '#d1fae5',
              borderLeft: '4px solid #10b981',
              borderRadius: '8px'
            }}>
              <p style={{
                fontSize: '14px',
                color: '#065f46',
                fontWeight: 'bold'
              }}>
                ✅ No hay alertas activas - Todo está en orden
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
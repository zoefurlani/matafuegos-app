import { useState, useEffect } from 'react';
import {
  Users,
  Flame,
  RefreshCw,
  Package,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Activity,
  XCircle,
  X
} from 'lucide-react';
import { clientesAPI, extintoresAPI, recargasAPI, inventarioAPI } from '../../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalClientes: 0,
    clientesTrend: 0,
    extintoresActivos: 0,
    extintoresTrend: 0,
    recargasMes: 0,
    recargasTrend: 0,
    ingresosMes: 0,
    ingresosTrend: 0,
    extintoresVencidos: 0,
    stockBajo: 0,
    proximosVencer: 0,
    tasaMantenimiento: 0
  });

  const [recientesRecargas, setRecientesRecargas] = useState([]);
  const [extintoresCriticos, setExtintoresCriticos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para los modales
  const [modalData, setModalData] = useState(null);
  const [clientesDetalle, setClientesDetalle] = useState([]);
  const [extintoresDetalle, setExtintoresDetalle] = useState([]);
  const [recargasDetalle, setRecargasDetalle] = useState([]);
  const [ingresosDetalle, setIngresosDetalle] = useState([]);
  const [stockBajoDetalle, setStockBajoDetalle] = useState([]);
  const [vencidosDetalle, setVencidosDetalle] = useState([]);
  const [proximosVencerDetalle, setProximosVencerDetalle] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [clientes, extintores, recargas, inventario] = await Promise.all([
        clientesAPI.getAll(),
        extintoresAPI.getAll(),
        recargasAPI.getAll(),
        inventarioAPI.getAllProductos()
      ]);

      const ahora = new Date();
      const mesActual = ahora.getMonth();
      const añoActual = ahora.getFullYear();

      // Calcular mes anterior
      const mesAnterior = mesActual === 0 ? 11 : mesActual - 1;
      const añoMesAnterior = mesActual === 0 ? añoActual - 1 : añoActual;

      // ===== CLIENTES =====
      const clientesEsteMes = clientes.filter(c => {
        const fecha = new Date(c.createdAt);
        return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
      });

      const clientesMesAnterior = clientes.filter(c => {
        const fecha = new Date(c.createdAt);
        return fecha.getMonth() === mesAnterior && fecha.getFullYear() === añoMesAnterior;
      });

      const clientesTrend = calcularTendencia(clientesEsteMes.length, clientesMesAnterior.length);
      setClientesDetalle(clientesEsteMes);

      // ===== EXTINTORES =====
      const extintoresActivos = extintores.filter(e => e.estado === 'activo');
      
      const extintoresEsteMes = extintores.filter(e => {
        const fecha = new Date(e.createdAt);
        return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
      });

      const extintoresMesAnterior = extintores.filter(e => {
        const fecha = new Date(e.createdAt);
        return fecha.getMonth() === mesAnterior && fecha.getFullYear() === añoMesAnterior;
      });

      const extintoresTrend = calcularTendencia(extintoresEsteMes.length, extintoresMesAnterior.length);
      setExtintoresDetalle(extintoresEsteMes);

      // ===== RECARGAS =====
      const recargasDelMes = recargas.filter(r => {
        const fecha = new Date(r.fechaRecarga);
        return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
      });

      const recargasMesAnterior = recargas.filter(r => {
        const fecha = new Date(r.fechaRecarga);
        return fecha.getMonth() === mesAnterior && fecha.getFullYear() === añoMesAnterior;
      });

      const recargasTrend = calcularTendencia(recargasDelMes.length, recargasMesAnterior.length);
      setRecargasDetalle(recargasDelMes);

      // ===== INGRESOS =====
      const ingresosEsteMes = recargasDelMes
        .filter(r => r.estado === 'completada')
        .reduce((sum, r) => sum + Number(r.precioTotal || 0), 0);

      const ingresosMesAnterior = recargasMesAnterior
        .filter(r => r.estado === 'completada')
        .reduce((sum, r) => sum + Number(r.precioTotal || 0), 0);

      const ingresosTrend = calcularTendencia(ingresosEsteMes, ingresosMesAnterior);
      setIngresosDetalle(recargasDelMes.filter(r => r.estado === 'completada'));

      // ===== ALERTAS =====
      const vencidos = extintores.filter(e => {
        const vencimiento = new Date(e.fechaVencimiento);
        return vencimiento < ahora;
      });
      setVencidosDetalle(vencidos);

      const treintaDias = new Date();
      treintaDias.setDate(treintaDias.getDate() + 30);
      const proximosVencer = extintores.filter(e => {
        const vencimiento = new Date(e.fechaVencimiento);
        return vencimiento > ahora && vencimiento <= treintaDias;
      });
      setProximosVencerDetalle(proximosVencer);

      const productosBajoStock = inventario.filter(p => 
        Number(p.stockActual) <= Number(p.stockMinimo)
      );
      setStockBajoDetalle(productosBajoStock);

      const tasaMantenimiento = extintores.length > 0 
        ? Math.round((extintoresActivos.length / extintores.length) * 100)
        : 0;

      setStats({
        totalClientes: clientes.length,
        clientesTrend,
        extintoresActivos: extintoresActivos.length,
        extintoresTrend,
        recargasMes: recargasDelMes.length,
        recargasTrend,
        ingresosMes: ingresosEsteMes,
        ingresosTrend,
        extintoresVencidos: vencidos.length,
        stockBajo: productosBajoStock.length,
        proximosVencer: proximosVencer.length,
        tasaMantenimiento
      });

      const recientesOrdenadas = recargas
        .sort((a, b) => new Date(b.fechaRecarga) - new Date(a.fechaRecarga))
        .slice(0, 5);
      setRecientesRecargas(recientesOrdenadas);

      setExtintoresCriticos([...vencidos, ...proximosVencer].slice(0, 5));

    } catch (error) {
      console.error('Error al cargar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularTendencia = (valorActual, valorAnterior) => {
    if (valorAnterior === 0) {
      return valorActual > 0 ? 100 : 0;
    }
    const cambio = ((valorActual - valorAnterior) / valorAnterior) * 100;
    return Math.round(cambio);
  };

  // Funciones para abrir modales
  const abrirModalClientes = () => {
    setModalData({
      titulo: 'Clientes Nuevos del Mes',
      tipo: 'clientes',
      datos: clientesDetalle
    });
  };

  const abrirModalExtintores = () => {
    setModalData({
      titulo: 'Extintores Nuevos del Mes',
      tipo: 'extintores',
      datos: extintoresDetalle
    });
  };

  const abrirModalRecargas = () => {
    setModalData({
      titulo: 'Recargas del Mes',
      tipo: 'recargas',
      datos: recargasDetalle
    });
  };

  const abrirModalIngresos = () => {
    setModalData({
      titulo: 'Detalle de Ingresos del Mes',
      tipo: 'ingresos',
      datos: ingresosDetalle
    });
  };

  const abrirModalStockBajo = () => {
    setModalData({
      titulo: 'Productos con Stock Bajo',
      tipo: 'stock',
      datos: stockBajoDetalle
    });
  };

  const abrirModalVencidos = () => {
    setModalData({
      titulo: 'Extintores Vencidos',
      tipo: 'vencidos',
      datos: vencidosDetalle
    });
  };

  const abrirModalProximosVencer = () => {
    setModalData({
      titulo: 'Extintores Próximos a Vencer',
      tipo: 'proximos',
      datos: proximosVencerDetalle
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ width: '60px', height: '60px', border: '6px solid #e5e7eb', borderTop: '6px solid #ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>
          Resumen general del sistema - Haz clic en las tarjetas para ver más detalles
        </p>
      </div>

      {/* Stats principales - 4 columnas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <StatCard
          icon={Users}
          iconColor="#3b82f6"
          iconBg="#dbeafe"
          label="Total Clientes"
          value={stats.totalClientes}
          trend={stats.clientesTrend}
          onClick={abrirModalClientes}
        />
        <StatCard
          icon={Flame}
          iconColor="#f59e0b"
          iconBg="#fef3c7"
          label="Extintores Activos"
          value={stats.extintoresActivos}
          trend={stats.extintoresTrend}
          onClick={abrirModalExtintores}
        />
        <StatCard
          icon={RefreshCw}
          iconColor="#8b5cf6"
          iconBg="#ede9fe"
          label="Recargas del Mes"
          value={stats.recargasMes}
          trend={stats.recargasTrend}
          onClick={abrirModalRecargas}
        />
        <StatCard
          icon={DollarSign}
          iconColor="#10b981"
          iconBg="#d1fae5"
          label="Ingresos del Mes"
          value={`$${stats.ingresosMes.toFixed(2)}`}
          trend={stats.ingresosTrend}
          onClick={abrirModalIngresos}
        />
      </div>

      {/* Alertas y estado - 3 columnas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <AlertCard
          icon={AlertTriangle}
          label="Stock Bajo"
          value={stats.stockBajo}
          color="#f59e0b"
          borderColor="#f59e0b"
          onClick={abrirModalStockBajo}
        />
        <AlertCard
          icon={XCircle}
          label="Extintores Vencidos"
          value={stats.extintoresVencidos}
          color="#ef4444"
          borderColor="#ef4444"
          onClick={abrirModalVencidos}
        />
        <AlertCard
          icon={Calendar}
          label="Próximos a Vencer"
          value={stats.proximosVencer}
          color="#f59e0b"
          borderColor="#f59e0b"
          onClick={abrirModalProximosVencer}
        />
      </div>

      {/* Sección inferior - 2 columnas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Últimas Recargas */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#ede9fe', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={20} color="#8b5cf6" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>Últimas Recargas</h3>
          </div>

          {recientesRecargas.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>No hay recargas registradas</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recientesRecargas.map((recarga, index) => (
                <div key={index} style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>
                      Equipo #{recarga.extintor?.numeroEquipo || 'N/A'}
                    </p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>
                      {new Date(recarga.fechaRecarga).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#10b981' }}>
                      ${Number(recarga.precioTotal || 0).toFixed(2)}
                    </p>
                    <span style={{ 
                      fontSize: '11px', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      backgroundColor: recarga.estado === 'completada' ? '#d1fae5' : '#fef3c7',
                      color: recarga.estado === 'completada' ? '#10b981' : '#f59e0b',
                      fontWeight: 'bold'
                    }}>
                      {recarga.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Extintores Críticos */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#fee2e2', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={20} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>Extintores Críticos</h3>
          </div>

          {extintoresCriticos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <CheckCircle size={40} color="#10b981" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: '#10b981', fontWeight: 'bold' }}>¡Todo en orden!</p>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>No hay extintores vencidos o próximos a vencer</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {extintoresCriticos.map((extintor, index) => {
                const vencimiento = new Date(extintor.fechaVencimiento);
                const ahora = new Date();
                const esVencido = vencimiento < ahora;
                
                return (
                  <div key={index} style={{ 
                    padding: '12px', 
                    backgroundColor: esVencido ? '#fee2e2' : '#fef3c7', 
                    borderRadius: '8px',
                    borderLeft: `4px solid ${esVencido ? '#ef4444' : '#f59e0b'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>
                          Equipo #{extintor.numeroEquipo}
                        </p>
                        <p style={{ fontSize: '12px', color: '#6b7280' }}>
                          {extintor.cliente?.nombre || 'Cliente desconocido'}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '12px', fontWeight: 'bold', color: esVencido ? '#ef4444' : '#f59e0b' }}>
                          {esVencido ? 'VENCIDO' : 'POR VENCER'}
                        </p>
                        <p style={{ fontSize: '11px', color: '#6b7280' }}>
                          {vencimiento.toLocaleDateString('es-AR')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Indicador de tasa de mantenimiento */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        padding: '24px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginTop: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#d1fae5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={20} color="#10b981" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>Tasa de Mantenimiento</h3>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Extintores activos vs total</p>
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
            {stats.tasaMantenimiento}%
          </div>
        </div>
        <div style={{ 
          width: '100%', 
          height: '12px', 
          backgroundColor: '#e5e7eb', 
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${stats.tasaMantenimiento}%`,
            height: '100%',
            backgroundColor: '#10b981',
            borderRadius: '6px',
            transition: 'width 0.5s ease'
          }}></div>
        </div>
      </div>

      {/* Modal de detalles */}
      {modalData && (
        <DetalleModal
          datos={modalData}
          onClose={() => setModalData(null)}
        />
      )}
    </div>
  );
}

// Componente de tarjeta de estadística (con onClick)
function StatCard({ icon: Icon, iconColor, iconBg, label, value, trend, onClick }) {
  const isPositive = trend > 0;
  const isNeutral = trend === 0;
  const trendColor = isPositive ? '#10b981' : isNeutral ? '#6b7280' : '#ef4444';
  const TrendIcon = isPositive ? TrendingUp : isNeutral ? null : TrendingDown;

  return (
    <div 
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        position: 'relative'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: iconBg,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={24} color={iconColor} />
        </div>
        {!isNeutral && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {TrendIcon && <TrendIcon size={14} color={trendColor} />}
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: trendColor }}>
              {isPositive ? '+' : ''}{trend}%
            </span>
          </div>
        )}
        {isNeutral && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: trendColor }}>
              Sin cambios
            </span>
          </div>
        )}
      </div>
      <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
        {value}
      </p>
      <p style={{ fontSize: '14px', color: '#6b7280' }}>
        {label}
      </p>
    </div>
  );
}

// Componente de tarjeta de alerta (con onClick)
function AlertCard({ icon: Icon, label, value, color, borderColor, onClick }) {
  return (
    <div 
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: `2px solid ${borderColor}`,
        transition: 'transform 0.2s ease',
        cursor: 'pointer',
        position: 'relative'
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          backgroundColor: `${color}20`,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={28} color={color} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>
            {value}
          </p>
          <p style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

// Modal de detalles
function DetalleModal({ datos, onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '800px',
        maxHeight: '80vh',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '2px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ef4444',
          color: 'white'
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>
            {datos.titulo}
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div style={{ padding: '24px', maxHeight: 'calc(80vh - 100px)', overflowY: 'auto' }}>
          {datos.datos.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
              No hay datos para mostrar
            </p>
          ) : (
            <ModalContent tipo={datos.tipo} datos={datos.datos} />
          )}
        </div>
      </div>
    </div>
  );
}

// Contenido del modal según el tipo
function ModalContent({ tipo, datos }) {
  if (tipo === 'clientes') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {datos.map((cliente, index) => (
          <div key={index} style={{ 
            padding: '16px', 
            backgroundColor: '#f9fafb', 
            borderRadius: '8px',
            borderLeft: '4px solid #3b82f6'
          }}>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
              {cliente.nombre}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
              {cliente.cuit && <p><strong>CUIT:</strong> {cliente.cuit}</p>}
              {cliente.telefono && <p><strong>Teléfono:</strong> {cliente.telefono}</p>}
              {cliente.email && <p><strong>Email:</strong> {cliente.email}</p>}
              <p><strong>Fecha alta:</strong> {new Date(cliente.createdAt).toLocaleDateString('es-AR')}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tipo === 'extintores') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {datos.map((extintor, index) => (
          <div key={index} style={{ 
            padding: '16px', 
            backgroundColor: '#f9fafb', 
            borderRadius: '8px',
            borderLeft: '4px solid #f59e0b'
          }}>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
              Equipo #{extintor.numeroEquipo}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
              <p><strong>Tipo:</strong> {extintor.tipo}</p>
              <p><strong>Capacidad:</strong> {extintor.capacidad} kg</p>
              <p><strong>Cliente:</strong> {extintor.cliente?.nombre || 'N/A'}</p>
              <p><strong>Estado:</strong> <span style={{ 
                padding: '2px 8px', 
                borderRadius: '4px',
                backgroundColor: extintor.estado === 'activo' ? '#d1fae5' : '#fee2e2',
                color: extintor.estado === 'activo' ? '#10b981' : '#ef4444'
              }}>{extintor.estado}</span></p>
              <p><strong>Vencimiento:</strong> {new Date(extintor.fechaVencimiento).toLocaleDateString('es-AR')}</p>
              <p><strong>Fecha alta:</strong> {new Date(extintor.createdAt).toLocaleDateString('es-AR')}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tipo === 'recargas') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {datos.map((recarga, index) => (
          <div key={index} style={{ 
            padding: '16px', 
            backgroundColor: '#f9fafb', 
            borderRadius: '8px',
            borderLeft: '4px solid #8b5cf6'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>
                Equipo #{recarga.extintor?.numeroEquipo || 'N/A'}
              </p>
              <span style={{ 
                fontSize: '12px', 
                padding: '4px 12px', 
                borderRadius: '6px',
                backgroundColor: recarga.estado === 'completada' ? '#d1fae5' : '#fef3c7',
                color: recarga.estado === 'completada' ? '#10b981' : '#f59e0b',
                fontWeight: 'bold'
              }}>
                {recarga.estado}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
              <p><strong>Cliente:</strong> {recarga.cliente?.nombre || 'N/A'}</p>
              <p><strong>Precio:</strong> <span style={{ color: '#10b981', fontWeight: 'bold' }}>${Number(recarga.precioTotal || 0).toFixed(2)}</span></p>
              <p><strong>Fecha:</strong> {new Date(recarga.fechaRecarga).toLocaleDateString('es-AR')}</p>
              <p><strong>Próxima:</strong> {new Date(recarga.fechaProximaRecarga).toLocaleDateString('es-AR')}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tipo === 'ingresos') {
    const total = datos.reduce((sum, r) => sum + Number(r.precioTotal || 0), 0);
    return (
      <div>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#d1fae5', 
          borderRadius: '12px', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Total de Ingresos</p>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981' }}>
            ${total.toFixed(2)}
          </p>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            {datos.length} recarga{datos.length !== 1 ? 's' : ''} completada{datos.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {datos.map((recarga, index) => (
            <div key={index} style={{ 
              padding: '16px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>
                  Equipo #{recarga.extintor?.numeroEquipo || 'N/A'}
                </p>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>
                  {new Date(recarga.fechaRecarga).toLocaleDateString('es-AR')}
                </p>
              </div>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
                ${Number(recarga.precioTotal || 0).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tipo === 'stock') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {datos.map((producto, index) => {
          const porcentajeStock = (Number(producto.stockActual) / Number(producto.stockMinimo)) * 100;
          return (
            <div key={index} style={{ 
              padding: '16px', 
              backgroundColor: '#fef3c7', 
              borderRadius: '8px',
              borderLeft: '4px solid #f59e0b'
            }}>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                {producto.nombre}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                <p><strong>Stock actual:</strong> <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{Number(producto.stockActual).toFixed(2)} {producto.unidadMedida}</span></p>
                <p><strong>Stock mínimo:</strong> {Number(producto.stockMinimo).toFixed(2)} {producto.unidadMedida}</p>
                <p><strong>Categoría:</strong> {producto.categoria}</p>
              </div>
              {/* Barra de progreso */}
              <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min(porcentajeStock, 100)}%`,
                  height: '100%',
                  backgroundColor: porcentajeStock < 50 ? '#ef4444' : '#f59e0b',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (tipo === 'vencidos' || tipo === 'proximos') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {datos.map((extintor, index) => {
          const vencimiento = new Date(extintor.fechaVencimiento);
          const hoy = new Date();
          const diasDiferencia = Math.floor((vencimiento - hoy) / (1000 * 60 * 60 * 24));
          const esVencido = diasDiferencia < 0;

          return (
            <div key={index} style={{ 
              padding: '16px', 
              backgroundColor: esVencido ? '#fee2e2' : '#fef3c7', 
              borderRadius: '8px',
              borderLeft: `4px solid ${esVencido ? '#ef4444' : '#f59e0b'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>
                  Equipo #{extintor.numeroEquipo}
                </p>
                <span style={{ 
                  fontSize: '12px', 
                  padding: '4px 12px', 
                  borderRadius: '6px',
                  backgroundColor: esVencido ? '#ef4444' : '#f59e0b',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  {esVencido ? 'VENCIDO' : `${diasDiferencia} días`}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                <p><strong>Cliente:</strong> {extintor.cliente?.nombre || 'N/A'}</p>
                <p><strong>Tipo:</strong> {extintor.tipo}</p>
                <p><strong>Ubicación:</strong> {extintor.ubicacion || 'N/A'}</p>
                <p><strong>Vencimiento:</strong> {vencimiento.toLocaleDateString('es-AR')}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}

export default Dashboard;
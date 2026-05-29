import { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Download,
  FileText,
  X,
  ChevronDown,
  Flame,
  Shield,
  FileSpreadsheet,
  File,
  Check
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../contexts/ThemeContext';
import { recursosEducativosAPI } from '../services/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


function GuiaTecnicaPage() {
  const { colors } = useTheme();
  const [recursos, setRecursos] = useState([]);
  const [filtrosDisponibles, setFiltrosDisponibles] = useState({});
  const [loading, setLoading] = useState(true);
  const [showFiltros, setShowFiltros] = useState(false);
  const [seleccionados, setSeleccionados] = useState([]);
  const [formatoSeleccionado, setFormatoSeleccionado] = useState('pdf');
  
  const [filtros, setFiltros] = useState({
    categoria: '',
    tipoFuego: '',
    tipoExtintor: '',
    aplicacion: '',
    search: '',
  });

  const [recursoDetalle, setRecursoDetalle] = useState(null);

  useEffect(() => {
    fetchData();
    fetchFiltros();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await recursosEducativosAPI.getPublic(filtros);
      setRecursos(data);
      setSeleccionados([]);
    } catch (error) {
      console.error('Error al cargar recursos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFiltros = async () => {
    try {
      const data = await recursosEducativosAPI.getFilters();
      setFiltrosDisponibles(data);
    } catch (error) {
      console.error('Error al cargar filtros:', error);
    }
  };

  const handleFiltrar = () => {
    fetchData();
    setShowFiltros(false);
  };

  const limpiarFiltros = () => {
    setFiltros({
      categoria: '',
      tipoFuego: '',
      tipoExtintor: '',
      aplicacion: '',
      search: '',
    });
    setTimeout(() => fetchData(), 100);
  };

  // ==================== SELECCIÓN ====================

  const toggleSeleccion = (recursoId) => {
    setSeleccionados(prev => 
      prev.includes(recursoId) 
        ? prev.filter(id => id !== recursoId)
        : [...prev, recursoId]
    );
  };

  const toggleSeleccionTodos = () => {
    if (seleccionados.length === recursos.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(recursos.map(r => r.id));
    }
  };

  // ==================== FUNCIONES DE EXPORTACIÓN ====================

  const exportarPDF = (recursosAExportar) => {
    const doc = new jsPDF();
    doc.setFillColor(239, 68, 68);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('ZD MATAFUEGOS', 105, 15, { align: 'center' });
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Guia Tecnica de Extintores', 105, 25, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Total de recursos: ' + recursosAExportar.length, 105, 33, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    let yPos = 50;
    
    recursosAExportar.forEach((recurso) => {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(239, 68, 68);
      doc.text(recurso.titulo, 15, yPos);
      yPos += 7;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('Categoria: ' + getCategoriaLabel(recurso.categoria), 15, yPos);
      yPos += 5;
      
      let tags = [];
      if (recurso.tipoFuego) tags.push('Fuego: ' + recurso.tipoFuego);
      if (recurso.tipoExtintor) tags.push('Extintor: ' + recurso.tipoExtintor);
      if (recurso.capacidad) tags.push('Capacidad: ' + recurso.capacidad);
      if (recurso.aplicacion) tags.push('Aplicacion: ' + recurso.aplicacion);
      
      if (tags.length > 0) {
        doc.text(tags.join(' | '), 15, yPos);
        yPos += 5;
      }
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const descLines = doc.splitTextToSize(recurso.descripcion, 180);
      doc.text(descLines, 15, yPos);
      yPos += descLines.length * 5 + 3;
      
      if (recurso.contenidoDetallado) {
        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        const contentLines = doc.splitTextToSize(recurso.contenidoDetallado, 180);
        
        contentLines.forEach((line) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(line, 15, yPos);
          yPos += 4;
        });
      }
      
      yPos += 5;
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setDrawColor(200, 200, 200);
      doc.line(15, yPos, 195, yPos);
      yPos += 10;
      
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
    });
    
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('ZD Matafuegos - zdmatafuegos@gmail.com - Pagina ' + i + ' de ' + pageCount, 105, 290, { align: 'center' });
    }
    
    doc.save('ZD_Matafuegos_' + new Date().toISOString().split('T')[0] + '.pdf');
  };

  const exportarExcel = (recursosAExportar) => {
    const data = recursosAExportar.map(recurso => ({
      'Titulo': recurso.titulo,
      'Categoria': getCategoriaLabel(recurso.categoria),
      'Descripcion': recurso.descripcion,
      'Tipo de Fuego': recurso.tipoFuego || '-',
      'Tipo de Extintor': recurso.tipoExtintor || '-',
      'Capacidad': recurso.capacidad || '-',
      'Aplicacion': recurso.aplicacion || '-',
      'Contenido': recurso.contenidoDetallado || '-',
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [
      { wch: 30 },
      { wch: 20 },
      { wch: 40 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
      { wch: 20 },
      { wch: 60 },
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Recursos Educativos');
    XLSX.writeFile(wb, 'ZD_Matafuegos_' + new Date().toISOString().split('T')[0] + '.xlsx');
  };

  const exportarCSV = (recursosAExportar) => {
    const headers = ['Titulo', 'Categoria', 'Descripcion', 'Tipo de Fuego', 'Tipo de Extintor', 'Capacidad', 'Aplicacion', 'Contenido'];
    const rows = recursosAExportar.map(recurso => [
      recurso.titulo,
      getCategoriaLabel(recurso.categoria),
      recurso.descripcion,
      recurso.tipoFuego || '-',
      recurso.tipoExtintor || '-',
      recurso.capacidad || '-',
      recurso.aplicacion || '-',
      recurso.contenidoDetallado || '-',
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(','))
    ].join('\n');
    
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'ZD_Matafuegos_' + new Date().toISOString().split('T')[0] + '.csv');
  };

  const exportarWord = (recursosAExportar) => {
    let htmlContent = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Guia Tecnica - ZD Matafuegos</title><style>@page { margin: 2cm; } body { font-family: Calibri, Arial, sans-serif; line-height: 1.6; max-width: 21cm; margin: 0 auto; padding: 20px; color: #333; } .header { text-align: center; color: #ef4444; border-bottom: 4px solid #ef4444; padding-bottom: 20px; margin-bottom: 30px; } .header h1 { margin: 0; font-size: 36px; font-weight: bold; } .recurso { margin-bottom: 40px; border-left: 4px solid #ef4444; padding-left: 20px; } .recurso h2 { color: #ef4444; font-size: 22px; }</style></head><body><div class="header"><h1>ZD MATAFUEGOS</h1><p>Guia Tecnica de Extintores</p></div>';
    
    recursosAExportar.forEach(recurso => {
      htmlContent += '<div class="recurso"><h2>' + recurso.titulo + '</h2><p><strong>Categoria:</strong> ' + getCategoriaLabel(recurso.categoria) + '</p><p>' + recurso.descripcion + '</p>';
      if (recurso.contenidoDetallado) {
        htmlContent += '<p>' + recurso.contenidoDetallado + '</p>';
      }
      htmlContent += '</div>';
    });
    
    htmlContent += '</body></html>';
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    saveAs(blob, 'ZD_Matafuegos_' + new Date().toISOString().split('T')[0] + '.doc');
  };

  const handleDescargarSeleccionados = () => {
    const recursosSeleccionados = recursos.filter(r => seleccionados.includes(r.id));
    
    if (recursosSeleccionados.length === 0) {
      alert('Selecciona al menos un recurso para descargar');
      return;
    }

    switch(formatoSeleccionado) {
      case 'pdf':
        exportarPDF(recursosSeleccionados);
        break;
      case 'excel':
        exportarExcel(recursosSeleccionados);
        break;
      case 'csv':
        exportarCSV(recursosSeleccionados);
        break;
      case 'word':
        exportarWord(recursosSeleccionados);
        break;
      default:
        exportarPDF(recursosSeleccionados);
    }
  };

  const filtrosActivos = Object.values(filtros).filter(v => v !== '').length;

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', backgroundColor: colors.background, paddingTop: '80px', transition: 'all 0.3s ease' }}>
        {/* Header */}
        <div style={{ backgroundColor: '#ef4444', color: 'white', padding: '48px 24px', textAlign: 'center' }} className="guia-header">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '16px' }} className="header-content">
              <BookOpen size={48} className="header-icon" />
              <h1 style={{ fontSize: '40px', fontWeight: 'bold', margin: 0 }} className="header-title">Guia Tecnica de Extintores</h1>
            </div>
            <p style={{ fontSize: '18px', opacity: 0.9, margin: 0 }} className="header-subtitle">
              Toda la informacion que necesitas sobre extintores, tipos de fuego y normativas
            </p>
          </div>
        </div>

        {/* Contenido */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }} className="guia-container">
          
          {/* Barra de busqueda y filtros */}
          <div style={{ backgroundColor: colors.cardBg, padding: '24px', borderRadius: '12px', boxShadow: colors.shadow, border: '2px solid ' + colors.border, marginBottom: '24px', transition: 'all 0.3s ease' }} className="search-filters-card">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', alignItems: 'end' }} className="search-grid">
              {/* Busqueda */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: colors.text, transition: 'color 0.3s ease' }}>
                  Buscar
                </label>
                <div style={{ position: 'relative' }}>
                  <Search size={20} color={colors.textSecondary} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Buscar por titulo o descripcion..."
                    value={filtros.search}
                    onChange={(e) => setFiltros({ ...filtros, search: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && handleFiltrar()}
                    style={{ width: '100%', padding: '12px', paddingLeft: '48px', border: '2px solid ' + colors.border, borderRadius: '8px', fontSize: '16px', outline: 'none', backgroundColor: colors.background, color: colors.text, transition: 'all 0.3s ease' }}
                  />
                </div>
              </div>

              {/* Boton Filtros */}
              <button
                onClick={() => setShowFiltros(!showFiltros)}
                className="btn-filtros"
                style={{ 
                  padding: '12px 24px', 
                  backgroundColor: showFiltros ? '#ef4444' : colors.cardBg, 
                  color: showFiltros ? 'white' : colors.text,
                  border: '2px solid ' + colors.border, 
                  borderRadius: '8px', 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                <Filter size={20} />
                <span className="btn-text">Filtros {filtrosActivos > 0 && '(' + filtrosActivos + ')'}</span>
              </button>

              {/* Boton Buscar */}
              <button
                onClick={handleFiltrar}
                className="btn-buscar"
                style={{ padding: '12px 32px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
              >
                Buscar
              </button>
            </div>

            {/* Panel de Filtros */}
            {showFiltros && (
              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '2px solid ' + colors.border, transition: 'all 0.3s ease' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }} className="filters-grid">
                  {/* Categoria */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: colors.text, transition: 'color 0.3s ease' }}>
                      Categoria
                    </label>
                    <select
                      value={filtros.categoria}
                      onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '2px solid ' + colors.border, borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: colors.background, color: colors.text, cursor: 'pointer', transition: 'all 0.3s ease' }}
                    >
                      <option value="">Todas</option>
                      {filtrosDisponibles.categorias && filtrosDisponibles.categorias.map(cat => (
                        <option key={cat} value={cat}>{getCategoriaLabel(cat)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tipo de Fuego */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: colors.text, transition: 'color 0.3s ease' }}>
                      Tipo de Fuego
                    </label>
                    <select
                      value={filtros.tipoFuego}
                      onChange={(e) => setFiltros({ ...filtros, tipoFuego: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '2px solid ' + colors.border, borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: colors.background, color: colors.text, cursor: 'pointer', transition: 'all 0.3s ease' }}
                    >
                      <option value="">Todos</option>
                      {filtrosDisponibles.tiposFuego && filtrosDisponibles.tiposFuego.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tipo de Extintor */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: colors.text, transition: 'color 0.3s ease' }}>
                      Tipo de Extintor
                    </label>
                    <select
                      value={filtros.tipoExtintor}
                      onChange={(e) => setFiltros({ ...filtros, tipoExtintor: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '2px solid ' + colors.border, borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: colors.background, color: colors.text, cursor: 'pointer', transition: 'all 0.3s ease' }}
                    >
                      <option value="">Todos</option>
                      {filtrosDisponibles.tiposExtintor && filtrosDisponibles.tiposExtintor.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </div>

                  {/* Aplicacion */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: colors.text, transition: 'color 0.3s ease' }}>
                      Aplicacion
                    </label>
                    <select
                      value={filtros.aplicacion}
                      onChange={(e) => setFiltros({ ...filtros, aplicacion: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '2px solid ' + colors.border, borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: colors.background, color: colors.text, cursor: 'pointer', transition: 'all 0.3s ease' }}
                    >
                      <option value="">Todas</option>
                      {filtrosDisponibles.aplicaciones && filtrosDisponibles.aplicaciones.map(app => (
                        <option key={app} value={app}>{app}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={limpiarFiltros}
                    style={{ padding: '8px 16px', backgroundColor: colors.background, color: colors.text, border: '2px solid ' + colors.border, borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s ease' }}
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Barra de seleccion y descarga */}
          {recursos.length > 0 && (
            <div style={{ 
              backgroundColor: colors.cardBg, 
              padding: '20px', 
              borderRadius: '12px', 
              boxShadow: colors.shadow, 
              border: '2px solid ' + colors.border, 
              marginBottom: '24px',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              flexWrap: 'wrap',
              transition: 'all 0.3s ease'
            }}>
              {/* Checkbox seleccionar todos */}
              <button
                onClick={toggleSeleccionTodos}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '10px 20px', 
                  backgroundColor: colors.background, 
                  color: colors.text, 
                  border: '2px solid ' + colors.border, 
                  borderRadius: '8px', 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  border: '2px solid ' + (seleccionados.length === recursos.length ? '#ef4444' : colors.border), 
                  borderRadius: '4px',
                  backgroundColor: seleccionados.length === recursos.length ? '#ef4444' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {seleccionados.length === recursos.length && <Check size={14} color="white" />}
                </div>
                <span>{seleccionados.length === recursos.length ? 'Deseleccionar todos' : 'Seleccionar todos'}</span>
              </button>

              {/* Contador de seleccionados */}
              {seleccionados.length > 0 && (
                <div style={{ 
                  padding: '10px 16px', 
                  backgroundColor: '#ef4444', 
                  color: 'white', 
                  borderRadius: '8px', 
                  fontSize: '14px', 
                  fontWeight: 'bold'
                }}>
                  {seleccionados.length} seleccionado{seleccionados.length !== 1 ? 's' : ''}
                </div>
              )}

              {/* Selector de formato */}
              {seleccionados.length > 0 && (
                <>
                  <select
                    value={formatoSeleccionado}
                    onChange={(e) => setFormatoSeleccionado(e.target.value)}
                    style={{
                      padding: '10px 16px',
                      border: '2px solid ' + colors.border,
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      backgroundColor: colors.background,
                      color: colors.text,
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    <option value="pdf">📄 PDF</option>
                    <option value="excel">📊 Excel</option>
                    <option value="csv">📋 CSV</option>
                    <option value="word">📝 Word</option>
                  </select>

                  {/* Boton descargar */}
                  <button
                    onClick={handleDescargarSeleccionados}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      padding: '10px 20px', 
                      backgroundColor: '#059669', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      fontSize: '14px', 
                      fontWeight: 'bold', 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#047857'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                  >
                    <Download size={18} />
                    <span>Descargar seleccionados</span>
                  </button>
                </>
              )}
            </div>
          )}

          {/* Resultados */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
              <div style={{ width: '60px', height: '60px', border: '6px solid ' + colors.border, borderTop: '6px solid #ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : recursos.length === 0 ? (
            <div style={{ backgroundColor: colors.cardBg, padding: '48px', borderRadius: '12px', textAlign: 'center', boxShadow: colors.shadow, border: '2px solid ' + colors.border, transition: 'all 0.3s ease' }}>
              <BookOpen size={48} color={colors.textSecondary} style={{ margin: '0 auto 16px' }} />
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: colors.text, marginBottom: '8px', transition: 'color 0.3s ease' }}>No se encontraron recursos</p>
              <p style={{ fontSize: '14px', color: colors.textSecondary, transition: 'color 0.3s ease' }}>Intenta ajustar los filtros de busqueda</p>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '16px', transition: 'color 0.3s ease' }}>
                Mostrando <strong style={{ color: colors.text }}>{recursos.length}</strong> resultado{recursos.length !== 1 ? 's' : ''}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }} className="recursos-grid">
                {recursos.map((recurso) => (
                  <div
                    key={recurso.id}
                    className="recurso-card"
                    style={{ 
                      backgroundColor: '#656565',
                      padding: '24px', 
                      borderRadius: '12px', 
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      border: '2px solid ' + (seleccionados.includes(recurso.id) ? '#ef4444' : '#5e5e5e'),
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: '380px',
                      position: 'relative'
                    }}
                    onMouseOver={(e) => {
                      if (!seleccionados.includes(recurso.id)) {
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        e.currentTarget.style.transform = 'translateY(-4px)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!seleccionados.includes(recurso.id)) {
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {/* Checkbox de seleccion */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSeleccion(recurso.id);
                      }}
                      style={{ 
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '24px',
                        height: '24px',
                        border: '2px solid ' + (seleccionados.includes(recurso.id) ? '#ef4444' : '#9ca3af'),
                        borderRadius: '4px',
                        backgroundColor: seleccionados.includes(recurso.id) ? '#ef4444' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {seleccionados.includes(recurso.id) && <Check size={16} color="white" />}
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ 
                        padding: '4px 12px', 
                        backgroundColor: getCategoriaColor(recurso.categoria).bg, 
                        color: getCategoriaColor(recurso.categoria).text, 
                        borderRadius: '6px', 
                        fontSize: '12px', 
                        fontWeight: 'bold' 
                      }}>
                        {getCategoriaLabel(recurso.categoria)}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: colors.text, marginBottom: '8px', lineHeight: '1.3', transition: 'color 0.3s ease', paddingRight: '32px' }}>
                      {recurso.titulo}
                    </h3>

                    <p style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '16px', lineHeight: '1.5', flex: 1, transition: 'color 0.3s ease' }}>
                      {recurso.descripcion}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                      {recurso.tipoFuego && (
                        <span style={{ padding: '4px 8px', backgroundColor: '#e33e3e', color: '#fee2e2', borderRadius: '4px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Flame size={14} />
                          {recurso.tipoFuego}
                        </span>
                      )}
                      {recurso.tipoExtintor && (
                        <span style={{ padding: '4px 8px', backgroundColor: '#396edf', color: '#dbeafe', borderRadius: '4px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Shield size={14} />
                          {recurso.tipoExtintor}
                        </span>
                      )}
                    </div>

                    {/* Boton ver detalles */}
                    <button
                      onClick={() => setRecursoDetalle(recurso)}
                      style={{ 
                        width: '100%',
                        padding: '10px', 
                        backgroundColor: '#ef4444', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        fontSize: '14px', 
                        fontWeight: 'bold', 
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                    >
                      Ver detalles
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Detalle */}
        {recursoDetalle && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }} onClick={() => setRecursoDetalle(null)}>
            <div style={{ backgroundColor: colors.cardBg, borderRadius: '16px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', transition: 'all 0.3s ease' }} onClick={(e) => e.stopPropagation()} className="modal-content">
              <div style={{ padding: '24px', borderBottom: '2px solid ' + colors.border, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: colors.cardBg, zIndex: 10, transition: 'all 0.3s ease' }} className="modal-header">
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: colors.text, transition: 'color 0.3s ease' }} className="modal-title">{recursoDetalle.titulo}</h2>
                <button onClick={() => setRecursoDetalle(null)} style={{ padding: '8px', backgroundColor: colors.background, border: '2px solid ' + colors.border, borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                  <X size={24} color={colors.text} />
                </button>
              </div>
              
              <div style={{ padding: '32px' }} className="modal-body">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                  <span style={{ padding: '6px 12px', backgroundColor: getCategoriaColor(recursoDetalle.categoria).bg, color: getCategoriaColor(recursoDetalle.categoria).text, borderRadius: '6px', fontSize: '14px', fontWeight: 'bold' }}>
                    {getCategoriaLabel(recursoDetalle.categoria)}
                  </span>
                  {recursoDetalle.tipoFuego && (
                    <span style={{ padding: '6px 12px', backgroundColor: '#dc2626', color: '#fee2e2', borderRadius: '6px', fontSize: '14px' }}>
                      Fuego: {recursoDetalle.tipoFuego}
                    </span>
                  )}
                  {recursoDetalle.tipoExtintor && (
                    <span style={{ padding: '6px 12px', backgroundColor: '#2563eb', color: '#dbeafe', borderRadius: '6px', fontSize: '14px' }}>
                      Extintor: {recursoDetalle.tipoExtintor}
                    </span>
                  )}
                  {recursoDetalle.aplicacion && (
                    <span style={{ padding: '6px 12px', backgroundColor: '#059669', color: '#d1fae5', borderRadius: '6px', fontSize: '14px' }}>
                      {recursoDetalle.aplicacion}
                    </span>
                  )}
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: colors.text, marginBottom: '8px', transition: 'color 0.3s ease' }}>Descripcion</h3>
                  <p style={{ fontSize: '14px', color: colors.textSecondary, lineHeight: '1.6', transition: 'color 0.3s ease' }}>{recursoDetalle.descripcion}</p>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: colors.text, marginBottom: '8px', transition: 'color 0.3s ease' }}>Informacion Detallada</h3>
                  <p style={{ fontSize: '14px', color: colors.text, lineHeight: '1.8', whiteSpace: 'pre-wrap', transition: 'color 0.3s ease' }}>
                    {recursoDetalle.contenidoDetallado}
                  </p>
                </div>

                {recursoDetalle.archivoPdfUrl && (
                  <a
                    href={recursoDetalle.archivoPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      padding: '10px 20px', 
                      backgroundColor: '#dc2626', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      fontSize: '14px', 
                      fontWeight: 'bold', 
                      textDecoration: 'none',
                      cursor: 'pointer',
                      justifyContent: 'center'
                    }}
                  >
                    <FileText size={18} />
                    Descargar PDF
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .guia-header { padding: 32px 20px !important; }
          .header-icon { width: 40px !important; height: 40px !important; }
          .header-title { font-size: 28px !important; }
          .header-subtitle { font-size: 16px !important; }
          .guia-container { padding: 24px 16px !important; }
          .search-filters-card { padding: 20px !important; }
          .search-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
          .btn-filtros, .btn-buscar { width: 100% !important; justify-content: center !important; }
          .filters-grid { grid-template-columns: 1fr !important; }
          .recursos-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .modal-content { max-width: 95% !important; }
          .modal-header { padding: 16px !important; }
          .modal-title { font-size: 20px !important; }
          .modal-body { padding: 24px 16px !important; }
        }
        @media (max-width: 480px) {
          .header-content { flex-direction: column !important; gap: 12px !important; }
          .header-title { font-size: 24px !important; text-align: center !important; }
          .header-subtitle { font-size: 14px !important; }
          .btn-text { font-size: 14px !important; }
        }
      `}</style>
    </>
  );
}

const getCategoriaLabel = (categoria) => {
  const labels = {
    tipo_fuego: 'Tipo de Fuego',
    tipo_extintor: 'Tipo Extintor',
    normativa: 'Normativa',
    mantenimiento: 'Mantenimiento',
    uso: 'Uso/Aplicacion',
  };
  return labels[categoria] || categoria;
};

const getCategoriaColor = (categoria) => {
  const colors = {
    tipo_fuego: { bg: '#de3f3f', text: '#fee2e2' },
    tipo_extintor: { bg: '#4a7eef', text: '#dbeafe' },
    normativa: { bg: '#eeb24c', text: '#fef3c7' },
    mantenimiento: { bg: '#319b79', text: '#d1fae5' },
    uso: { bg: '#a873db', text: '#e0e7ff' },
  };
  return colors[categoria] || { bg: '#f3f4f6', text: '#6b7280' };
};

export default GuiaTecnicaPage;
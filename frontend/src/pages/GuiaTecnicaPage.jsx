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
  File
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

  // ==================== EXPORTACIONES ====================

  const handleExportarPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(239, 68, 68);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('ZD MATAFUEGOS', 105, 15, { align: 'center' });
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Guía Técnica de Extintores', 105, 25, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Total de recursos: ${recursos.length}`, 105, 33, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    let yPos = 50;
    
    recursos.forEach((recurso, index) => {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(239, 68, 68);
      doc.text(recurso.titulo, 15, yPos);
      yPos += 7;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Categoría: ${getCategoriaLabel(recurso.categoria)}`, 15, yPos);
      yPos += 5;
      
      let tags = [];
      if (recurso.tipoFuego) tags.push(`Fuego: ${recurso.tipoFuego}`);
      if (recurso.tipoExtintor) tags.push(`Extintor: ${recurso.tipoExtintor}`);
      if (recurso.capacidad) tags.push(`Capacidad: ${recurso.capacidad}`);
      if (recurso.aplicacion) tags.push(`Aplicación: ${recurso.aplicacion}`);
      
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
        
        contentLines.forEach((line, lineIndex) => {
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
      doc.text(`ZD Matafuegos - zdmatafuegos@gmail.com - Página ${i} de ${pageCount}`, 105, 290, { align: 'center' });
    }
    
    doc.save(`ZD_Matafuegos_Guia_Tecnica_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleExportarExcel = () => {
    const data = recursos.map(recurso => ({
      'Título': recurso.titulo,
      'Categoría': getCategoriaLabel(recurso.categoria),
      'Descripción': recurso.descripcion,
      'Tipo de Fuego': recurso.tipoFuego || '-',
      'Tipo de Extintor': recurso.tipoExtintor || '-',
      'Capacidad': recurso.capacidad || '-',
      'Aplicación': recurso.aplicacion || '-',
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
    XLSX.writeFile(wb, `ZD_Matafuegos_Guia_Tecnica_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleExportarCSV = () => {
    const headers = ['Título', 'Categoría', 'Descripción', 'Tipo de Fuego', 'Tipo de Extintor', 'Capacidad', 'Aplicación', 'Contenido'];
    const rows = recursos.map(recurso => [
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
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `ZD_Matafuegos_Guia_Tecnica_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportarWord = () => {
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Guía Técnica - ZD Matafuegos</title>
        <style>
          @page { margin: 2cm; }
          body { font-family: 'Calibri', Arial, sans-serif; line-height: 1.6; max-width: 21cm; margin: 0 auto; padding: 20px; color: #333; }
          .header { text-align: center; color: #ef4444; border-bottom: 4px solid #ef4444; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { margin: 0; font-size: 36px; font-weight: bold; }
          .recurso { margin-bottom: 40px; border-left: 4px solid #ef4444; padding-left: 20px; }
          .recurso h2 { color: #ef4444; font-size: 22px; }
        </style>
      </head>
      <body>
        <div class="header"><h1>ZD MATAFUEGOS</h1><p>Guía Técnica de Extintores</p></div>
    `;
    
    recursos.forEach(recurso => {
      htmlContent += `<div class="recurso"><h2>${recurso.titulo}</h2><p>${recurso.descripcion}</p></div>`;
    });
    
    htmlContent += `</body></html>`;
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    saveAs(blob, `ZD_Matafuegos_Guia_Tecnica_${new Date().toISOString().split('T')[0]}.doc`);
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
              <h1 style={{ fontSize: '40px', fontWeight: 'bold', margin: 0 }} className="header-title">Guía Técnica de Extintores</h1>
            </div>
            <p style={{ fontSize: '18px', opacity: 0.9, margin: 0 }} className="header-subtitle">
              Toda la información que necesitás sobre extintores, tipos de fuego y normativas
            </p>
          </div>
        </div>

        {/* Contenido */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }} className="guia-container">
          
          {/* Barra de búsqueda y filtros */}
          <div style={{ backgroundColor: colors.cardBg, padding: '24px', borderRadius: '12px', boxShadow: colors.shadow, border: `2px solid ${colors.border}`, marginBottom: '24px', transition: 'all 0.3s ease' }} className="search-filters-card">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', alignItems: 'end' }} className="search-grid">
              {/* Búsqueda */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: colors.text, transition: 'color 0.3s ease' }}>
                  Buscar
                </label>
                <div style={{ position: 'relative' }}>
                  <Search size={20} color={colors.textSecondary} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Buscar por título o descripción..."
                    value={filtros.search}
                    onChange={(e) => setFiltros({ ...filtros, search: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && handleFiltrar()}
                    style={{ width: '100%', padding: '12px', paddingLeft: '48px', border: `2px solid ${colors.border}`, borderRadius: '8px', fontSize: '16px', outline: 'none', backgroundColor: colors.background, color: colors.text, transition: 'all 0.3s ease' }}
                  />
                </div>
              </div>

              {/* Botón Filtros */}
              <button
                onClick={() => setShowFiltros(!showFiltros)}
                className="btn-filtros"
                style={{ 
                  padding: '12px 24px', 
                  backgroundColor: showFiltros ? '#ef4444' : colors.cardBg, 
                  color: showFiltros ? 'white' : colors.text,
                  border: `2px solid ${colors.border}`, 
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
                <span className="btn-text">Filtros {filtrosActivos > 0 && `(${filtrosActivos})`}</span>
              </button>

              {/* Botón Buscar */}
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
              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `2px solid ${colors.border}`, transition: 'all 0.3s ease' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }} className="filters-grid">
                  {/* Categoría */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: colors.text, transition: 'color 0.3s ease' }}>
                      Categoría
                    </label>
                    <select
                      value={filtros.categoria}
                      onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: `2px solid ${colors.border}`, borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: colors.background, color: colors.text, cursor: 'pointer', transition: 'all 0.3s ease' }}
                    >
                      <option value="">Todas</option>
                      {filtrosDisponibles.categorias?.map(cat => (
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
                      style={{ width: '100%', padding: '12px', border: `2px solid ${colors.border}`, borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: colors.background, color: colors.text, cursor: 'pointer', transition: 'all 0.3s ease' }}
                    >
                      <option value="">Todos</option>
                      {filtrosDisponibles.tiposFuego?.map(tipo => (
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
                      style={{ width: '100%', padding: '12px', border: `2px solid ${colors.border}`, borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: colors.background, color: colors.text, cursor: 'pointer', transition: 'all 0.3s ease' }}
                    >
                      <option value="">Todos</option>
                      {filtrosDisponibles.tiposExtintor?.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </div>

                  {/* Aplicación */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: colors.text, transition: 'color 0.3s ease' }}>
                      Aplicación
                    </label>
                    <select
                      value={filtros.aplicacion}
                      onChange={(e) => setFiltros({ ...filtros, aplicacion: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: `2px solid ${colors.border}`, borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: colors.background, color: colors.text, cursor: 'pointer', transition: 'all 0.3s ease' }}
                    >
                      <option value="">Todas</option>
                      {filtrosDisponibles.aplicaciones?.map(app => (
                        <option key={app} value={app}>{app}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={limpiarFiltros}
                    style={{ padding: '8px 16px', backgroundColor: colors.background, color: colors.text, border: `2px solid ${colors.border}`, borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s ease' }}
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Botones de exportación */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', justifyContent: 'flex-end', flexWrap: 'wrap' }} className="export-buttons">
            <button
              onClick={handleExportarPDF}
              disabled={recursos.length === 0}
              className="export-btn"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '10px 20px', 
                backgroundColor: recursos.length === 0 ? '#d1d5db' : '#dc2626', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                cursor: recursos.length === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => recursos.length > 0 && (e.currentTarget.style.backgroundColor = '#b91c1c')}
              onMouseOut={(e) => recursos.length > 0 && (e.currentTarget.style.backgroundColor = '#dc2626')}
            >
              <FileText size={18} />
              <span className="export-text">Exportar PDF</span>
            </button>
            
            <button
              onClick={handleExportarExcel}
              disabled={recursos.length === 0}
              className="export-btn"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '10px 20px', 
                backgroundColor: recursos.length === 0 ? '#d1d5db' : '#059669', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                cursor: recursos.length === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => recursos.length > 0 && (e.currentTarget.style.backgroundColor = '#047857')}
              onMouseOut={(e) => recursos.length > 0 && (e.currentTarget.style.backgroundColor = '#059669')}
            >
              <FileSpreadsheet size={18} />
              <span className="export-text">Exportar Excel</span>
            </button>
            
            <button
              onClick={handleExportarCSV}
              disabled={recursos.length === 0}
              className="export-btn"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '10px 20px', 
                backgroundColor: recursos.length === 0 ? '#d1d5db' : '#2563eb', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                cursor: recursos.length === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => recursos.length > 0 && (e.currentTarget.style.backgroundColor = '#1d4ed8')}
              onMouseOut={(e) => recursos.length > 0 && (e.currentTarget.style.backgroundColor = '#2563eb')}
            >
              <File size={18} />
              <span className="export-text">Exportar CSV</span>
            </button>
            
            <button
              onClick={handleExportarWord}
              disabled={recursos.length === 0}
              className="export-btn"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '10px 20px', 
                backgroundColor: recursos.length === 0 ? '#d1d5db' : '#7c3aed', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                cursor: recursos.length === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => recursos.length > 0 && (e.currentTarget.style.backgroundColor = '#6d28d9')}
              onMouseOut={(e) => recursos.length > 0 && (e.currentTarget.style.backgroundColor = '#7c3aed')}
            >
              <Download size={18} />
              <span className="export-text">Exportar Word</span>
            </button>
          </div>

          {/* Resultados */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
              <div style={{ width: '60px', height: '60px', border: `6px solid ${colors.border}`, borderTop: '6px solid #ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : recursos.length === 0 ? (
            <div style={{ backgroundColor: colors.cardBg, padding: '48px', borderRadius: '12px', textAlign: 'center', boxShadow: colors.shadow, border: `2px solid ${colors.border}`, transition: 'all 0.3s ease' }}>
              <BookOpen size={48} color={colors.textSecondary} style={{ margin: '0 auto 16px' }} />
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: colors.text, marginBottom: '8px', transition: 'color 0.3s ease' }}>No se encontraron recursos</p>
              <p style={{ fontSize: '14px', color: colors.textSecondary, transition: 'color 0.3s ease' }}>Intenta ajustar los filtros de búsqueda</p>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '16px', transition: 'color 0.3s ease' }}>
                Mostrando <strong style={{ color: colors.text }}>{recursos.length}</strong> resultado{recursos.length !== 1 ? 's' : ''}
              </p>

              {(() => {
                const recursosNormales = recursos.filter(r => (r.orden || 0) < 100);
                const recursosExternos = recursos.filter(r => (r.orden || 0) >= 100);

                return (
                  <>
                    {/* RECURSOS NORMALES */}
                    {recursosNormales.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginBottom: recursosExternos.length > 0 ? '48px' : '0' }} className="recursos-grid">
                        {recursosNormales.map((recurso) => (
                          <div
                            key={recurso.id}
                            className="recurso-card"
                            style={{ 
                              backgroundColor: '#a0a0a2',
                              padding: '24px', 
                              borderRadius: '12px', 
                              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                              border: '2px solid #a0a0a2',
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              minHeight: '320px'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                              e.currentTarget.style.transform = 'translateY(-4px)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            onClick={() => setRecursoDetalle(recurso)}
                          >
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

                            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: colors.text, marginBottom: '8px', lineHeight: '1.3', transition: 'color 0.3s ease' }}>
                              {recurso.titulo}
                            </h3>

                            <p style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '16px', lineHeight: '1.5', flex: 1, transition: 'color 0.3s ease' }}>
                              {recurso.descripcion}
                            </p>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                              {recurso.tipoFuego && (
                                <span style={{ padding: '4px 8px', backgroundColor: '#e33e3e', color: ' #fee2e2', borderRadius: '4px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Flame size={14} />
                                  {recurso.tipoFuego}
                                </span>
                              )}
                              {recurso.tipoExtintor && (
                                <span style={{ padding: '4px 8px', backgroundColor: '#396edf', color: ' #dbeafe', borderRadius: '4px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Shield size={14} />
                                  {recurso.tipoExtintor}
                                </span>
                              )}
                            </div>

                            <button
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
                    )}

                    {/* RECURSOS EXTERNOS */}
                    {recursosExternos.length > 0 && (
                      <div style={{ marginTop: recursosNormales.length > 0 ? '64px' : '0' }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: colors.text, marginBottom: '8px', transition: 'color 0.3s ease' }} className="externos-title">
                            Información de Interés Público
                          </h2>
                          <p style={{ fontSize: '16px', color: colors.textSecondary, transition: 'color 0.3s ease' }} className="externos-subtitle">
                            Documentación técnica oficial sobre el uso de extintores y prevención
                          </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="externos-list">
                          {recursosExternos.map((recurso) => (
                            <div
                              key={recurso.id}
                              className="externo-card"
                              style={{ 
                                backgroundColor: '#ef4444',
                                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                padding: '24px', 
                                borderRadius: '12px', 
                                boxShadow: '0 2px 8px rgba(239,68,68,0.3)',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(239,68,68,0.4)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(239,68,68,0.3)';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}
                            >
                              <div style={{ 
                                width: '64px', 
                                height: '64px', 
                                backgroundColor: 'rgba(255,255,255,0.2)', 
                                borderRadius: '12px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                flexShrink: 0
                              }} className="externo-icon">
                                <FileText size={32} color="white" />
                              </div>

                              <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }} className="externo-title">
                                  {recurso.titulo}
                                </h3>
                                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginBottom: '8px', lineHeight: '1.5' }} className="externo-description">
                                  {recurso.descripcion}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                  <span style={{ 
                                    padding: '4px 12px', 
                                    backgroundColor: 'rgba(255,255,255,0.2)', 
                                    color: 'white', 
                                    borderRadius: '6px', 
                                    fontSize: '12px', 
                                    fontWeight: 'bold'
                                  }}>
                                    🏛️ Fuente Oficial
                                  </span>
                                  <span style={{ 
                                    padding: '4px 12px', 
                                    backgroundColor: 'rgba(255,255,255,0.2)', 
                                    color: 'white', 
                                    borderRadius: '6px', 
                                    fontSize: '12px', 
                                    fontWeight: 'bold' 
                                  }}>
                                    {getCategoriaLabel(recurso.categoria)}
                                  </span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }} className="externo-actions">
                                {recurso.archivoPdfUrl && (
                                  <a
                                    href={recurso.archivoPdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="externo-download"
                                    style={{ 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      gap: '8px', 
                                      padding: '12px 24px', 
                                      backgroundColor: 'white', 
                                      color: '#ef4444', 
                                      border: 'none', 
                                      borderRadius: '8px', 
                                      fontSize: '14px', 
                                      fontWeight: 'bold', 
                                      textDecoration: 'none',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s ease',
                                      whiteSpace: 'nowrap'
                                    }}
                                    onMouseOver={(e) => {
                                      e.currentTarget.style.backgroundColor = '#fee2e2';
                                      e.currentTarget.style.transform = 'scale(1.05)';
                                    }}
                                    onMouseOut={(e) => {
                                      e.currentTarget.style.backgroundColor = 'white';
                                      e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                  >
                                    <Download size={18} />
                                    <span className="download-text">Descargar PDF</span>
                                  </a>
                                )}
                                <button
                                  onClick={() => setRecursoDetalle(recurso)}
                                  className="externo-details"
                                  style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px', 
                                    padding: '12px 24px', 
                                    backgroundColor: 'rgba(255,255,255,0.2)', 
                                    color: 'white', 
                                    border: '2px solid white', 
                                    borderRadius: '8px', 
                                    fontSize: '14px', 
                                    fontWeight: 'bold', 
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    whiteSpace: 'nowrap'
                                  }}
                                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                                >
                                  <span className="details-text">Ver detalles</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>

        {/* Modal Detalle */}
        {recursoDetalle && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }} onClick={() => setRecursoDetalle(null)}>
            <div style={{ backgroundColor: colors.cardBg, borderRadius: '16px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', transition: 'all 0.3s ease' }} onClick={(e) => e.stopPropagation()} className="modal-content">
              <div style={{ padding: '24px', borderBottom: `2px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: colors.cardBg, zIndex: 10, transition: 'all 0.3s ease' }} className="modal-header">
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: colors.text, transition: 'color 0.3s ease' }} className="modal-title">{recursoDetalle.titulo}</h2>
                <button onClick={() => setRecursoDetalle(null)} style={{ padding: '8px', backgroundColor: colors.background, border: `2px solid ${colors.border}`, borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                  <X size={24} color={colors.text} />
                </button>
              </div>
              
              <div style={{ padding: '32px' }} className="modal-body">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                  <span style={{ padding: '6px 12px', backgroundColor: getCategoriaColor(recursoDetalle.categoria).bg, color: getCategoriaColor(recursoDetalle.categoria).text, borderRadius: '6px', fontSize: '14px', fontWeight: 'bold' }}>
                    {getCategoriaLabel(recursoDetalle.categoria)}
                  </span>
                  {recursoDetalle.tipoFuego && (
                    <span style={{ padding: '6px 12px', backgroundColor: '#dc2626', color: ' #fee2e2', borderRadius: '6px', fontSize: '14px' }}>
                      Fuego: {recursoDetalle.tipoFuego}
                    </span>
                  )}
                  {recursoDetalle.tipoExtintor && (
                    <span style={{ padding: '6px 12px', backgroundColor: '#2563eb', color: ' #dbeafe', borderRadius: '6px', fontSize: '14px' }}>
                      Extintor: {recursoDetalle.tipoExtintor}
                    </span>
                  )}
                  {recursoDetalle.aplicacion && (
                    <span style={{ padding: '6px 12px', backgroundColor: '#059669', color: ' #d1fae5', borderRadius: '6px', fontSize: '14px' }}>
                      {recursoDetalle.aplicacion}
                    </span>
                  )}
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: colors.text, marginBottom: '8px', transition: 'color 0.3s ease' }}>Descripción</h3>
                  <p style={{ fontSize: '14px', color: colors.textSecondary, lineHeight: '1.6', transition: 'color 0.3s ease' }}>{recursoDetalle.descripcion}</p>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: colors.text, marginBottom: '8px', transition: 'color 0.3s ease' }}>Información Detallada</h3>
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
        /* Tablet */
        @media (max-width: 768px) {
          .guia-header {
            padding: 32px 20px !important;
          }

          .header-icon {
            width: 40px !important;
            height: 40px !important;
          }

          .header-title {
            font-size: 28px !important;
          }

          .header-subtitle {
            font-size: 16px !important;
          }

          .guia-container {
            padding: 24px 16px !important;
          }

          .search-filters-card {
            padding: 20px !important;
          }

          .search-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }

          .btn-filtros,
          .btn-buscar {
            width: 100% !important;
            justify-content: center !important;
          }

          .filters-grid {
            grid-template-columns: 1fr !important;
          }

          .export-buttons {
            justify-content: flex-start !important;
          }

          .export-btn {
            flex: 1 !important;
            min-width: calc(50% - 6px) !important;
            justify-content: center !important;
          }

          .export-text {
            display: none !important;
          }

          .recursos-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }

          .externos-title {
            font-size: 24px !important;
          }

          .externos-subtitle {
            font-size: 14px !important;
          }

          .externo-card {
            flex-direction: column !important;
            gap: 16px !important;
          }

          .externo-icon {
            width: 56px !important;
            height: 56px !important;
          }

          .externo-icon svg {
            width: 28px !important;
            height: 28px !important;
          }

          .externo-title {
            font-size: 18px !important;
          }

          .externo-description {
            font-size: 13px !important;
          }

          .externo-actions {
            flex-direction: column !important;
            width: 100% !important;
          }

          .externo-download,
          .externo-details {
            width: 100% !important;
            justify-content: center !important;
          }

          .modal-content {
            max-width: 95% !important;
          }

          .modal-header {
            padding: 16px !important;
          }

          .modal-title {
            font-size: 20px !important;
          }

          .modal-body {
            padding: 24px 16px !important;
          }
        }

        /* Mobile pequeño */
        @media (max-width: 480px) {
          .header-content {
            flex-direction: column !important;
            gap: 12px !important;
          }

          .header-title {
            font-size: 24px !important;
            text-align: center !important;
          }

          .header-subtitle {
            font-size: 14px !important;
          }

          .btn-text {
            font-size: 14px !important;
          }

          .export-btn {
            min-width: 100% !important;
            padding: 10px 16px !important;
          }

          .download-text,
          .details-text {
            display: none !important;
          }

          .externo-download,
          .externo-details {
            padding: 10px 16px !important;
          }
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
    uso: 'Uso/Aplicación',
  };
  return labels[categoria] || categoria;
};

const getCategoriaColor = (categoria) => {
  const colors = {
    tipo_fuego: { bg: '#de3f3f', text: '#fee2e2' },
    tipo_extintor: { bg: '#4a7eef ', text: '#dbeafe' },
    normativa: { bg: '#eeb24c', text: '#fef3c7' },
    mantenimiento: { bg: '#319b79', text: '#d1fae5' },
    uso: { bg: '#a873db', text: '#e0e7ff' },
  };
  return colors[categoria] || { bg: '#f3f4f6', text: '#6b7280' };
};

export default GuiaTecnicaPage;
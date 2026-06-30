import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

export const generatePDFFromHTML = async (titulo, htmlContent) => {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '210mm';
  container.style.padding = '20mm';
  container.style.backgroundColor = 'white';
  container.style.fontFamily = 'Arial, sans-serif';
  
  container.innerHTML = `
    <div style="padding: 40px;">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #ef4444; padding-bottom: 20px;">
        <h1 style="color: #1f2937; font-size: 32px; margin: 0 0 10px 0;">ZD Matafuegos</h1>
        <h2 style="color: #ef4444; font-size: 24px; margin: 0;">${titulo}</h2>
        <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
          Documento generado el ${new Date().toLocaleDateString('es-AR', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
          })}
        </p>
      </div>
      
      <div style="color: #374151; line-height: 1.8; font-size: 12px;">
        ${formatHTMLContent(htmlContent)}
      </div>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center;">
        <p style="color: #6b7280; font-size: 10px; margin: 5px 0;">
          <strong>ZD Matafuegos</strong> | Malabrigo, Santa Fe, Argentina
        </p>
        <p style="color: #6b7280; font-size: 10px; margin: 5px 0;">
          Tel: +54 9 123 456-7890 | Email: info@zdmatafuegos.com
        </p>
        <p style="color: #9ca3af; font-size: 9px; margin: 10px 0 0 0;">
          © ${new Date().getFullYear()} ZD Matafuegos. Todos los derechos reservados.
        </p>
      </div>
    </div>
  `;
  
  document.body.appendChild(container);
  
  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    const fileName = `ZD_${titulo.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    pdf.save(fileName);
    
    document.body.removeChild(container);
    
    return true;
  } catch (error) {
    console.error('Error generando PDF:', error);
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    return false;
  }
};

const formatHTMLContent = (htmlContent) => {
  return htmlContent
    .replace(/<h2>/g, '<h2 style="font-size: 20px; font-weight: bold; color: #1f2937; margin-top: 20px; margin-bottom: 12px; border-bottom: 2px solid #ef4444; padding-bottom: 6px;">')
    .replace(/<h3>/g, '<h3 style="font-size: 16px; font-weight: bold; color: #374151; margin-top: 16px; margin-bottom: 10px;">')
    .replace(/<h4>/g, '<h4 style="font-size: 14px; font-weight: bold; color: #4b5563; margin-top: 12px; margin-bottom: 8px;">')
    .replace(/<ul>/g, '<ul style="margin-left: 20px; margin-bottom: 12px;">')
    .replace(/<ol>/g, '<ol style="margin-left: 20px; margin-bottom: 12px;">')
    .replace(/<li>/g, '<li style="margin-bottom: 6px; line-height: 1.6;">')
    .replace(/<p>/g, '<p style="margin-bottom: 10px; line-height: 1.6;">')
    .replace(/<strong>/g, '<strong style="color: #1f2937; font-weight: 600;">');
};

export const generateSimplePDF = (titulo, contenido) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);
  let yPosition = margin;
  
  pdf.setFillColor(239, 68, 68);
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont(undefined, 'bold');
  pdf.text('ZD Matafuegos', pageWidth / 2, 15, { align: 'center' });
  
  pdf.setFontSize(16);
  pdf.text(titulo, pageWidth / 2, 28, { align: 'center' });
  
  yPosition = 50;
  
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  const fecha = new Date().toLocaleDateString('es-AR', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });
  pdf.text(`Documento generado el ${fecha}`, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 15;
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(11);
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = contenido;
  const textoPlano = tempDiv.textContent || tempDiv.innerText || '';
  
  const lineas = pdf.splitTextToSize(textoPlano, maxWidth);
  
  lineas.forEach((linea) => {
    if (yPosition > pageHeight - margin - 20) {
      pdf.addPage();
      yPosition = margin;
    }
    pdf.text(linea, margin, yPosition);
    yPosition += 7;
  });
  
  const totalPages = pdf.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    
    pdf.setDrawColor(229, 231, 235);
    pdf.setLineWidth(0.5);
    pdf.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);
    
    pdf.setFontSize(8);
    pdf.setTextColor(107, 114, 128);
    pdf.text('ZD Matafuegos | Malabrigo, Santa Fe, Argentina', pageWidth / 2, pageHeight - 18, { align: 'center' });
    pdf.text('Tel: +54 9 123 456-7890 | info@zdmatafuegos.com', pageWidth / 2, pageHeight - 13, { align: 'center' });
    
    pdf.setFontSize(9);
    pdf.setTextColor(156, 163, 175);
    pdf.text(`Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
  }
  
  const fileName = `ZD_${titulo.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  pdf.save(fileName);
  
  return true;
};

export const generateWordDocument = async (titulo, htmlContent) => {
  try {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    const paragraphs = [];
    
    paragraphs.push(
      new Paragraph({
        text: 'ZD MATAFUEGOS',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      })
    );
    
    paragraphs.push(
      new Paragraph({
        text: titulo,
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      })
    );
    
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Documento generado el ${new Date().toLocaleDateString('es-AR', { 
              day: '2-digit', 
              month: 'long', 
              year: 'numeric' 
            })}`,
            italics: true,
            size: 20
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      })
    );
    
    const elements = tempDiv.querySelectorAll('h2, h3, h4, p, ul, ol');
    
    elements.forEach((element) => {
      if (element.tagName === 'H2') {
        paragraphs.push(
          new Paragraph({
            text: element.textContent,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 }
          })
        );
      } else if (element.tagName === 'H3') {
        paragraphs.push(
          new Paragraph({
            text: element.textContent,
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 300, after: 150 }
          })
        );
      } else if (element.tagName === 'H4') {
        paragraphs.push(
          new Paragraph({
            text: element.textContent,
            heading: HeadingLevel.HEADING_4,
            spacing: { before: 200, after: 100 }
          })
        );
      } else if (element.tagName === 'P') {
        paragraphs.push(
          new Paragraph({
            text: element.textContent,
            spacing: { after: 150 }
          })
        );
      } else if (element.tagName === 'UL' || element.tagName === 'OL') {
        const items = element.querySelectorAll('li');
        items.forEach((item) => {
          paragraphs.push(
            new Paragraph({
              text: `• ${item.textContent}`,
              indent: { left: 720 },
              spacing: { after: 100 }
            })
          );
        });
      }
    });
    
    paragraphs.push(
      new Paragraph({
        text: '',
        spacing: { before: 400 }
      })
    );
    
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'ZD Matafuegos | Malabrigo, Santa Fe, Argentina',
            size: 18
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 }
      })
    );
    
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Tel: +54 9 123 456-7890 | Email: info@zdmatafuegos.com',
            size: 18
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 }
      })
    );
    
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `© ${new Date().getFullYear()} ZD Matafuegos. Todos los derechos reservados.`,
            size: 16,
            italics: true
          })
        ],
        alignment: AlignmentType.CENTER
      })
    );
    
    const doc = new Document({
      sections: [{
        properties: {},
        children: paragraphs
      }]
    });
    
    const blob = await Packer.toBlob(doc);
    const fileName = `ZD_${titulo.replace(/\s+/g, '_')}_${Date.now()}.docx`;
    saveAs(blob, fileName);
    
    return true;
  } catch (error) {
    console.error('Error generando Word:', error);
    return false;
  }
};

export const generateCSV = (titulo, htmlContent) => {
  try {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    const text = tempDiv.textContent || tempDiv.innerText || '';
    
    const csvRows = [];
    
    csvRows.push(['ZD MATAFUEGOS']);
    csvRows.push([titulo]);
    csvRows.push([`Generado el: ${new Date().toLocaleDateString('es-AR')}`]);
    csvRows.push(['']);
    
    const paragraphs = text.split('\n').filter(p => p.trim() !== '');
    
    paragraphs.forEach(paragraph => {
      const cleanParagraph = paragraph.trim().replace(/"/g, '""');
      csvRows.push([`"${cleanParagraph}"`]);
    });
    
    csvRows.push(['']);
    csvRows.push(['ZD Matafuegos | Malabrigo, Santa Fe, Argentina']);
    csvRows.push(['Tel: +54 9 123 456-7890 | Email: info@zdmatafuegos.com']);
    csvRows.push([`© ${new Date().getFullYear()} ZD Matafuegos`]);
    
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileName = `ZD_${titulo.replace(/\s+/g, '_')}_${Date.now()}.csv`;
    saveAs(blob, fileName);
    
    return true;
  } catch (error) {
    console.error('Error generando CSV:', error);
    return false;
  }
};
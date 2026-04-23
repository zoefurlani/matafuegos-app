import PDFDocument from 'pdfkit';
import { Injectable } from '@nestjs/common';
import { Comprobante } from './comprobantes.entity';
import * as path from 'path';

@Injectable()
export class PdfService {
  async generarComprobantePDF(comprobante: Comprobante): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ 
          size: 'A4',
          margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });

        const chunks: Buffer[] = [];
        
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Ruta del logo (probamos varias opciones)
        let logoPath = path.join(__dirname, '../../assets/logoof.png');
        
        // Si no existe, intentar desde la raíz del proyecto
        if (!require('fs').existsSync(logoPath)) {
          logoPath = path.join(process.cwd(), 'src/assets/logoof.png');
        }

        // ==================== LOGO ====================
        try {
          if (require('fs').existsSync(logoPath)) {
            doc.image(logoPath, 50, 40, { width: 80, height: 80 });
          } else {
            console.log('Logo no encontrado en:', logoPath);
          }
        } catch (error) {
          console.log('Error al cargar logo:', (error as Error).message);
        }

        // ==================== ENCABEZADO ====================
        // Advertencia NO VÁLIDO (movida un poco abajo por el logo)
        doc
          .fillColor('#dc2626')
          .fontSize(16)
          .font('Helvetica-Bold')
          .text('COMPROBANTE NO VÁLIDO COMO FACTURA', 150, 50, { 
            align: 'center',
            width: 395
          });

        doc
          .fontSize(10)
          .font('Helvetica')
          .fillColor('#991b1b')
          .text('Este documento no tiene validez fiscal', 150, 72, { 
            align: 'center',
            width: 395
          });

        // Línea separadora
        doc
          .strokeColor('#dc2626')
          .lineWidth(2)
          .moveTo(50, 130)
          .lineTo(545, 130)
          .stroke();

        // ==================== DATOS ZD MATAFUEGOS ====================
        let yPos = 145;

        doc
          .fillColor('#111827')
          .fontSize(18)
          .font('Helvetica-Bold')
          .text('ZD MATAFUEGOS', 50, yPos);

        yPos += 25;

        doc
          .fontSize(10)
          .font('Helvetica')
          .fillColor('#374151')
          .text('Furlani Nelson Pedro', 50, yPos);

        yPos += 15;
        doc.text('25 de Mayo 1675, Romang, Santa Fe', 50, yPos);

        yPos += 15;
        doc.text('Celular: 3482 445650', 50, yPos);

        yPos += 15;
        doc.text('Habilitación Municipal N° 70/2018', 50, yPos);

        // ==================== DATOS DEL COMPROBANTE ====================
        yPos += 30;

        // Número de comprobante
        doc
          .fontSize(12)
          .font('Helvetica-Bold')
          .fillColor('#111827')
          .text('N° COMPROBANTE:', 50, yPos);

        doc
          .fontSize(14)
          .text(comprobante.numero, 180, yPos);

        // Fecha
        doc
          .fontSize(12)
          .text('FECHA:', 350, yPos);

        const fecha = new Date(comprobante.fecha).toLocaleDateString('es-AR');
        doc
          .fontSize(14)
          .text(fecha, 420, yPos);

        // ==================== DATOS DEL CLIENTE ====================
        yPos += 35;

        // Recuadro cliente
        doc
          .strokeColor('#e5e7eb')
          .lineWidth(1)
          .rect(50, yPos, 495, 80)
          .stroke();

        yPos += 15;

        doc
          .fontSize(10)
          .font('Helvetica')
          .fillColor('#6b7280')
          .text('CLIENTE', 60, yPos);

        yPos += 15;

        doc
          .fontSize(12)
          .font('Helvetica-Bold')
          .fillColor('#111827')
          .text(comprobante.clienteNombre, 60, yPos);

        yPos += 15;

        if (comprobante.clienteDni) {
          doc
            .fontSize(10)
            .font('Helvetica')
            .fillColor('#374151')
            .text(`DNI/CUIT: ${comprobante.clienteDni}`, 60, yPos);
          yPos += 12;
        }

        if (comprobante.clienteDireccion) {
          doc.text(comprobante.clienteDireccion, 60, yPos);
          yPos += 12;
        }

        if (comprobante.clienteTelefono) {
          doc.text(`Tel: ${comprobante.clienteTelefono}`, 60, yPos);
        }

        // ==================== ITEMS ====================
        yPos += 40;

        // Encabezado tabla
        doc
          .fontSize(9)
          .font('Helvetica-Bold')
          .fillColor('#6b7280');

        doc.text('TIPO', 50, yPos, { width: 70 });
        doc.text('DESCRIPCIÓN', 120, yPos, { width: 200 });
        doc.text('CANT.', 320, yPos, { width: 50, align: 'center' });
        doc.text('P. UNIT.', 370, yPos, { width: 80, align: 'right' });
        doc.text('SUBTOTAL', 450, yPos, { width: 95, align: 'right' });

        yPos += 15;

        // Línea debajo del encabezado
        doc
          .strokeColor('#e5e7eb')
          .lineWidth(1)
          .moveTo(50, yPos)
          .lineTo(545, yPos)
          .stroke();

        yPos += 10;

        // Items
        doc
          .fontSize(9)
          .font('Helvetica')
          .fillColor('#111827');

        comprobante.items.forEach((item, index) => {
          // Verificar si necesitamos una nueva página
          if (yPos > 700) {
            doc.addPage();
            yPos = 50;
          }

          // Tipo (badge)
          doc
            .fontSize(8)
            .fillColor('#aa0e0e')
            .text(item.tipoOperacion, 50, yPos, { width: 70 });

          // Descripción
          doc
            .fontSize(9)
            .fillColor('#111827')
            .text(item.descripcion, 120, yPos, { width: 200 });

          // Cantidad
          doc.text(item.cantidad.toString(), 320, yPos, { width: 50, align: 'center' });

          // Precio unitario
          doc.text(`$${item.precioUnitario.toFixed(2)}`, 370, yPos, { width: 80, align: 'right' });

          // Subtotal
          doc
            .font('Helvetica-Bold')
            .text(`$${item.subtotal.toFixed(2)}`, 450, yPos, { width: 95, align: 'right' });

          yPos += 20;

          // Línea separadora entre items
          if (index < comprobante.items.length - 1) {
            doc
              .strokeColor('#f3f4f6')
              .lineWidth(0.5)
              .moveTo(50, yPos)
              .lineTo(545, yPos)
              .stroke();
            yPos += 10;
          }
        });

        // ==================== TOTAL ====================
        yPos += 20;

        // Línea antes del total
        doc
          .strokeColor('#e5e7eb')
          .lineWidth(2)
          .moveTo(350, yPos)
          .lineTo(545, yPos)
          .stroke();

        yPos += 15;

        doc
          .fontSize(12)
          .font('Helvetica')
          .fillColor('#6b7280')
          .text('TOTAL:', 350, yPos, { width: 100, align: 'right' });

        doc
          .fontSize(20)
          .font('Helvetica-Bold')
          .fillColor('#111827')
          .text(`$${comprobante.total.toLocaleString('es-AR')}`, 450, yPos, { 
            width: 95, 
            align: 'right' 
          });

        // ==================== OBSERVACIONES ====================
        if (comprobante.observaciones) {
          yPos += 50;

          // Verificar espacio
          if (yPos > 700) {
            doc.addPage();
            yPos = 50;
          }

          // Recuadro observaciones
          doc
            .strokeColor('#e5e7eb')
            .lineWidth(1)
            .rect(50, yPos, 495, 60)
            .stroke();

          yPos += 15;

          doc
            .fontSize(9)
            .font('Helvetica')
            .fillColor('#6b7280')
            .text('OBSERVACIONES', 60, yPos);

          yPos += 15;

          doc
            .fontSize(10)
            .fillColor('#374151')
            .text(comprobante.observaciones, 60, yPos, { 
              width: 475,
              lineGap: 3
            });
        }

        // ==================== FOOTER ====================
        const pageHeight = doc.page.height;
        const footerY = pageHeight - 80;

        doc
          .fontSize(8)
          .font('Helvetica')
          .fillColor('#9ca3af')
          .text(
            `Comprobante generado el ${new Date().toLocaleDateString('es-AR')} a las ${new Date().toLocaleTimeString('es-AR')}`,
            50,
            footerY,
            { align: 'center', width: 495 }
          );

        doc
          .fontSize(7)
          .text('ZD Matafuegos - Romang, Santa Fe', 50, footerY + 15, { 
            align: 'center', 
            width: 495 
          });

        // Finalizar PDF
        doc.end();

      } catch (error) {
        reject(error);
      }
    });
  }
}
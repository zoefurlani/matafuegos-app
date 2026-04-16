import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ComprobantesService } from './comprobantes.service';
import { PdfService } from './pdf.service';
import { CreateComprobanteDto } from './dto/create-comprobante.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('comprobantes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ComprobantesController {
  constructor(
    private readonly comprobantesService: ComprobantesService,
    private readonly pdfService: PdfService,
  ) {}

  // ===== CREAR COMPROBANTE =====
  @Post()
  @Roles('admin', 'super_admin')
  create(@Body() createComprobanteDto: CreateComprobanteDto) {
    return this.comprobantesService.create(createComprobanteDto);
  }

  // ===== OBTENER TODOS =====
  @Get()
  @Roles('admin', 'super_admin')
  findAll() {
    return this.comprobantesService.findAll();
  }

  // ===== OBTENER ESTADÍSTICAS =====
  @Get('stats')
  @Roles('admin', 'super_admin')
  getStats() {
    return this.comprobantesService.getStats();
  }

  // ===== BUSCAR POR CLIENTE =====
  @Get('cliente/:nombre')
  @Roles('admin', 'super_admin')
  findByCliente(@Param('nombre') nombre: string) {
    return this.comprobantesService.findByCliente(nombre);
  }

  // ===== BUSCAR POR RANGO DE FECHAS =====
  @Get('date-range')
  @Roles('admin', 'super_admin')
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.comprobantesService.findByDateRange(startDate, endDate);
  }

  // ===== BUSCAR POR NÚMERO =====
  @Get('numero/:numero')
  @Roles('admin', 'super_admin')
  findByNumero(@Param('numero') numero: string) {
    return this.comprobantesService.findByNumero(numero);
  }

  // ===== DESCARGAR PDF =====
  @Get(':id/pdf')
  @Roles('admin', 'super_admin')
  async downloadPDF(@Param('id') id: string, @Res() res: Response) {
    const comprobante = await this.comprobantesService.findOne(+id);
    const pdfBuffer = await this.pdfService.generarComprobantePDF(comprobante);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=Comprobante_${comprobante.numero}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }

  // ===== OBTENER POR ID =====
  @Get(':id')
  @Roles('admin', 'super_admin')
  findOne(@Param('id') id: string) {
    return this.comprobantesService.findOne(+id);
  }

  // ===== ANULAR COMPROBANTE =====
  @Patch(':id/anular')
  @Roles('admin', 'super_admin')
  anular(@Param('id') id: string) {
    return this.comprobantesService.anular(+id);
  }

  // ===== ELIMINAR COMPROBANTE =====
  @Delete(':id')
  @Roles('super_admin')
  remove(@Param('id') id: string) {
    return this.comprobantesService.remove(+id);
  }
}
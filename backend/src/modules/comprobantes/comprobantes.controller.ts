import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Res,
  Patch,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ComprobantesService } from './comprobantes.service';
import { CreateComprobanteDto } from './dto/create-comprobante.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comprobantes')
//@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class ComprobantesController {
  constructor(private readonly comprobantesService: ComprobantesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createComprobanteDto: CreateComprobanteDto) {
    return this.comprobantesService.create(createComprobanteDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard) 
  findAll() {
    return this.comprobantesService.findAll();
  }

  @Get('client/:clienteId')
  @UseGuards(JwtAuthGuard)
  findByClient(@Param('clienteId', ParseIntPipe) clienteId: number) {
    return this.comprobantesService.findByClient(clienteId);
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.comprobantesService.findOne(id);
  }

  @Get(':id/pdf')
  async downloadPDF(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.comprobantesService.generatePDF(id);
    const comprobante = await this.comprobantesService.findOne(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=comprobante-${comprobante.numeroComprobante}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }

  @Patch(':id/anular')
  anular(@Param('id', ParseIntPipe) id: number) {
    return this.comprobantesService.anular(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.comprobantesService.remove(id);
  }
}
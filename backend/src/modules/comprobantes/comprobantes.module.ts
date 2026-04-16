import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComprobantesService } from './comprobantes.service';
import { ComprobantesController } from './comprobantes.controller';
import { Comprobante } from './comprobantes.entity';
import { PdfService } from './pdf.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comprobante])],
  controllers: [ComprobantesController],
  providers: [ComprobantesService, PdfService],
  exports: [ComprobantesService],
})
export class ComprobantesModule {}
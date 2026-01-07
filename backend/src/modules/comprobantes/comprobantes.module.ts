import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComprobantesService } from './comprobantes.service';
import { ComprobantesController } from './comprobantes.controller';
import { Comprobante } from 'src/database/entities/comprobante.entity';
import { Recarga } from 'src/database/entities/recarga.entity';
import { Client } from 'src/database/entities/client.entity';
import { Extintor } from 'src/database/entities/extintor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comprobante, Recarga, Client, Extintor])],
  controllers: [ComprobantesController],
  providers: [ComprobantesService],
  exports: [ComprobantesService],
})
export class ComprobantesModule {}
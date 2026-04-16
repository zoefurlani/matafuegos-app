import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { Venta } from './venta.entity';
import { Producto } from '../../database/entities/producto.entity';
import { Extintor } from '../../database/entities/extintor.entity';
import { Client } from '../../database/entities/client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venta, Producto, Extintor, Client]),
  ],
  controllers: [VentasController],
  providers: [VentasService],
  exports: [VentasService],
})
export class VentasModule {}
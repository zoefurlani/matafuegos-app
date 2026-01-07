import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';
import { Producto } from 'src/database/entities/producto.entity';
import { Compra } from 'src/database/entities/compra.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Compra])],
  controllers: [InventarioController],
  providers: [InventarioService],
  exports: [InventarioService],
})
export class InventarioModule {}
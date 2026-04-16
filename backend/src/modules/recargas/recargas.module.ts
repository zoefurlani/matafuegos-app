import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecargasService } from './recargas.service';
import { RecargasController } from './recargas.controller';
import { Recarga } from 'src/database/entities/recarga.entity';
import { Extintor } from 'src/database/entities/extintor.entity';
import { Client } from 'src/database/entities/client.entity';
import { Producto } from 'src/database/entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recarga, Extintor, Client, Producto])],
  controllers: [RecargasController],
  providers: [RecargasService],
  exports: [RecargasService],
})
export class RecargasModule {}
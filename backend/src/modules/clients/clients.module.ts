import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { Client } from 'src/database/entities/client.entity';
import { Extintor } from 'src/database/entities/extintor.entity'; // NUEVO


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Client,
      Extintor, // NUEVO - Agregar el repositorio de Extintor
    ]),
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
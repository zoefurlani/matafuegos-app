import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecursosEducativosService } from './recursos-educativos.service';
import { RecursosEducativosController } from './recursos-educativos.controller';
import { RecursoEducativo } from './recurso-educativo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecursoEducativo])],
  controllers: [RecursosEducativosController],
  providers: [RecursosEducativosService],
  exports: [RecursosEducativosService],
})
export class RecursosEducativosModule {}
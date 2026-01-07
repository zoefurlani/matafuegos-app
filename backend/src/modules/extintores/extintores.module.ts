import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtintoresService } from './extintores.service';
import { ExtintoresController } from './extintores.controller';
import { Extintor } from 'src/database/entities/extintor.entity';
import { Client } from 'src/database/entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Extintor, Client])],
  controllers: [ExtintoresController],
  providers: [ExtintoresService],
  exports: [ExtintoresService],
})
export class ExtintoresModule {}
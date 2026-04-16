import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestimoniosController } from './testimonios.controller';
import { TestimoniosService } from './testimonios.service';
import { Testimonio } from '../../database/entities/testimonio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Testimonio])],
  controllers: [TestimoniosController],
  providers: [TestimoniosService],
  exports: [TestimoniosService],
})
export class TestimoniosModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { User } from 'src/database/entities/user.entity';
import { LogActividad } from 'src/database/entities/log-actividad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, LogActividad])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
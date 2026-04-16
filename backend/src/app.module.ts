import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDatabaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ExtintoresModule } from './modules/extintores/extintores.module';
import { RecargasModule } from './modules/recargas/recargas.module';
import { InventarioModule } from './modules/inventario/inventario.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { TestimoniosModule } from './modules/testimonios/testimonios.module';
import { VentasModule } from './modules/ventas/ventas.module';
import { ComprobantesModule } from './modules/comprobantes/comprobantes.module';
import { RecursosEducativosModule } from './modules/recursos-educativos/recursos-educativos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    AuthModule,
    ClientsModule,
    ExtintoresModule,
    RecargasModule,
    InventarioModule,
    UsuariosModule, 
    TestimoniosModule,
    VentasModule,
    RecursosEducativosModule,
    ComprobantesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
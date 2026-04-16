import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../database/entities/user.entity';
import { Client } from '../database/entities/client.entity';
import { Extintor } from '../database/entities/extintor.entity';
import { Recarga } from '../database/entities/recarga.entity';
import { Producto } from '../database/entities/producto.entity';
import { Compra } from '../database/entities/compra.entity';
import { LogActividad } from '../database/entities/log-actividad.entity';
import { Testimonio } from '../database/entities/testimonio.entity'; 
import { Venta } from 'src/modules/ventas/venta.entity';
import { Comprobante } from '../modules/comprobantes/comprobantes.entity';
import { RecursoEducativo } from '../modules/recursos-educativos/recurso-educativo.entity';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 3306),
  username: configService.get<string>('DB_USER', 'root'),
  password: configService.get<string>('DB_PASSWORD', ''),
  database: configService.get<string>('DB_NAME', 'matafuegos_db'),
  entities: [User, Client, Extintor, Recarga, Producto, Compra, LogActividad, Testimonio, Venta, Comprobante, RecursoEducativo],
  synchronize: true,
  logging: false,
});
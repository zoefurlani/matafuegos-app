import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Client } from '../../database/entities/client.entity';
import { User } from '../../database/entities/user.entity';
import { Producto } from '../../database/entities/producto.entity';

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Client, { eager: true })
  @JoinColumn({ name: 'clienteId' })
  cliente!: Client;

  @Column()
  clienteId!: number;

  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'productoId' })
  producto!: Producto;

  @Column()
  productoId!: number;

  @Column()
  cantidad!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precioUnitario!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precioTotal!: number;

  @Column({ nullable: true })
  numeroEquipo?: string;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'vendedorId' })
  vendedor!: User;

  @Column()
  vendedorId!: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
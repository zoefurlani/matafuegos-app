import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from '../../database/entities/client.entity';
import { User } from '../../database/entities/user.entity';
import { Producto } from '../../database/entities/producto.entity';

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  // Relación con cliente
  @ManyToOne(() => Client, { eager: true })
  @JoinColumn({ name: 'clienteId' })
  cliente: Client;

  @Column()
  clienteId: number;

  // Relación con producto (extintor del inventario)
  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'productoId' })
  producto: Producto;

  @Column()
  productoId: number;

  @Column()
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precioUnitario: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precioTotal: number;

  // Número de equipo asignado al extintor vendido
  @Column({ nullable: true })
  numeroEquipo: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  // Usuario que registró la venta
  @ManyToOne(() => User)
  @JoinColumn({ name: 'vendedorId' })
  vendedor: User;

  @Column()
  vendedorId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
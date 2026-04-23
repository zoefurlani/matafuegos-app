import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Client } from '../../database/entities/client.entity';
import { Venta } from '../ventas/venta.entity';

@Entity('comprobantes')
export class Comprobante {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  numero!: string;

  @Column({ type: 'date' })
  fecha!: Date;

  @ManyToOne(() => Client, { nullable: true })
  @JoinColumn({ name: 'clienteId' })
  cliente?: Client;

  @Column({ nullable: true })
  clienteId?: number;

  @ManyToOne(() => Venta, { nullable: true })
  @JoinColumn({ name: 'ventaId' })
  venta?: Venta;

  @Column({ nullable: true })
  ventaId?: number;

  @Column()
  clienteNombre!: string;

  @Column({ nullable: true })
  clienteDni?: string;

  @Column({ nullable: true })
  clienteDireccion?: string;

  @Column({ nullable: true })
  clienteTelefono?: string;

  @Column({ type: 'json' })
  items!: any;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total!: number;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  @Column({ default: 'activo' })
  estado!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
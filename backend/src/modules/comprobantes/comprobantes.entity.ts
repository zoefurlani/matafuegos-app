import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
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

  // ✅ RELACIONES
  @ManyToOne(() => Client)
  @JoinColumn({ name: 'clienteId' })
  cliente!: Client;

  @ManyToOne(() => Venta, { nullable: true })
  @JoinColumn({ name: 'ventaId' })
  venta?: Venta;

  // Datos del cliente (mantener para PDFs)
  @Column()
  clienteNombre!: string;

  @Column({ nullable: true })
  clienteDni?: string;

  @Column({ nullable: true })
  clienteDireccion?: string;

  @Column({ nullable: true })
  clienteTelefono?: string;

  // Items del comprobante (JSON)
  @Column({ type: 'json' })
  items!: ComprobanteItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total!: number;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  @Column({ default: 'activo' })
  estado!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export interface ComprobanteItem {
  tipoOperacion: 'Recarga' | 'Venta' | 'Servicio';
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}
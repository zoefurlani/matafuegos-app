import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Recarga } from './recarga.entity';
import { Client } from './client.entity';

@Entity('comprobantes')
export class Comprobante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  numeroComprobante: string;

  @ManyToOne(() => Recarga, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recargaId' })
  recarga: Recarga;

  @Column()
  recargaId: number;

  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clienteId' })
  cliente: Client;

  @Column()
  clienteId: number;

  @Column({ type: 'date' })
  fechaEmision: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'text', nullable: true })
  detalles: string; // JSON con los items del comprobante

  @Column({ default: 'emitido' })
  estado: string; // emitido, anulado

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

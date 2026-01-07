import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Extintor } from './extintor.entity';
import { Client } from './client.entity';

@Entity('recargas')
export class Recarga {
  @PrimaryGeneratedColumn()
  id: number;

  // Relación con Extintor
  @ManyToOne(() => Extintor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'extintorId' })
  extintor: Extintor;

  @Column()
  extintorId: number;

  // Relación con Cliente
  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clienteId' })
  cliente: Client;

  @Column()
  clienteId: number;

  @Column({ type: 'date' })
  fechaRecarga: Date;

  @Column({ type: 'date', nullable: true })
  fechaProximaRecarga: Date;

  // Repuestos utilizados
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  polvoKg: number;

  @Column({ default: 0 })
  manometros: number;

  @Column({ default: 0 })
  vastagos: number;

  @Column({ default: 0 })
  valvulas: number;

  @Column({ default: 0 })
  orings: number;

  @Column({ default: 0 })
  mangueras: number;

  @Column({ default: 0 })
  boquillas: number;

  @Column({ default: 0 })
  seguros: number;

  @Column({ default: 0 })
  etiquetas: number;

  // Precio y observaciones
  @Column('decimal', { precision: 10, scale: 2 })
  precioTotal: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ default: 'completada' })
  estado: string; // completada, pendiente, cancelada

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
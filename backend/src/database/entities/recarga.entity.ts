import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Extintor } from './extintor.entity';
import { Client } from './client.entity';

@Entity('recargas')
export class Recarga {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Extintor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'extintorId' })
  extintor!: Extintor;

  @Column()
  extintorId!: number;

  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clienteId' })
  cliente!: Client;

  @Column()
  clienteId!: number;

  @Column({ type: 'date' })
  fechaRecarga!: Date;

  @Column({ type: 'date', nullable: true })
  fechaProximaRecarga?: Date;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  polvoKg!: number;

  @Column({ default: 0 })
  manometros!: number;

  @Column({ default: 0 })
  vastagos!: number;

  @Column({ default: 0 })
  valvulas!: number;

  @Column({ default: 0 })
  orings!: number;

  @Column({ default: 0 })
  mangueras!: number;

  @Column({ default: 0 })
  boquillas!: number;

  @Column({ default: 0 })
  seguros!: number;

  @Column({ default: 0 })
  etiquetas!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precioTotal!: number;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  @Column({ default: 'completada' })
  estado!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  precioManoObra!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  precioPolvo!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  precioManometros!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  precioVastagos!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  precioValvulas!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  precioOrings!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  precioMangueras!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  precioBoquillas!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  precioSeguros!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  precioEtiquetas!: number;
}
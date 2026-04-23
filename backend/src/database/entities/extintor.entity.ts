import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Client } from './client.entity';

@Entity('extintores')
export class Extintor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  numeroEquipo!: string;

  @Column()
  tipo!: string;

  @Column('decimal', { precision: 5, scale: 2 })
  capacidad!: number;

  @Column({ nullable: true })
  marca?: string;

  @Column({ type: 'date', nullable: true })
  fechaUltimaRecarga?: Date;

  @Column({ type: 'date', nullable: true })
  fechaVencimiento?: Date;

  @Column({ default: 'activo' })
  estado!: string;

  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clienteId' })
  cliente!: Client;

  @Column()
  clienteId!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
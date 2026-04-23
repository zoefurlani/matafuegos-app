import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  nombre!: string;

  @Column()
  categoria!: string;

  @Column()
  unidadMedida!: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  stockActual!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 10 })
  stockMinimo!: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  precioUnitario?: number;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ default: 'activo' })
  estado!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
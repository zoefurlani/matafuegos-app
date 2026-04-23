import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../database/entities/user.entity';

@Entity('recursos_educativos')
export class RecursoEducativo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titulo!: string;

  @Column({ type: 'text' })
  descripcion!: string;

  @Column()
  categoria!: string;

  @Column({ nullable: true })
  tipoFuego?: string;

  @Column({ nullable: true })
  tipoExtintor?: string;

  @Column({ nullable: true })
  capacidad?: string;

  @Column({ nullable: true })
  aplicacion?: string;

  @Column({ type: 'text' })
  contenidoDetallado!: string;

  @Column({ nullable: true })
  imagenUrl?: string;

  @Column({ nullable: true })
  archivoPdfUrl?: string;

  @Column({ default: 0 })
  orden!: number;

  @Column({ default: 'activo' })
  estado!: string;

  // ✅ RELACIÓN
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'usuarioId' })
  usuario?: User;

  @Column({ nullable: true })
  usuarioId?: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('logs_actividad')
export class LogActividad {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  usuarioId!: number;

  @Column({ length: 100 })
  accion!: string;

  @Column({ length: 50 })
  modulo!: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ length: 50, nullable: true })
  ip?: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'usuarioId' })
  usuario!: User;
}
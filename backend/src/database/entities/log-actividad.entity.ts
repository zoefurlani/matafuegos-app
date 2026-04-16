import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('logs_actividad')
export class LogActividad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuarioId: number; // ⭐ Campo directo para el ID

  @Column({ length: 100 })
  accion: string;

  @Column({ length: 50 })
  modulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ length: 50, nullable: true })
  ip: string;

  @CreateDateColumn()
  createdAt: Date;

  // ⭐ Relación con User (solo para consultas)
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'usuarioId' })
  usuario: User;
}
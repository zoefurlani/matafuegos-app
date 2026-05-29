import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  VENDEDOR = 'vendedor',
  USUARIO = 'usuario'
}

export enum UserEstado {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  BLOQUEADO = 'bloqueado'
}

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Exclude()
  @Column()
  password!: string;

  @Column()
  email!: string;

  @Column()
  rol!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ default: 'activo' })
  estado!: string;

  @Column({ type: 'timestamp', nullable: true })
  ultimoLogin?: Date;
}
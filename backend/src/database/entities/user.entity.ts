import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
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
  id: number;

  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ 
    type: 'varchar',
    length: 20,
    default: UserRole.USUARIO 
  })
  rol: string;

  @Column({ 
    type: 'varchar',
    length: 20,
    default: UserEstado.ACTIVO 
  })
  estado: string;

  @Column({ type: 'timestamp', nullable: true })
  ultimoLogin: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
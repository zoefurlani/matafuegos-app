import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('testimonios')
export class Testimonio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  userEmail: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  company: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'int', default: 5 })
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'boolean', default: true })
  isVisible: boolean;
}
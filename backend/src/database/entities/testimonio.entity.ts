import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('testimonios')
export class Testimonio {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  userEmail!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  company?: string;

  @Column({ type: 'text' })
  text!: string;

  @Column({ type: 'int', default: 5 })
  rating!: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'tinyint', default: 1 })
  isVisible!: number;
}
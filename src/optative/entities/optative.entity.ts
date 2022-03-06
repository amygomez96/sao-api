import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Optative {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, default: null, nullable: true })
  name: string;

  @ManyToOne(() => User, (user: User) => user.id)
  professor: number;

  @Column({ nullable: true })
  classroom: string;
}

import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Optative } from '../../optative/entities/optative.entity';

@Entity()
export class Requests {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user: User) => user.id)
  student: number;

  @ManyToOne(() => Optative, (optative: Optative) => optative.id)
  optative: number;
}

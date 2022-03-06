import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../../utils/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, default: null, nullable: true })
  name: string;

  @Column({ default: null, nullable: true })
  last_name: string;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ length: 100, default: null, nullable: true, unique: true })
  email: string;

  @Column({ default: null, nullable: true, select: false })
  password: string;

  @Column({ default: null, nullable: true })
  phone: string;

  @Column({ default: null, nullable: true })
  optional: string;

  @Column({ default: null, nullable: true })
  faculty: number;

  @ManyToOne(() => Role, (role) => role.id)
  role: number;

  @Column({ default: new Date() })
  created_at: Date;

  @Column({ default: null, nullable: true })
  deleted_at: Date;

  @BeforeInsert()
  async beforeInsert(password: string) {
    this.email = this.email.toLowerCase();
    this.username = this.username.toLowerCase();

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password || this.password, salt);
  }
}

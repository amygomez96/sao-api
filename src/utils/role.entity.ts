import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'student', nullable: false })
  name: string;

  @Column({ default: null, nullable: true })
  description: string;
}

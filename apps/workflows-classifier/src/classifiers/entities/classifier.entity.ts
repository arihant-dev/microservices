import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Classifier {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  workflowId!: number;

  @Column()
  classification!: 'primary' | 'secondary';
}

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type OutboxStatus = 'pending' | 'sent' | 'failed';

@Entity()
export class OutboxEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  aggregateType!: string;

  @Column()
  aggregateId!: number;

  @Column()
  eventType!: string;

  @Column({ type: 'jsonb' })
  payload!: Record<string, unknown>;

  @Column({ default: 'pending' })
  status!: OutboxStatus;

  @Column({ default: 0 })
  retryCount!: number;

  @Column({ type: 'timestamp', nullable: true })
  nextRetryAt!: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  sentAt!: Date | null;

  @Column({ type: 'text', nullable: true })
  lastError!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Checklist } from '../checklist/checklist.entity';
import { User } from '../user/user.entity';

@Entity({ name: 'checklist_item' })
export class ChecklistItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  memo: string;

  @Column({ type: 'varchar', nullable: true })
  emoji: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ default: false })
  is_checked: boolean;

  @ManyToOne(() => User, (user) => user.created_checklist_items)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @ManyToOne(() => User, (user) => user.updated_checklist_items)
  @JoinColumn({ name: 'updated_by' })
  updated_by: User;

  @Column({ type: 'timestamp', nullable: true })
  checked_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => Checklist, (checklist) => checklist.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'checklist_id' })
  checklist: Checklist;

  @Column({ type: 'varchar', nullable: false, select: false })
  permission_code: string;
}

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
  imageUrl: string;

  @Column({ default: false })
  isChecked: boolean;

  @ManyToOne(() => User, (user) => user.createdChecklistItems)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ManyToOne(() => User, (user) => user.updated_checklistItems)
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;

  @Column({ type: 'timestamp', nullable: true })
  checkedAt: Date;

  @Column({ type: 'varchar', nullable: false, select: false })
  permissionCode: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Checklist, (checklist) => checklist.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'checklist_id' })
  checklist: Checklist;
}

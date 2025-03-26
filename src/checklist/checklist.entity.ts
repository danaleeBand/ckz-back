import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Folder } from '../folder/folder.entity';
import { ChecklistItem } from '../checklist-item/checklist-item.entity';
import { User } from '../user/user.entity';

@Entity()
export class Checklist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  emoji: string;

  @Column({ type: 'int', array: true, default: '{}' })
  item_order: Array<number>;

  @ManyToOne(() => User, (user) => user.created_checklists)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @ManyToOne(() => User, (user) => user.updated_checklists)
  @JoinColumn({ name: 'updated_by' })
  updated_by: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'varchar', nullable: false })
  permission_code: string;

  @ManyToOne(() => Folder)
  @JoinColumn({ name: 'folder_id' })
  folder: Folder;

  @OneToMany(() => ChecklistItem, (checklistItem) => checklistItem.checklist, {
    cascade: true,
  })
  items: Array<ChecklistItem>;
}

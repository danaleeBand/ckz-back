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

@Entity()
export class Checklist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'int', array: true, default: '{}' })
  item_order: Array<number>;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => Folder)
  @JoinColumn({ name: 'folder_id' })
  folder: Folder;

  @OneToMany(() => ChecklistItem, (checklistItem) => checklistItem.checklist, {
    cascade: true,
  })
  items: Array<ChecklistItem>;

  @Column({ type: 'varchar', nullable: false })
  permission_code: string;
}

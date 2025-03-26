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
  itemOrder: Array<number>;

  @ManyToOne(() => User, (user) => user.createdChecklists)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ManyToOne(() => User, (user) => user.updatedChecklists)
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'varchar', nullable: false })
  permissionCode: string;

  @ManyToOne(() => Folder)
  @JoinColumn({ name: 'folder_id' })
  folder: Folder;

  @OneToMany(() => ChecklistItem, (checklistItem) => checklistItem.checklist, {
    cascade: true,
  })
  items: Array<ChecklistItem>;
}

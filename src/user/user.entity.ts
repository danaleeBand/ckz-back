import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Checklist } from '../checklist/checklist.entity';
import { ChecklistItem } from '../checklist-item/checklist-item.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  profileImageUrl: string;

  @Column({ default: false })
  isChecky: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Checklist, (checklist) => checklist.createdBy)
  createdChecklists: Array<Checklist>;

  @OneToMany(() => Checklist, (checklist) => checklist.updatedBy)
  updatedChecklists: Array<Checklist>;

  @OneToMany(() => ChecklistItem, (checklistItem) => checklistItem.createdBy)
  createdChecklistItems: Array<Checklist>;

  @OneToMany(() => ChecklistItem, (checklistItem) => checklistItem.updatedBy)
  updated_checklistItems: Array<Checklist>;
}

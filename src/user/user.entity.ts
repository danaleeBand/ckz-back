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
  profile_image_url: string;

  @Column({ default: false })
  is_checky: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => Checklist, (checklist) => checklist.created_by)
  created_checklists: Array<Checklist>;

  @OneToMany(() => Checklist, (checklist) => checklist.updated_by)
  updated_checklists: Array<Checklist>;

  @OneToMany(() => ChecklistItem, (checklist_item) => checklist_item.created_by)
  created_checklist_items: Array<Checklist>;

  @OneToMany(() => ChecklistItem, (checklist_item) => checklist_item.updated_by)
  updated_checklist_items: Array<Checklist>;
}

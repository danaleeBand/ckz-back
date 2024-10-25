import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Workspace } from '../workspace/entities/workspace.entity';
import { Checklist } from '../checklist/checklist.entity';

@Entity()
export class Folder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'int', array: true, default: '{}' })
  checklist_order: Array<number>;

  @Column({ type: 'boolean', default: false })
  is_default: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;

  @Column({ type: 'varchar', nullable: false })
  permission_code: string;

  @OneToMany(() => Checklist, (checklist) => checklist.folder)
  checklists: Array<Checklist>;

  isDefault(): boolean {
    return this.is_default;
  }
}

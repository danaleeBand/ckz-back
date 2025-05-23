import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { WorkspaceUser } from './workspace-user.entity';

@Entity()
export class Workspace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('int', { array: true, default: () => "'{}'" })
  folderOrder: Array<number>;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'varchar', nullable: false })
  permissionCode: string;

  @OneToMany(() => WorkspaceUser, (workspaceUser) => workspaceUser.workspace)
  workspaceUsers: Array<WorkspaceUser>;
}

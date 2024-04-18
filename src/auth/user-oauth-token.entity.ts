import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity'; // User 엔터티의 경로에 맞게 수정해야 합니다.

export enum Provider {
  KAKAO = 'kakao',
  GOOGLE = 'google',
}

@Entity()
export class UserOauthToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  user_id: number;

  @Column({ type: 'enum', enum: Provider })
  provider: Provider;

  @Column({ type: 'varchar', length: 25 })
  provider_id: string;

  @Column({ type: 'varchar', length: 255 })
  access_token: string;

  @Column({ type: 'varchar', length: 255 })
  refresh_token: string;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

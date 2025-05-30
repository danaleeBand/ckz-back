import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from '../../user/user.entity'; // User 엔터티의 경로에 맞게 수정해야 합니다.

export enum Provider {
  KAKAO = 'kakao',
  GOOGLE = 'google',
}

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 25 })
  providerUserId: string;

  @Column({ type: 'enum', enum: Provider })
  provider: Provider;

  @Column({ type: 'varchar', length: 255 })
  accessToken: string;

  @Column({ type: 'varchar', length: 255 })
  refreshToken: string;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

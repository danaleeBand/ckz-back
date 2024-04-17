import { DataSource } from 'typeorm';
import { User } from './src/user/user.entity';
import { CreateUser1713366146080 } from './src/migrations/1713366146080-create-user';
import { UserOauthToken } from './src/auth/user-oauth-token.entitiy';
import { CreateUserOauthToken1713369213223 } from './src/migrations/1713369213223-create-user-oauth-token';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: 'checkuiz',
  synchronize: false,
  migrationsRun: false,
  migrationsTableName: 'migrations',
  entities: [User, UserOauthToken],
  migrations: [CreateUser1713366146080, CreateUserOauthToken1713369213223],
});

import { DataSource } from 'typeorm';
import { User } from './src/user/user.entity';
import { CreateUser1713366146080 } from './src/migrations/1713366146080-create-user';

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
  entities: [User],
  migrations: [CreateUser1713366146080],
});

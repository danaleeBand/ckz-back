import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { AuthService } from './auth/auth.service';
import { Auth } from './auth/auth.entity';
import { CommonModule } from './common.module';
import { WorkspaceService } from './workspace/workspace.service';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: 'checkuiz',
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      synchronize: false,
      migrationsRun: false,
      migrations: [`${__dirname}/../migrations/*.ts`],
      migrationsTableName: 'migrations',
    }),
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([Auth]),
    JwtModule.register({}),
    CommonModule,
    WorkspaceModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, UserService, AuthService, WorkspaceService],
})
export class AppModule {}

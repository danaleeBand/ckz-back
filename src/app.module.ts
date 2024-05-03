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
import { SidebarController } from './sidebar/sidebar.controller';
import { Workspace } from './workspace/workspace.entity';
import { WorkspaceService } from './workspace/workspace.service';
import { UserWorkspace } from './workspace/user-workspace.entity';
import { SidebarService } from './sidebar/sidebar.service';
import { FolderService } from './folder/folder.service';
import { Folder } from './folder/folder.entity';
import { ChecklistService } from './checklist/checklist.service';
import { Checklist } from './checklist/checklist.entity';

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
    TypeOrmModule.forFeature([
      Auth,
      Workspace,
      UserWorkspace,
      Folder,
      Checklist,
    ]),
    JwtModule.register({}),
    CommonModule,
  ],
  controllers: [AppController, AuthController, SidebarController],
  providers: [
    AppService,
    UserService,
    AuthService,
    WorkspaceService,
    SidebarService,
    FolderService,
    ChecklistService,
  ],
})
export class AppModule {}

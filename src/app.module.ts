import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { Auth } from './auth/entities/auth.entity';
import { CommonModule } from './common.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { FolderModule } from './folder/folder.module';
import { ChecklistModule } from './checklist/checklist.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { ChecklistItemModule } from './checklist-item/checklist-item.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: 'checkuiz',
      logging: 'all',
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
    FolderModule,
    ChecklistModule,
    SidebarModule,
    ChecklistItemModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

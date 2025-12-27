import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
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
import { FileModule } from './file/file.module';
import { SupabaseModule } from './supabase/supabase.module';
import dbConfig from './config/db.config';
import supabseConfig from './config/supabse.config';

dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig, supabseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('db.databaseHost'),
          port: configService.get<number>('db.databasePort'),
          username: configService.get<string>('db.databaseUsername'),
          password: configService.get<string>('db.databasePassword'),
          database: configService.get<string>('db.databaseName'),
          entities: [`${__dirname}/**/*.entity{.ts,.js}`],
          autoLoadEntities: true,
          synchronize: false,
          namingStrategy: new SnakeNamingStrategy(),
          logging: ['error'],
          timezone: 'UTC',
          ssl: { rejectUnauthorized: false },
          dataSourceFactory: async (options) => {
            const dataSource = new DataSource(options);
            (dataSource.driver.supportedDataTypes as Array<string>).push(
              'vector',
            );
            await dataSource.initialize();
            return dataSource;
          },
        };
      },
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
    FileModule,
    SupabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

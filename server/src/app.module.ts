import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import dotenv from "dotenv"
import { configSystem } from '../config/system.config';
import { TimeModule } from './modules/time/time.module';
import { StatusModule } from './modules/status/status.module';
import { Status } from './entities/status.entity';
import { Time } from './entities/time.entity';
import { AutoModule } from './modules/auto/auto.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { AlertModule } from './modules/alert/alert.module';

dotenv.config()

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: configSystem.postgresHost,
      port: +configSystem.postgresPort,
      username: configSystem.postgresUser,
      password: configSystem.postgresPassword,
      database: configSystem.postgresDatabase,
      entities: [Time, Status],
      autoLoadEntities: true,
      synchronize: true
    }),
    MailerModule.forRoot({
      transport: {
        host: configSystem.MailHost,
        secure: false,
        auth: {
          user: configSystem.MailUser,
          pass: configSystem.MailPassword,
        },
      },
      defaults: {
        from: '"No Reply" <configSystem.MAIL_FROM>',
      },
      template: {
        dir: join(__dirname, 'base/email/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    TimeModule,
    StatusModule,
    AutoModule,
    AuthModule,
    UserModule,
    AlertModule
  ]
})

export class AppModule {};

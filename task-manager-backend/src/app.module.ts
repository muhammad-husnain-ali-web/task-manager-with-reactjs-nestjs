import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { MailsService } from './mails/mails.service';
import { MailsModule } from './mails/mails.module';
import { OtpsModule } from './otps/otps.module';
import { OTP } from './otps/entities/otp-entity';
import { JwtModule } from '@nestjs/jwt';
import { UploadsModule } from './uploads/uploads.module';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/entities/task.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECERET,
      signOptions: { expiresIn: '2d' },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, OTP, Task],
      synchronize: true,
    }),

    AuthModule, UsersModule, MailsModule, OtpsModule, UploadsModule, TasksModule
  ],
  controllers: [AppController],
  providers: [AppService, MailsService],
})
export class AppModule { }

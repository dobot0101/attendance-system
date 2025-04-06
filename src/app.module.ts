import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from './user/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'db',
      port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'attendance',
      autoLoadEntities: true,
      synchronize: true,
      logging: process.env.NODE_ENV !== 'production',
    }),
    UserModule,
    AuthModule,
    AttendanceModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly userService: UserService, private readonly configService: ConfigService) { }
  async onModuleInit() {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL')!
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD')!
    console.log(`Admin email: ${adminEmail}`);
    console.log(`Admin password: ${adminPassword}`);
    const adminExists = await this.userService.findByEmail(adminEmail);
    if (!adminExists) {
      const hashed = await bcrypt.hash(adminPassword || 'admin', 10);
      await this.userService.create({
        email: adminEmail,
        name: '관리자',
        password: hashed,
        role: UserRole.ADMIN
      });
      console.log(`✅ Admin (${adminEmail}) 계정이 생성되었습니다.`);
    }
  }
}

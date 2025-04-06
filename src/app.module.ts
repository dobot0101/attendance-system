import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from './user/user.entity';

@Module({
  imports: [
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
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private userService: UserService) {}
  async onModuleInit() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@test.com';
    const adminExists = await this.userService.findByEmail(adminEmail);
    if(!adminExists){
      const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin', 10);
      await this.userService.create({
        email: adminEmail,
        name: 'Admin',
        password: hashed,
        role: UserRole.ADMIN
      });
      console.log('Admin user created');
    }
  }
}

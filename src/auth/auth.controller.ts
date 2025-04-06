import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {

  }

  @Post('signup')
  async signup(@Body() body: { email: string, password: string, name: string }) {
    const hashed = await bcrypt.hash(body.password, 10);
    const user = await this.userService.create({
      email: body.email,
      name: body.name,
      password: hashed
    });
    return {
      id: user.id,
      email: user.email
    }
  }

  @Post('login')
  async login(@Body() body: {email:string; password:string}) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) throw new UnauthorizedException();
    return this.authService.login(user);
  }
}

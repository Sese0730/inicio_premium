import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 3, ttl: 3600 } })  // 3 registros por hora
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    
    return {
      success: true,
      data: {
        user: result.user,
        token: result.token,
      },
      error: null,
    };
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60 } })  // 5 intentos por minuto
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    
    return {
      success: true,
      data: {
        user: result.user,
        token: result.token,
      },
      error: null,
    };
  }
}
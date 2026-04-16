import { Controller, Post, Body, Get, Ip } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ⭐ Registro (solo disponible si no hay usuarios)
  @Post('registro')
  registro(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.authService.registro(createUsuarioDto);
  }

  // Login
  @Post('login')
  login(@Body() loginDto: LoginDto, @Ip() ip: string) {
    return this.authService.login(loginDto, ip);
  }

  // ⭐ Verificar si el registro está disponible
  @Get('registro-disponible')
  async isRegistroDisponible() {
    const disponible = await this.authService.isRegistroDisponible();
    return {
      disponible,
      mensaje: disponible 
        ? 'El registro está disponible. Regístrate como primer Super Administrador.' 
        : 'El registro público está cerrado. Contacta al administrador.',
    };
  }
}
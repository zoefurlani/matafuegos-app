import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole, UserEstado } from 'src/database/entities/user.entity';
import { LogActividad } from 'src/database/entities/log-actividad.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(LogActividad)
    private logsRepository: Repository<LogActividad>,
    private readonly jwtService: JwtService,
  ) {}

  // para registrar un nuevo usuario solo si no existe un superadmin
  async registro(createUsuarioDto: CreateUsuarioDto) {
    const { email, username, password } = createUsuarioDto;

    const superAdminExiste = await this.usersRepository.findOne({
      where: { rol: UserRole.SUPER_ADMIN },
    });

    if (superAdminExiste) {
      throw new ForbiddenException(
        'El registro público está deshabilitado. Contacta al administrador del sistema.',
      );
    }

    // verificar si el usuario ya existe
    const usuarioExistente = await this.usersRepository.findOne({
      where: [{ email }, { username }],
    });

    if (usuarioExistente) {
      throw new ConflictException(
        'El email o username ya está registrado en el sistema',
      );
    }

    const passwordHasheada = await bcrypt.hash(password, 10);

    const totalUsuarios = await this.usersRepository.count();
    const rol = totalUsuarios === 0 ? UserRole.SUPER_ADMIN : UserRole.USUARIO;

    const nuevoUsuario = this.usersRepository.create({
      username,
      email,
      password: passwordHasheada,
      rol,
      estado: UserEstado.ACTIVO,
    });

    const usuarioGuardado = await this.usersRepository.save(nuevoUsuario);

    await this.registrarLog(
      usuarioGuardado.id,
      'REGISTRO',
      'AUTH',
      `Usuario ${username} registrado como ${rol}`,
    );

    return {
      id: usuarioGuardado.id,
      email: usuarioGuardado.email,
      username: usuarioGuardado.username,
      rol: usuarioGuardado.rol,
      mensaje: rol === UserRole.SUPER_ADMIN 
        ? '¡Bienvenido! Has sido registrado como Super Administrador.' 
        : 'Usuario registrado exitosamente',
    };
  }

  async login(loginDto: LoginDto, ip?: string) {
    const { email, password } = loginDto;

    const usuario = await this.usersRepository.findOne({
      where: { email },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    //para verificar si el usuraio esta activo
    if (usuario.estado !== UserEstado.ACTIVO) {
      throw new ForbiddenException(
        'Tu cuenta ha sido desactivada. Contacta al administrador.',
      );
    }

    const contraseñaValida = await bcrypt.compare(password, usuario.password);

    if (!contraseñaValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    usuario.ultimoLogin = new Date();
    await this.usersRepository.save(usuario);

    await this.registrarLog(
      usuario.id,
      'LOGIN',
      'AUTH',
      `Usuario ${usuario.username} inició sesión`,
      ip,
    );

    // generar jwt
    const payload = { 
      sub: usuario.id, 
      email: usuario.email, 
      rol: usuario.rol,
      username: usuario.username 
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        email: usuario.email,
        username: usuario.username,
        rol: usuario.rol,
      },
    };
  }

  // p verificar si el registro esta disponible
  async isRegistroDisponible(): Promise<boolean> {
    const totalUsuarios = await this.usersRepository.count();
    return totalUsuarios === 0;
  }

  // registrar actividad
  private async registrarLog(
    usuarioId: number,
    accion: string,
    modulo: string,
    descripcion: string,
    ip?: string,
  ): Promise<void> {
    try {
      const log = this.logsRepository.create({
        usuarioId,
        accion,
        modulo,
        descripcion,
        ip,
      });
      await this.logsRepository.save(log);
    } catch (error) {
      console.error('Error al registrar log:', error);
    }
  }
}
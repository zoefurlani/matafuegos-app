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

  // ⭐ Método para REGISTRAR un nuevo usuario (BLOQUEADO si ya existe un super_admin)
  async registro(createUsuarioDto: CreateUsuarioDto) {
    const { email, username, password } = createUsuarioDto;

    // 🔒 VERIFICAR: ¿Ya existe un super_admin?
    const superAdminExiste = await this.usersRepository.findOne({
      where: { rol: UserRole.SUPER_ADMIN },
    });

    if (superAdminExiste) {
      throw new ForbiddenException(
        'El registro público está deshabilitado. Contacta al administrador del sistema.',
      );
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await this.usersRepository.findOne({
      where: [{ email }, { username }],
    });

    if (usuarioExistente) {
      throw new ConflictException(
        'El email o username ya está registrado en el sistema',
      );
    }

    // Hashear la contraseña
    const passwordHasheada = await bcrypt.hash(password, 10);

    // ⭐ PRIMER USUARIO = SUPER ADMIN
    const totalUsuarios = await this.usersRepository.count();
    const rol = totalUsuarios === 0 ? UserRole.SUPER_ADMIN : UserRole.USUARIO;

    // Crear nuevo usuario
    const nuevoUsuario = this.usersRepository.create({
      username,
      email,
      password: passwordHasheada,
      rol,
      estado: UserEstado.ACTIVO,
    });

    const usuarioGuardado = await this.usersRepository.save(nuevoUsuario);

    // Log de actividad
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

  // Método para LOGIN
  async login(loginDto: LoginDto, ip?: string) {
    const { email, password } = loginDto;

    // Buscar usuario por email
    const usuario = await this.usersRepository.findOne({
      where: { email },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 🔒 Verificar si el usuario está activo
    if (usuario.estado !== UserEstado.ACTIVO) {
      throw new ForbiddenException(
        'Tu cuenta ha sido desactivada. Contacta al administrador.',
      );
    }

    // Comparar contraseña
    const contraseñaValida = await bcrypt.compare(password, usuario.password);

    if (!contraseñaValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Actualizar último login
    usuario.ultimoLogin = new Date();
    await this.usersRepository.save(usuario);

    // Log de actividad
    await this.registrarLog(
      usuario.id,
      'LOGIN',
      'AUTH',
      `Usuario ${usuario.username} inició sesión`,
      ip,
    );

    // Generar JWT
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

  // ⭐ NUEVO: Verificar si el registro está disponible
  async isRegistroDisponible(): Promise<boolean> {
    const totalUsuarios = await this.usersRepository.count();
    return totalUsuarios === 0;
  }

  // ⭐ NUEVO: Registrar log de actividad
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
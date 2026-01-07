import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/database/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Método para REGISTRAR un nuevo usuario
  async registro(createUsuarioDto: CreateUsuarioDto) {
    const { email, username, password } = createUsuarioDto;

    // Verificar si el usuario ya existe
    const usuarioExistente = await this.usersRepository.findOne({
      where: [{ email }, { username }],
    });

    if (usuarioExistente) {
      throw new ConflictException(
        'El email o username ya está registrado en el sistema',
      );
    }

    // Hashear la contraseña con bcrypt (salt rounds = 10)
    const passwordHasheada = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const nuevoUsuario = this.usersRepository.create({
      username,
      email,
      password: passwordHasheada,
      rol: 'user', // rol por defecto
    });

    // Guardar en BD
    const usuarioGuardado = await this.usersRepository.save(nuevoUsuario);

    // Retornar sin exponer la contraseña
    return {
      id: usuarioGuardado.id,
      email: usuarioGuardado.email,
      username: usuarioGuardado.username,
      rol: usuarioGuardado.rol,
      mensaje: 'Usuario registrado exitosamente',
    };
  }

  // Método para LOGIN
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Buscar usuario por email
    const usuario = await this.usersRepository.findOne({
      where: { email },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Comparar contraseña ingresada con la hasheada en BD
    const contraseñaValida = await bcrypt.compare(password, usuario.password);

    if (!contraseñaValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar JWT payload
    const payload = { sub: usuario.id, email: usuario.email, rol: usuario.rol };

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
}
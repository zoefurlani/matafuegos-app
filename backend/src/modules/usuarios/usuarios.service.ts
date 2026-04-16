import { Injectable, NotFoundException, ConflictException, ForbiddenException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole, UserEstado } from 'src/database/entities/user.entity';
import { LogActividad } from 'src/database/entities/log-actividad.entity';
import { CreateUserAdminDto, UpdateUserAdminDto } from './dto/create-user-admin.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(LogActividad)
    private logsRepository: Repository<LogActividad>,
  ) {}

  // ⭐ Obtener todos los usuarios
  async findAll() {
    const usuarios = await this.usersRepository.find({
      select: ['id', 'username', 'email', 'rol', 'estado', 'ultimoLogin', 'createdAt'],
      order: { createdAt: 'DESC' },
    });

    return {
      total: usuarios.length,
      usuarios,
    };
  }

  // ⭐ Obtener un usuario por ID
  async findOne(id: number) {
    const usuario = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'rol', 'estado', 'ultimoLogin', 'createdAt'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  // ⭐ Crear usuario (solo super_admin y admin)
  async create(createUserDto: CreateUserAdminDto, adminId: number) {
    const { email, username, password, rol } = createUserDto;

    // Verificar si el usuario ya existe
    const usuarioExistente = await this.usersRepository.findOne({
      where: [{ email }, { username }],
    });

    if (usuarioExistente) {
      throw new ConflictException('El email o username ya está registrado');
    }

    // Hashear contraseña
    const passwordHasheada = await bcrypt.hash(password, 10);

    // Crear usuario
    const nuevoUsuario = this.usersRepository.create({
      username,
      email,
      password: passwordHasheada,
      rol: rol || UserRole.USUARIO,
      estado: UserEstado.ACTIVO,
    });

    const usuarioGuardado = await this.usersRepository.save(nuevoUsuario);

    // Log de actividad
    await this.registrarLog(
      adminId,
      'CREAR_USUARIO',
      'USUARIOS',
      `Creó usuario ${username} con rol ${rol || 'usuario'}`,
    );

    return {
      id: usuarioGuardado.id,
      username: usuarioGuardado.username,
      email: usuarioGuardado.email,
      rol: usuarioGuardado.rol,
      estado: usuarioGuardado.estado,
      mensaje: 'Usuario creado exitosamente',
    };
  }

  // ⭐ Actualizar usuario
  async update(id: number, updateUserDto: UpdateUserAdminDto, adminId: number, observacion?: string) {
    const usuario = await this.usersRepository.findOne({ where: { id } });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const estadoAnterior = usuario.estado;

    // 🔒 No permitir que se modifique el super_admin original
    if (usuario.rol === UserRole.SUPER_ADMIN && updateUserDto.rol && updateUserDto.rol !== UserRole.SUPER_ADMIN) {
      const superAdminsCount = await this.usersRepository.count({
        where: { rol: UserRole.SUPER_ADMIN },
      });

      if (superAdminsCount === 1) {
        throw new ForbiddenException('No puedes eliminar el único Super Administrador del sistema');
      }
    }

    // Si hay nueva contraseña, hashearla
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Actualizar
    Object.assign(usuario, updateUserDto);
    const usuarioActualizado = await this.usersRepository.save(usuario);

    // Log de actividad con observación
    let descripcion = `Actualizó usuario ${usuario.username}`;
    
    // Si cambió el estado, agregarlo al log
    if (updateUserDto.estado && estadoAnterior !== updateUserDto.estado) {
      descripcion += ` - Estado: ${estadoAnterior} → ${updateUserDto.estado}`;
    }
    
    // Agregar observación si existe
    if (observacion) {
      descripcion += ` - Observación: ${observacion}`;
    }

    await this.registrarLog(
      adminId,
      'ACTUALIZAR_USUARIO',
      'USUARIOS',
      descripcion,
    );

    return {
      id: usuarioActualizado.id,
      username: usuarioActualizado.username,
      email: usuarioActualizado.email,
      rol: usuarioActualizado.rol,
      estado: usuarioActualizado.estado,
      mensaje: 'Usuario actualizado exitosamente',
    };
  }

  // ⭐ "Eliminar" usuario (en realidad lo bloquea)
  async remove(id: number, adminId: number, observacion?: string) {
    const usuario = await this.usersRepository.findOne({ where: { id } });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // 🔒 No permitir bloquear el super_admin original
    if (usuario.rol === UserRole.SUPER_ADMIN) {
      const superAdminsCount = await this.usersRepository.count({
        where: { rol: UserRole.SUPER_ADMIN, estado: UserEstado.ACTIVO },
      });

      if (superAdminsCount === 1) {
        throw new ForbiddenException('No puedes bloquear el único Super Administrador activo del sistema');
      }
    }

    // ⭐ CAMBIO PROFESIONAL: Bloquear en vez de eliminar
    usuario.estado = UserEstado.BLOQUEADO;
    await this.usersRepository.save(usuario);

    // Log de actividad con observación
    const descripcion = observacion 
      ? `Bloqueó usuario ${usuario.username} (ID: ${id}) - Motivo: ${observacion}`
      : `Bloqueó usuario ${usuario.username} (ID: ${id})`;

    await this.registrarLog(
      adminId,
      'BLOQUEAR_USUARIO',
      'USUARIOS',
      descripcion,
    );

    return {
      mensaje: 'Usuario bloqueado exitosamente',
      id,
      username: usuario.username,
    };
  }

  // ⭐ NUEVO: Usuario cambia su propia contraseña
  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar que la contraseña actual sea correcta
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña
    await this.usersRepository.update(userId, { password: hashedPassword });

    // Registrar log de actividad
    await this.registrarLog(
      userId,
      'CAMBIO_PASSWORD',
      'USUARIOS',
      'Usuario cambió su contraseña',
    );
  }

  // ⭐ NUEVO: Super admin resetea contraseña de otro usuario
  async adminResetPassword(adminId: number, targetUserId: number, newPassword: string): Promise<void> {
    // Verificar que el target user existe
    const targetUser = await this.usersRepository.findOne({ where: { id: targetUserId } });

    if (!targetUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // No permitir que se cambie la contraseña del propio admin de esta forma
    if (adminId === targetUserId) {
      throw new BadRequestException('Usa la función de cambio de contraseña para tu propia cuenta');
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña
    await this.usersRepository.update(targetUserId, { password: hashedPassword });

    // Registrar log de actividad
    await this.registrarLog(
      adminId,
      'RESET_PASSWORD_ADMIN',
      'USUARIOS',
      `Admin reseteo contraseña del usuario ID: ${targetUserId} (${targetUser.username})`,
    );
  }

  // ⭐ Obtener logs de actividad
  async getLogs(limit: number = 100) {
    const logs = await this.logsRepository.find({
      relations: ['usuario'],
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return {
      total: logs.length,
      logs: logs.map(log => ({
        id: log.id,
        accion: log.accion,
        modulo: log.modulo,
        descripcion: log.descripcion,
        ip: log.ip,
        fecha: log.createdAt,
        usuario: log.usuario ? {
          id: log.usuario.id,
          username: log.usuario.username,
        } : null,
      })),
    };
  }

  // ⭐ Registrar log de actividad
  private async registrarLog(
    usuarioId: number,
    accion: string,
    modulo: string,
    descripcion: string,
    ip?: string,
  ): Promise<void> {
    try {
      const log = this.logsRepository.create({
        usuarioId,  // ⭐ IMPORTANTE: asignar directamente el ID
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
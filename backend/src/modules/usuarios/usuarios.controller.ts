import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsuariosService } from './usuarios.service';
import { CreateUserAdminDto, UpdateUserAdminDto } from './dto/create-user-admin.dto';
import { ChangePasswordDto, AdminResetPasswordDto } from './dto/change-password.dto';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // ⭐ Obtener todos los usuarios (super_admin y admin)
  @Get()
  @Roles('super_admin', 'admin')
  findAll() {
    return this.usuariosService.findAll();
  }

  // ⭐ Obtener logs de actividad (solo super_admin)
  @Get('logs')
  @Roles('super_admin')
  getLogs() {
    return this.usuariosService.getLogs(100);
  }

  // ⭐ Obtener un usuario por ID
  @Get(':id')
  @Roles('super_admin', 'admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id);
  }

  // ⭐ Crear usuario (solo super_admin)
  @Post()
  @Roles('super_admin')
  create(@Body() createUserDto: CreateUserAdminDto, @Request() req) {
    return this.usuariosService.create(createUserDto, req.user.userId);
  }

  // ⭐ Actualizar usuario (solo super_admin)
  @Patch(':id')
  @Roles('super_admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserAdminDto,
    @Request() req,
  ) {
    const { observacion, ...userData } = updateUserDto as any;
    return this.usuariosService.update(id, userData, req.user.userId, observacion);
  }

  // ⭐ Eliminar usuario (solo super_admin)
  @Delete(':id')
  @Roles('super_admin')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const observacion = req.body?.observacion;
    return this.usuariosService.remove(id, req.user.userId, observacion);
  }

  // ⭐ NUEVO: Cambiar propia contraseña (cualquier usuario logueado)
  @Patch('cambiar-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.usuariosService.changePassword(
      req.user.userId,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
    
    return { 
      message: 'Contraseña actualizada correctamente',
      success: true 
    };
  }

  // ⭐ NUEVO: Admin resetea contraseña de otro usuario (solo super_admin)
  @Patch(':id/reset-password')
  @Roles('super_admin')
  async adminResetPassword(
    @Param('id', ParseIntPipe) targetUserId: number,
    @Body() adminResetPasswordDto: AdminResetPasswordDto,
    @Request() req,
  ) {
    await this.usuariosService.adminResetPassword(
      req.user.userId,
      targetUserId,
      adminResetPasswordDto.newPassword,
    );
    
    return { 
      message: 'Contraseña reseteada correctamente por el administrador',
      success: true 
    };
  }
}
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';

export enum CreateUserRole {
  ADMIN = 'admin',
  USUARIO = 'usuario'
}

export enum CreateUserEstado {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  BLOQUEADO = 'bloqueado'
}

export class CreateUserAdminDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(CreateUserRole)
  @IsOptional()
  rol?: string;

  @IsEnum(CreateUserEstado) // ⭐ AGREGAR VALIDACIÓN DE ESTADO
  @IsOptional()
  estado?: string;
}

export class UpdateUserAdminDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsEnum(['super_admin', 'admin', 'usuario'])
  rol?: string;

  @IsOptional()
  @IsEnum(['activo', 'inactivo', 'bloqueado'])
  estado?: string;
}
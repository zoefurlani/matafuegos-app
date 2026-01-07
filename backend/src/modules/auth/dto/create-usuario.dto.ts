import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'El username debe tener al menos 3 caracteres' })
  username: string;

  @IsEmail({}, { message: 'Debe ser un email válido' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}
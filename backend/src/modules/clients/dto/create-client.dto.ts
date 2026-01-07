import { IsString, IsNotEmpty, IsEmail, IsOptional, MinLength, Matches } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  nombre: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{2}-\d{8}-\d{1}$/, { 
    message: 'El CUIT debe tener formato XX-XXXXXXXX-X' 
  })
  cuit?: string;

  @IsString()
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  telefono: string;

  @IsOptional()
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email?: string;

  @IsString()
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  direccion: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
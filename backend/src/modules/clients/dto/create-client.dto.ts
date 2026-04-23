import { IsString, IsNotEmpty, IsEmail, IsOptional, MinLength, Matches, ValidateIf } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  nombre!: string;

  @IsOptional()
  @ValidateIf((o) => o.cuit && o.cuit.trim() !== '')
  @IsString()
  @Matches(/^\d{2}-\d{8}-\d{1}$/, { 
    message: 'El CUIT debe tener formato XX-XXXXXXXX-X' 
  })
  cuit?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @ValidateIf((o) => o.email && o.email.trim() !== '')
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
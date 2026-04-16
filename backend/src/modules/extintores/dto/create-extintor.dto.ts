import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString, IsIn, Min } from 'class-validator';

export class CreateExtintorDto {
  @IsString()
  @IsNotEmpty({ message: 'El número de equipo es obligatorio' })
  numeroEquipo: string;

  @IsString()
  @IsNotEmpty({ message: 'El tipo es obligatorio' })
  @IsIn(['ABC', 'CO2', 'AFFF', 'HCFC', 'K', 'Espuma', 'Agua', 'Halón'], {
    message: 'El tipo debe ser: ABC, CO2, AFFF, HCFC, K, Espuma, Agua o Halón',
  })
  tipo: string;

  @IsNumber()
  @IsNotEmpty({ message: 'La capacidad es obligatoria' })
  @Min(0.5, { message: 'La capacidad mínima es 0.5 kg' })
  capacidad: number;

  @IsOptional()
  @IsString()
  marca?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'El ID del cliente es obligatorio' })
  clienteId: number;

  @IsOptional()
  @IsDateString()
  fechaUltimaRecarga?: string;

  @IsOptional()
  @IsDateString()
  fechaVencimiento?: string;

  @IsOptional()
  @IsString()
  @IsIn(['activo', 'vencido', 'en_mantenimiento', 'baja'], {
    message: 'El estado debe ser: activo, vencido, en_mantenimiento o baja',
  })
  estado?: string;

  @IsOptional()
  @IsString()
  ubicacion?: string; // ⭐ AGREGADO

  @IsOptional()
  @IsString()
  observaciones?: string; // ⭐ AGREGADO
}
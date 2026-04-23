import { IsString, IsNotEmpty, IsOptional, IsNumber, IsIn } from 'class-validator';

export class CreateRecursoEducativoDto {
  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @IsString()
  @IsIn(['tipo_fuego', 'tipo_extintor', 'normativa', 'mantenimiento', 'uso'])
  categoria!: string;

  @IsString()
  @IsOptional()
  tipoFuego?: string;

  @IsString()
  @IsOptional()
  tipoExtintor?: string;

  @IsString()
  @IsOptional()
  capacidad?: string;

  @IsString()
  @IsOptional()
  aplicacion?: string;

  @IsString()
  @IsNotEmpty()
  contenidoDetallado!: string;

  @IsString()
  @IsOptional()
  imagenUrl?: string;

  @IsString()
  @IsOptional()
  archivoPdfUrl?: string;

  @IsNumber()
  @IsOptional()
  orden?: number;

  @IsString()
  @IsOptional()
  @IsIn(['activo', 'inactivo'])
  estado?: string;
}

export class UpdateRecursoEducativoDto {
  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  @IsIn(['tipo_fuego', 'tipo_extintor', 'normativa', 'mantenimiento', 'uso'])
  categoria?: string;

  @IsString()
  @IsOptional()
  tipoFuego?: string;

  @IsString()
  @IsOptional()
  tipoExtintor?: string;

  @IsString()
  @IsOptional()
  capacidad?: string;

  @IsString()
  @IsOptional()
  aplicacion?: string;

  @IsString()
  @IsOptional()
  contenidoDetallado?: string;

  @IsString()
  @IsOptional()
  imagenUrl?: string;

  @IsString()
  @IsOptional()
  archivoPdfUrl?: string;

  @IsNumber()
  @IsOptional()
  orden?: number;

  @IsString()
  @IsOptional()
  @IsIn(['activo', 'inactivo'])
  estado?: string;
}
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsIn, Min } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre!: string;

  @IsString()
  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  @IsIn(['polvo', 'repuesto', 'accesorio'], {
    message: 'La categoría debe ser: polvo, repuesto o accesorio',
  })
  categoria!: string;

  @IsString()
  @IsNotEmpty({ message: 'La unidad de medida es obligatoria' })
  @IsIn(['kg', 'unidad', 'litro', 'metro'], {
    message: 'La unidad de medida debe ser: kg, unidad, litro o metro',
  })
  unidadMedida!: string;

  @IsNumber()
  @IsNotEmpty({ message: 'El stock actual es obligatorio' })
  @Min(0)
  stockActual!: number;

  @IsNumber()
  @IsNotEmpty({ message: 'El stock mínimo es obligatorio' })
  @Min(0)
  stockMinimo!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precioUnitario?: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  @IsIn(['activo', 'inactivo'], {
    message: 'El estado debe ser: activo o inactivo',
  })
  estado?: string;
}
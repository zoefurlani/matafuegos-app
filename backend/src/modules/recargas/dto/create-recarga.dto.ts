import { 
  IsNumber, 
  IsNotEmpty, 
  IsOptional, 
  IsDateString, 
  IsString, 
  IsIn,
  Min 
} from 'class-validator';

export class CreateRecargaDto {
  @IsNumber()
  @IsNotEmpty({ message: 'El ID del extintor es obligatorio' })
  extintorId: number;

  @IsNumber()
  @IsNotEmpty({ message: 'El ID del cliente es obligatorio' })
  clienteId: number;

  @IsDateString()
  @IsNotEmpty({ message: 'La fecha de recarga es obligatoria' })
  fechaRecarga: string;

  @IsOptional()
  @IsDateString()
  fechaProximaRecarga?: string;

  // Repuestos utilizados
  @IsOptional()
  @IsNumber()
  @Min(0)
  polvoKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  manometros?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  vastagos?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  valvulas?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  orings?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  mangueras?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  boquillas?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  seguros?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  etiquetas?: number;

  @IsNumber()
  @IsNotEmpty({ message: 'El precio total es obligatorio' })
  @Min(0, { message: 'El precio debe ser mayor o igual a 0' })
  precioTotal: number;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsString()
  @IsIn(['completada', 'pendiente', 'cancelada'], {
    message: 'El estado debe ser: completada, pendiente o cancelada',
  })
  estado?: string;
}

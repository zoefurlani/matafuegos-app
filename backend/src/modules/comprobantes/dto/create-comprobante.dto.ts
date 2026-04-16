import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber, IsDateString, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class ComprobanteItemDto {
  @IsString()
  @IsIn(['Recarga', 'Venta', 'Servicio'])
  tipoOperacion!: 'Recarga' | 'Venta' | 'Servicio';

  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @IsNumber()
  cantidad!: number;

  @IsNumber()
  precioUnitario!: number;

  @IsNumber()
  subtotal!: number;
}

export class CreateComprobanteDto {
  @IsDateString()
  fecha!: string;

  // ✅ FOREIGN KEYS
  @IsNumber()
  @IsNotEmpty()
  clienteId!: number;

  @IsNumber()
  @IsOptional()
  ventaId?: number;

  // Datos del cliente (para PDF)
  @IsString()
  @IsNotEmpty()
  clienteNombre!: string;

  @IsString()
  @IsOptional()
  clienteDni?: string;

  @IsString()
  @IsOptional()
  clienteDireccion?: string;

  @IsString()
  @IsOptional()
  clienteTelefono?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComprobanteItemDto)
  items!: ComprobanteItemDto[];

  @IsNumber()
  total!: number;

  @IsString()
  @IsOptional()
  observaciones?: string;
}
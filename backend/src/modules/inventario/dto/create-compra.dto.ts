import { IsNumber, IsNotEmpty, IsOptional, IsDateString, IsString, Min } from 'class-validator';

export class CreateCompraDto {
  @IsNumber()
  @IsNotEmpty({ message: 'El ID del producto es obligatorio' })
  productoId!: number;

  @IsNumber()
  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  @Min(0.01, { message: 'La cantidad debe ser mayor a 0' })
  cantidad!: number;

  @IsNumber()
  @IsNotEmpty({ message: 'El precio unitario es obligatorio' })
  @Min(0)
  precioUnitario!: number;

  @IsDateString()
  @IsNotEmpty({ message: 'La fecha de compra es obligatoria' })
  fechaCompra!: string;

  @IsOptional()
  @IsString()
  proveedor?: string;

  @IsOptional()
  @IsString()
  numeroFactura?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
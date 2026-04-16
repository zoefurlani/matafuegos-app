import { IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class CreateVentaDto {
  @IsNumber()
  clienteId: number;

  @IsNumber()
  productoId: number;

  @IsNumber()
  @Min(1)
  cantidad: number;

  @IsNumber()
  @Min(0)
  precioUnitario: number;

  @IsString()
  numeroEquipo: string; // Número de equipo del extintor vendido

  @IsOptional()
  @IsString()
  observaciones?: string;
}
// import { IsNumber, IsNotEmpty, IsOptional, IsDateString, IsString, IsArray } from 'class-validator';

// export class ItemComprobanteDto {
  // descripcion: string;
  // cantidad: number;
  // importe: number;
// }

// export class CreateComprobanteDto {
  // @IsNumber()
  // @IsNotEmpty({ message: 'El ID de la recarga es obligatorio' })
  // recargaId: number;

  // @IsNumber()
  // @IsNotEmpty({ message: 'El ID del cliente es obligatorio' })
  // clienteId: number;

  // @IsDateString()
  // @IsNotEmpty({ message: 'La fecha de emisión es obligatoria' })
  // fechaEmision: string;

  // @IsArray()
  // @IsNotEmpty({ message: 'Los items son obligatorios' })
  // items: ItemComprobanteDto[];

  // @IsOptional()
  // @IsString()
  // observaciones?: string;
// }

import { IsNumber, IsNotEmpty, IsOptional, IsDateString, IsString, IsArray } from 'class-validator';

export class ItemComprobanteDto {
  descripcion: string;
  cantidad: number;
  precioUnitario: number; // ← CAMBIADO de "importe" a "precioUnitario"
}

export class CreateComprobanteDto {
  @IsNumber()
  @IsNotEmpty({ message: 'El ID de la recarga es obligatorio' })
  recargaId: number;

  @IsNumber()
  @IsNotEmpty({ message: 'El ID del cliente es obligatorio' })
  clienteId: number;

  @IsDateString()
  @IsNotEmpty({ message: 'La fecha de emisión es obligatoria' })
  fechaEmision: string;

  @IsArray()
  @IsNotEmpty({ message: 'Los items son obligatorios' })
  items: ItemComprobanteDto[];

  @IsOptional()
  @IsString()
  observaciones?: string;
}

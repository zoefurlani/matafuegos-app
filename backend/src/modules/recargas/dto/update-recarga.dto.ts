import { PartialType } from '@nestjs/mapped-types';
import { CreateRecargaDto } from './create-recarga.dto';

export class UpdateRecargaDto extends PartialType(CreateRecargaDto) {}
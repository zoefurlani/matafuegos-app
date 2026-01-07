import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RecargasService } from './recargas.service';
import { CreateRecargaDto } from './dto/create-recarga.dto';
import { UpdateRecargaDto } from './dto/update-recarga.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('recargas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class RecargasController {
  constructor(private readonly recargasService: RecargasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRecargaDto: CreateRecargaDto) {
    return this.recargasService.create(createRecargaDto);
  }

  @Get()
  findAll() {
    return this.recargasService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.recargasService.getStats();
  }

  @Get('client/:clienteId')
  findByClient(@Param('clienteId', ParseIntPipe) clienteId: number) {
    return this.recargasService.findByClient(clienteId);
  }

  @Get('extintor/:extintorId')
  findByExtintor(@Param('extintorId', ParseIntPipe) extintorId: number) {
    return this.recargasService.findByExtintor(extintorId);
  }

  @Get('date-range')
  findByDateRange(
    @Query('fechaDesde') fechaDesde: string,
    @Query('fechaHasta') fechaHasta: string,
  ) {
    return this.recargasService.findByDateRange(fechaDesde, fechaHasta);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recargasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecargaDto: UpdateRecargaDto,
  ) {
    return this.recargasService.update(id, updateRecargaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recargasService.remove(id);
  }
}

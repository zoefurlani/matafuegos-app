import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RecargasService } from './recargas.service';
import { CreateRecargaDto } from './dto/create-recarga.dto';
import { UpdateRecargaDto } from './dto/update-recarga.dto';

@Controller('recargas')
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
  findByCliente(@Param('clienteId', ParseIntPipe) clienteId: number) {
    return this.recargasService.findByCliente(clienteId);
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
    const startDate = new Date(fechaDesde);
    const endDate = new Date(fechaHasta);
    return this.recargasService.findByDateRange(startDate, endDate);
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
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recargasService.remove(id);
  }
}
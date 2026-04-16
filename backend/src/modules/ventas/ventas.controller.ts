import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('ventas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  // ⭐ Crear venta
  @Post()
  @Roles('admin', 'super_admin')
  create(@Body() createVentaDto: CreateVentaDto, @Request() req) {
    return this.ventasService.create(createVentaDto, req.user.userId);
  }

  // ⭐ Obtener todas las ventas
  @Get()
  @Roles('admin', 'super_admin')
  findAll() {
    return this.ventasService.findAll();
  }

  // ⭐ Obtener estadísticas
  @Get('stats')
  @Roles('admin', 'super_admin')
  getStats() {
    return this.ventasService.getStats();
  }

  // ⭐ Obtener ventas por cliente
  @Get('cliente/:clienteId')
  @Roles('admin', 'super_admin')
  findByCliente(@Param('clienteId', ParseIntPipe) clienteId: number) {
    return this.ventasService.findByCliente(clienteId);
  }

  // ⭐ Obtener ventas por rango de fechas
  @Get('date-range')
  @Roles('admin', 'super_admin')
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.ventasService.findByDateRange(startDate, endDate);
  }

  // ⭐ Obtener venta por ID
  @Get(':id')
  @Roles('admin', 'super_admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.findOne(id);
  }

  // ⭐ Actualizar venta
  @Patch(':id')
  @Roles('admin', 'super_admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVentaDto: UpdateVentaDto,
  ) {
    return this.ventasService.update(id, updateVentaDto);
  }

  // ⭐ Eliminar venta
  @Delete(':id')
  @Roles('super_admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.remove(id);
  }
}
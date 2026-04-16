import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RecursosEducativosService } from './recursos-educativos.service';
import { CreateRecursoEducativoDto, UpdateRecursoEducativoDto } from './dto/recursos-educativos.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('recursos-educativos')
export class RecursosEducativosController {
  constructor(private readonly recursosService: RecursosEducativosService) {}

  // ==================== ENDPOINTS PÚBLICOS ====================

  // ===== OBTENER RECURSOS PÚBLICOS CON FILTROS =====
  @Get('public')
  findPublic(
    @Query('categoria') categoria?: string,
    @Query('tipoFuego') tipoFuego?: string,
    @Query('tipoExtintor') tipoExtintor?: string,
    @Query('capacidad') capacidad?: string,
    @Query('aplicacion') aplicacion?: string,
    @Query('search') search?: string,
  ) {
    return this.recursosService.findPublic({
      categoria,
      tipoFuego,
      tipoExtintor,
      capacidad,
      aplicacion,
      search,
    });
  }

  // ===== OBTENER FILTROS DISPONIBLES =====
  @Get('public/filters')
  getFilters() {
    return this.recursosService.getAvailableFilters();
  }

  // ===== OBTENER RECURSO PÚBLICO POR ID =====
  @Get('public/:id')
  findOnePublic(@Param('id') id: string) {
    return this.recursosService.findOne(+id);
  }

  // ==================== ENDPOINTS ADMIN ====================

  // ===== CREAR RECURSO =====
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  create(@Body() createDto: CreateRecursoEducativoDto) {
    return this.recursosService.create(createDto);
  }

  // ===== OBTENER TODOS (ADMIN) =====
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  findAll() {
    return this.recursosService.findAll();
  }

  // ===== OBTENER ESTADÍSTICAS =====
  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  getStats() {
    return this.recursosService.getStats();
  }

  // ===== OBTENER POR ID =====
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  findOne(@Param('id') id: string) {
    return this.recursosService.findOne(+id);
  }

  // ===== ACTUALIZAR RECURSO =====
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  update(@Param('id') id: string, @Body() updateDto: UpdateRecursoEducativoDto) {
    return this.recursosService.update(+id, updateDto);
  }

  // ===== ELIMINAR RECURSO =====
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  remove(@Param('id') id: string) {
    return this.recursosService.remove(+id);
  }
}
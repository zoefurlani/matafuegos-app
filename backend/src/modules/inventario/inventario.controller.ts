// import {
  // Controller,
  // Get,
  // Post,
  // Body,
  // Patch,
  // Param,
  // Delete,
  // UseGuards,
  // Query,
  // ParseIntPipe,
  // HttpCode,
  // HttpStatus,
// } from '@nestjs/common';
// import { ApiBearerAuth } from '@nestjs/swagger';
// import { InventarioService } from './inventario.service';
// import { CreateProductoDto } from './dto/create-producto.dto';
// import { UpdateProductoDto } from './dto/update-producto.dto';
// import { CreateCompraDto } from './dto/create-compra.dto';
// import { UpdateCompraDto } from './dto/update-compra.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// @Controller('inventario')
// //@UseGuards(JwtAuthGuard)
// @ApiBearerAuth('JWT')
// export class InventarioController {
  // constructor(private readonly inventarioService: InventarioService) {}

  // // ========== PRODUCTOS ==========

  // @Post('productos')
  // @HttpCode(HttpStatus.CREATED)
  // createProducto(@Body() createProductoDto: CreateProductoDto) {
    // return this.inventarioService.createProducto(createProductoDto);
  // }

  // @Get('productos')
  // findAllProductos() {
    // return this.inventarioService.findAllProductos();
  // }

  // @Get('productos/bajo-stock')
  // findProductosBajoStock() {
    // return this.inventarioService.findProductosBajoStock();
  // }

  // @Get('productos/categoria/:categoria')
  // findProductosByCategoria(@Param('categoria') categoria: string) {
    // return this.inventarioService.findProductosByCategoria(categoria);
  // }

  // @Get('productos/:id')
  // findOneProducto(@Param('id', ParseIntPipe) id: number) {
    // return this.inventarioService.findOneProducto(id);
  // }

  // @Patch('productos/:id')
  // updateProducto(
    // @Param('id', ParseIntPipe) id: number,
    // @Body() updateProductoDto: UpdateProductoDto,
  // ) {
    // return this.inventarioService.updateProducto(id, updateProductoDto);
  // }

  // @Delete('productos/:id')
  // removeProducto(@Param('id', ParseIntPipe) id: number) {
    // return this.inventarioService.removeProducto(id);
  // }

  // // ========== COMPRAS ==========

  // @Post('compras')
  // @HttpCode(HttpStatus.CREATED)
  // createCompra(@Body() createCompraDto: CreateCompraDto) {
    // return this.inventarioService.createCompra(createCompraDto);
  // }

  // @Get('compras')
  // findAllCompras() {
    // return this.inventarioService.findAllCompras();
  // }

  // @Get('compras/producto/:productoId')
  // findComprasByProducto(@Param('productoId', ParseIntPipe) productoId: number) {
    // return this.inventarioService.findComprasByProducto(productoId);
  // }

  // @Get('compras/:id')
  // findOneCompra(@Param('id', ParseIntPipe) id: number) {
    // return this.inventarioService.findOneCompra(id);
  // }

  // @Patch('compras/:id')
  // updateCompra(
    // @Param('id', ParseIntPipe) id: number,
    // @Body() updateCompraDto: UpdateCompraDto,
  // ) {
    // return this.inventarioService.updateCompra(id, updateCompraDto);
  // }

  // @Delete('compras/:id')
  // removeCompra(@Param('id', ParseIntPipe) id: number) {
    // return this.inventarioService.removeCompra(id);
  // }

  // // ========== ESTADÍSTICAS ==========

  // @Get('stats')
  // getStats() {
    // return this.inventarioService.getStats();
  // }
// }



import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InventarioService } from './inventario.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';

@ApiTags('inventario')
@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  // ========== PRODUCTOS ==========

  @Post('productos')
  @HttpCode(HttpStatus.CREATED)
  createProducto(@Body() createProductoDto: CreateProductoDto) {
    return this.inventarioService.createProducto(createProductoDto);
  }

  @Get('productos')
  findAllProductos() {
    return this.inventarioService.findAllProductos();
  }

  @Get('productos/bajo-stock')
  findProductosBajoStock() {
    return this.inventarioService.findProductosBajoStock();
  }

  @Get('productos/categoria/:categoria')
  findProductosByCategoria(@Param('categoria') categoria: string) {
    return this.inventarioService.findProductosByCategoria(categoria);
  }

  @Get('productos/:id')
  findOneProducto(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.findOneProducto(id);
  }

  @Patch('productos/:id')
  updateProducto(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.inventarioService.updateProducto(id, updateProductoDto);
  }

  @Delete('productos/:id')
  removeProducto(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.removeProducto(id);
  }

  // ========== COMPRAS ==========

  @Post('compras')
  @HttpCode(HttpStatus.CREATED)
  createCompra(@Body() createCompraDto: CreateCompraDto) {
    return this.inventarioService.createCompra(createCompraDto);
  }

  @Get('compras')
  findAllCompras() {
    return this.inventarioService.findAllCompras();
  }

  @Get('compras/producto/:productoId')
  findComprasByProducto(@Param('productoId', ParseIntPipe) productoId: number) {
    return this.inventarioService.findComprasByProducto(productoId);
  }

  @Get('compras/:id')
  findOneCompra(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.findOneCompra(id);
  }

  @Patch('compras/:id')
  updateCompra(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompraDto: UpdateCompraDto,
  ) {
    return this.inventarioService.updateCompra(id, updateCompraDto);
  }

  @Delete('compras/:id')
  removeCompra(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.removeCompra(id);
  }

  // ========== ESTADÍSTICAS ==========

  @Get('stats')
  getStats() {
    return this.inventarioService.getStats();
  }
}
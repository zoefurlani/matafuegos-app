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
// import { ExtintoresService } from './extintores.service';
// import { CreateExtintorDto } from './dto/create-extintor.dto';
// import { UpdateExtintorDto } from './dto/update-extintor.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// @Controller('extintores')
// //@UseGuards(JwtAuthGuard)
// @ApiBearerAuth('JWT')
// export class ExtintoresController {
  // constructor(private readonly extintoresService: ExtintoresService) {}

  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // create(@Body() createExtintorDto: CreateExtintorDto) {
    // return this.extintoresService.create(createExtintorDto);
  // }

  // @Get()
  // findAll() {
    // return this.extintoresService.findAll();
  // }

  // @Get('client/:clienteId')
  // findByClient(@Param('clienteId', ParseIntPipe) clienteId: number) {
    // return this.extintoresService.findByClient(clienteId);
  // }

  // @Get('expiring')
  // findExpiringSoon(@Query('dias') dias?: number) {
    // return this.extintoresService.findExpiringSoon(dias ? +dias : 30);
  // }

  // @Get('numero/:numeroEquipo')
  // findByNumeroEquipo(@Param('numeroEquipo') numeroEquipo: string) {
    // return this.extintoresService.findByNumeroEquipo(numeroEquipo);
  // }

  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
    // return this.extintoresService.findOne(id);
  // }

  // @Patch(':id')
  // update(
    // @Param('id', ParseIntPipe) id: number,
    // @Body() updateExtintorDto: UpdateExtintorDto,
  // ) {
    // return this.extintoresService.update(id, updateExtintorDto);
  // }

  // @Delete(':id')
  // remove(@Param('id', ParseIntPipe) id: number) {
    // return this.extintoresService.remove(id);
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
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ExtintoresService } from './extintores.service';
import { CreateExtintorDto } from './dto/create-extintor.dto';
import { UpdateExtintorDto } from './dto/update-extintor.dto';

@ApiTags('extintores')
@Controller('extintores')
export class ExtintoresController {
  constructor(private readonly extintoresService: ExtintoresService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createExtintorDto: CreateExtintorDto) {
    return this.extintoresService.create(createExtintorDto);
  }

  @Get()
  findAll() {
    return this.extintoresService.findAll();
  }

  @Get('client/:clienteId')
  findByClient(@Param('clienteId', ParseIntPipe) clienteId: number) {
    return this.extintoresService.findByClient(clienteId);
  }

  @Get('expiring')
  findExpiringSoon(@Query('dias') dias?: number) {
    return this.extintoresService.findExpiringSoon(dias ? +dias : 30);
  }

  @Get('numero/:numeroEquipo')
  findByNumeroEquipo(@Param('numeroEquipo') numeroEquipo: string) {
    return this.extintoresService.findByNumeroEquipo(numeroEquipo);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.extintoresService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExtintorDto: UpdateExtintorDto,
  ) {
    return this.extintoresService.update(id, updateExtintorDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.extintoresService.remove(id);
  }
}
import { Controller, Get, Post, Delete, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { TestimoniosService } from './testimonios.service';
import { CreateTestimonioDto } from './dto/create-testimonio.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('testimonios')
export class TestimoniosController {
  constructor(private readonly testimoniosService: TestimoniosService) {}

  @Post()
  create(@Body() createTestimonioDto: CreateTestimonioDto) {
    return this.testimoniosService.create(createTestimonioDto);
  }

  @Get('public')
  findAllPublic() {
    return this.testimoniosService.findAllPublic();
  }

  @Get('public/rating/:rating')
  findByRating(@Param('rating') rating: string) {
    return this.testimoniosService.findByRating(+rating);
  }

  @Delete('own/:id')
  deleteOwn(@Param('id') id: string, @Body('userEmail') userEmail: string) {
    return this.testimoniosService.deleteOwn(+id, userEmail);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Get()
  findAll() {
    return this.testimoniosService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Get('stats')
  getStats() {
    return this.testimoniosService.getStats();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Delete(':id')
  deleteByAdmin(@Param('id') id: string) {
    return this.testimoniosService.deleteByAdmin(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Patch(':id/toggle-visibility')
  toggleVisibility(@Param('id') id: string) {
    return this.testimoniosService.toggleVisibility(+id);
  }
}
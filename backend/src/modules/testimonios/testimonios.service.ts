import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Testimonio } from '../../database/entities/testimonio.entity';
import { CreateTestimonioDto } from './dto/create-testimonio.dto';

@Injectable()
export class TestimoniosService {
  constructor(
    @InjectRepository(Testimonio)
    private testimoniosRepository: Repository<Testimonio>,
  ) {}

  async create(createTestimonioDto: CreateTestimonioDto): Promise<Testimonio> {
    const testimonio = this.testimoniosRepository.create(createTestimonioDto);
    return await this.testimoniosRepository.save(testimonio);
  }

  async findAllPublic(): Promise<Testimonio[]> {
    return await this.testimoniosRepository.find({
      where: { isVisible: 1 },  // ✅ Cambio: true → 1
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(): Promise<Testimonio[]> {
    return await this.testimoniosRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByRating(rating: number): Promise<Testimonio[]> {
    return await this.testimoniosRepository.find({
      where: { rating, isVisible: 1 },  // ✅ Cambio: true → 1
      order: { createdAt: 'DESC' },
    });
  }

  async deleteOwn(id: number, userEmail: string): Promise<void> {
    const testimonio = await this.testimoniosRepository.findOne({ where: { id } });
    if (!testimonio) throw new NotFoundException('Testimonio no encontrado');
    if (testimonio.userEmail !== userEmail) throw new ForbiddenException('No tienes permiso');
    await this.testimoniosRepository.remove(testimonio);
  }

  async deleteByAdmin(id: number): Promise<void> {
    const testimonio = await this.testimoniosRepository.findOne({ where: { id } });
    if (!testimonio) throw new NotFoundException('Testimonio no encontrado');
    await this.testimoniosRepository.remove(testimonio);
  }

  async toggleVisibility(id: number): Promise<Testimonio> {
    const testimonio = await this.testimoniosRepository.findOne({ where: { id } });
    if (!testimonio) throw new NotFoundException('Testimonio no encontrado');
    testimonio.isVisible = testimonio.isVisible === 1 ? 0 : 1;  // ✅ Cambio: toggle entre 1 y 0
    return await this.testimoniosRepository.save(testimonio);
  }

  async getStats() {
    const total = await this.testimoniosRepository.count();
    const visible = await this.testimoniosRepository.count({ where: { isVisible: 1 } });  // ✅ Cambio: true → 1
    const byRating = await Promise.all([1,2,3,4,5].map(r => this.testimoniosRepository.count({ where: { rating: r } })));
    return { 
      total, 
      visible, 
      hidden: total - visible, 
      byRating: { 
        1: byRating[0], 
        2: byRating[1], 
        3: byRating[2], 
        4: byRating[3], 
        5: byRating[4] 
      } 
    };
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecursoEducativo } from './recurso-educativo.entity';
import { CreateRecursoEducativoDto, UpdateRecursoEducativoDto } from './dto/recursos-educativos.dto';

@Injectable()
export class RecursosEducativosService {
  constructor(
    @InjectRepository(RecursoEducativo)
    private recursosRepository: Repository<RecursoEducativo>,
  ) {}

  async create(createDto: CreateRecursoEducativoDto): Promise<RecursoEducativo> {
    const recurso = this.recursosRepository.create(createDto);
    return await this.recursosRepository.save(recurso);
  }

  async findAll(): Promise<RecursoEducativo[]> {
    return await this.recursosRepository.find({
      order: { orden: 'ASC', createdAt: 'DESC' },
    });
  }

  async findPublic(filters?: {
    categoria?: string;
    tipoFuego?: string;
    tipoExtintor?: string;
    capacidad?: string;
    aplicacion?: string;
    search?: string;
  }): Promise<RecursoEducativo[]> {
    const query = this.recursosRepository
      .createQueryBuilder('recurso')
      .where('recurso.estado = :estado', { estado: 'activo' });

    if (filters?.categoria) {
      query.andWhere('recurso.categoria = :categoria', { categoria: filters.categoria });
    }

    if (filters?.tipoFuego) {
      query.andWhere('(recurso.tipoFuego = :tipoFuego OR recurso.tipoFuego LIKE :multipleFuego)', {
        tipoFuego: filters.tipoFuego,
        multipleFuego: `%${filters.tipoFuego}%`,
      });
    }

    if (filters?.tipoExtintor) {
      query.andWhere('recurso.tipoExtintor = :tipoExtintor', { tipoExtintor: filters.tipoExtintor });
    }

    if (filters?.capacidad) {
      query.andWhere('recurso.capacidad = :capacidad', { capacidad: filters.capacidad });
    }

    if (filters?.aplicacion) {
      query.andWhere('recurso.aplicacion = :aplicacion', { aplicacion: filters.aplicacion });
    }

    if (filters?.search) {
      query.andWhere(
        '(recurso.titulo LIKE :search OR recurso.descripcion LIKE :search OR recurso.contenidoDetallado LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    return await query.orderBy('recurso.orden', 'ASC').addOrderBy('recurso.createdAt', 'DESC').getMany();
  }

  async findOne(id: number): Promise<RecursoEducativo> {
    const recurso = await this.recursosRepository.findOne({ where: { id } });
    if (!recurso) {
      throw new NotFoundException(`Recurso educativo #${id} no encontrado`);
    }
    return recurso;
  }

  async update(id: number, updateDto: UpdateRecursoEducativoDto): Promise<RecursoEducativo> {
    const recurso = await this.findOne(id);
    Object.assign(recurso, updateDto);
    return await this.recursosRepository.save(recurso);
  }

  async remove(id: number): Promise<{ message: string; id: number }> {
  const recurso = await this.findOne(id);
  await this.recursosRepository.remove(recurso);
  return { message: 'Recurso eliminado correctamente', id };
  }

  async getAvailableFilters() {
    const recursos = await this.recursosRepository.find({ where: { estado: 'activo' } });

    const categorias = [...new Set(recursos.map(r => r.categoria).filter(Boolean))];
    const tiposFuego = [...new Set(recursos.map(r => r.tipoFuego).filter(Boolean))];
    const tiposExtintor = [...new Set(recursos.map(r => r.tipoExtintor).filter(Boolean))];
    const capacidades = [...new Set(recursos.map(r => r.capacidad).filter(Boolean))];
    const aplicaciones = [...new Set(recursos.map(r => r.aplicacion).filter(Boolean))];

    return {
      categorias,
      tiposFuego,
      tiposExtintor,
      capacidades,
      aplicaciones,
    };
  }

  async getStats() {
    const total = await this.recursosRepository.count();
    
    const porCategoria = await this.recursosRepository
      .createQueryBuilder('recurso')
      .select('recurso.categoria', 'categoria')
      .addSelect('COUNT(*)', 'count')
      .where('recurso.estado = :estado', { estado: 'activo' })
      .groupBy('recurso.categoria')
      .getRawMany();

    return {
      total,
      porCategoria,
    };
  }
}
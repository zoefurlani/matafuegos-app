import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comprobante } from './comprobantes.entity';
import { CreateComprobanteDto } from './dto/create-comprobante.dto';

@Injectable()
export class ComprobantesService {
  constructor(
    @InjectRepository(Comprobante)
    private comprobantesRepository: Repository<Comprobante>,
  ) {}

  // ===== GENERAR NÚMERO DE COMPROBANTE =====
  private async generarNumeroComprobante(): Promise<string> {
    const ultimoComprobante = await this.comprobantesRepository.find({
      order: { id: 'DESC' },
      take: 1,
    });

    let proximoNumero = 1;
    if (ultimoComprobante.length > 0 && ultimoComprobante[0].numero) {
      const numeroActual = parseInt(ultimoComprobante[0].numero.split('-')[1]);
      proximoNumero = numeroActual + 1;
    }

    return `COMP-${proximoNumero.toString().padStart(5, '0')}`;
  }

  // ===== CREAR COMPROBANTE ===== ✅ CORREGIDO
  async create(createComprobanteDto: CreateComprobanteDto): Promise<Comprobante> {
    // Generar número automático
    const numero = await this.generarNumeroComprobante();

    const comprobante = this.comprobantesRepository.create({
      ...createComprobanteDto,
      numero,
      estado: 'activo',
      // ✅ AGREGAR LAS RELACIONES:
      cliente: createComprobanteDto.clienteId 
        ? { id: createComprobanteDto.clienteId }
        : undefined,
      venta: createComprobanteDto.ventaId 
        ? { id: createComprobanteDto.ventaId }
        : undefined,
    });

    return await this.comprobantesRepository.save(comprobante);
  }

  // ===== OBTENER TODOS LOS COMPROBANTES =====
  async findAll(): Promise<Comprobante[]> {
    return await this.comprobantesRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  // ===== OBTENER POR ID =====
  async findOne(id: number): Promise<Comprobante> {
    const comprobante = await this.comprobantesRepository.findOne({
      where: { id },
    });

    if (!comprobante) {
      throw new NotFoundException(`Comprobante #${id} no encontrado`);
    }

    return comprobante;
  }

  // ===== OBTENER POR NÚMERO =====
  async findByNumero(numero: string): Promise<Comprobante> {
    const comprobante = await this.comprobantesRepository.findOne({
      where: { numero },
    });

    if (!comprobante) {
      throw new NotFoundException(`Comprobante ${numero} no encontrado`);
    }

    return comprobante;
  }

  // ===== BUSCAR POR CLIENTE =====
  async findByCliente(nombreCliente: string): Promise<Comprobante[]> {
    return await this.comprobantesRepository
      .createQueryBuilder('comprobante')
      .where('comprobante.clienteNombre LIKE :nombre', { nombre: `%${nombreCliente}%` })
      .orderBy('comprobante.createdAt', 'DESC')
      .getMany();
  }

  // ===== BUSCAR POR RANGO DE FECHAS =====
  async findByDateRange(startDate: string, endDate: string): Promise<Comprobante[]> {
    return await this.comprobantesRepository
      .createQueryBuilder('comprobante')
      .where('comprobante.fecha BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('comprobante.fecha', 'DESC')
      .getMany();
  }

  // ===== ANULAR COMPROBANTE =====
  async anular(id: number): Promise<Comprobante> {
    const comprobante = await this.findOne(id);

    if (comprobante.estado === 'anulado') {
      throw new BadRequestException('El comprobante ya está anulado');
    }

    comprobante.estado = 'anulado';
    return await this.comprobantesRepository.save(comprobante);
  }

  // ===== ELIMINAR COMPROBANTE =====
  async remove(id: number): Promise<void> {
    const comprobante = await this.findOne(id);
    await this.comprobantesRepository.remove(comprobante);
  }

  // ===== ESTADÍSTICAS =====
  async getStats() {
    const totalComprobantes = await this.comprobantesRepository.count({
      where: { estado: 'activo' },
    });

    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    const comprobantesHoy = await this.comprobantesRepository.count({
      where: {
        fecha: new Date(hoy.toISOString().split('T')[0]),
        estado: 'activo',
      },
    });

    const comprobantesMes = await this.comprobantesRepository
      .createQueryBuilder('comprobante')
      .where('comprobante.fecha >= :inicioMes', { inicioMes })
      .andWhere('comprobante.estado = :estado', { estado: 'activo' })
      .getCount();

    const totalRecaudadoMes = await this.comprobantesRepository
      .createQueryBuilder('comprobante')
      .select('SUM(comprobante.total)', 'total')
      .where('comprobante.fecha >= :inicioMes', { inicioMes })
      .andWhere('comprobante.estado = :estado', { estado: 'activo' })
      .getRawOne();

    return {
      totalComprobantes,
      comprobantesHoy,
      comprobantesMes,
      totalRecaudadoMes: parseFloat(totalRecaudadoMes?.total || 0),
    };
  }
}
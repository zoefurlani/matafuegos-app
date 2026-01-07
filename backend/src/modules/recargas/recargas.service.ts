import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Recarga } from 'src/database/entities/recarga.entity';
import { Extintor } from 'src/database/entities/extintor.entity';
import { Client } from 'src/database/entities/client.entity';
import { CreateRecargaDto } from './dto/create-recarga.dto';
import { UpdateRecargaDto } from './dto/update-recarga.dto';

@Injectable()
export class RecargasService {
  constructor(
    @InjectRepository(Recarga)
    private recargasRepository: Repository<Recarga>,
    @InjectRepository(Extintor)
    private extintoresRepository: Repository<Extintor>,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  // Crear recarga
  async create(createRecargaDto: CreateRecargaDto) {
    // Verificar que el extintor existe
    const extintor = await this.extintoresRepository.findOne({
      where: { id: createRecargaDto.extintorId },
    });

    if (!extintor) {
      throw new NotFoundException(
        `Extintor con ID ${createRecargaDto.extintorId} no encontrado`,
      );
    }

    // Verificar que el cliente existe
    const cliente = await this.clientsRepository.findOne({
      where: { id: createRecargaDto.clienteId },
    });

    if (!cliente) {
      throw new NotFoundException(
        `Cliente con ID ${createRecargaDto.clienteId} no encontrado`,
      );
    }

    // Verificar que el extintor pertenece al cliente
    if (extintor.clienteId !== createRecargaDto.clienteId) {
      throw new BadRequestException(
        'El extintor no pertenece al cliente especificado',
      );
    }

    // Crear la recarga
    const nuevaRecarga = this.recargasRepository.create(createRecargaDto);
    const recargaGuardada = await this.recargasRepository.save(nuevaRecarga);

    // Actualizar el extintor con la fecha de última recarga y vencimiento
    extintor.fechaUltimaRecarga = new Date(createRecargaDto.fechaRecarga);
    if (createRecargaDto.fechaProximaRecarga) {
      extintor.fechaVencimiento = new Date(createRecargaDto.fechaProximaRecarga);
    }
    await this.extintoresRepository.save(extintor);

    return {
      mensaje: 'Recarga registrada exitosamente',
      recarga: recargaGuardada,
    };
  }

  // Obtener todas las recargas
  async findAll() {
    const recargas = await this.recargasRepository.find({
      relations: ['extintor', 'cliente'],
      order: { fechaRecarga: 'DESC' },
    });

    return {
      total: recargas.length,
      recargas,
    };
  }

  // Obtener recargas por cliente
  async findByClient(clienteId: number) {
    const cliente = await this.clientsRepository.findOne({
      where: { id: clienteId },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${clienteId} no encontrado`);
    }

    const recargas = await this.recargasRepository.find({
      where: { clienteId },
      relations: ['extintor'],
      order: { fechaRecarga: 'DESC' },
    });

    return {
      cliente: {
        id: cliente.id,
        nombre: cliente.nombre,
      },
      total: recargas.length,
      recargas,
    };
  }

  // Obtener recargas por extintor
  async findByExtintor(extintorId: number) {
    const extintor = await this.extintoresRepository.findOne({
      where: { id: extintorId },
      relations: ['cliente'],
    });

    if (!extintor) {
      throw new NotFoundException(`Extintor con ID ${extintorId} no encontrado`);
    }

    const recargas = await this.recargasRepository.find({
      where: { extintorId },
      order: { fechaRecarga: 'DESC' },
    });

    return {
      extintor: {
        id: extintor.id,
        numeroEquipo: extintor.numeroEquipo,
        cliente: extintor.cliente.nombre,
      },
      total: recargas.length,
      recargas,
    };
  }

  // Obtener recargas por rango de fechas
  async findByDateRange(fechaDesde: string, fechaHasta: string) {
    const recargas = await this.recargasRepository.find({
      where: {
        fechaRecarga: Between(new Date(fechaDesde), new Date(fechaHasta)),
      },
      relations: ['extintor', 'cliente'],
      order: { fechaRecarga: 'DESC' },
    });

    return {
      fechaDesde,
      fechaHasta,
      total: recargas.length,
      recargas,
    };
  }

  // Obtener una recarga por ID
  async findOne(id: number) {
    const recarga = await this.recargasRepository.findOne({
      where: { id },
      relations: ['extintor', 'cliente'],
    });

    if (!recarga) {
      throw new NotFoundException(`Recarga con ID ${id} no encontrada`);
    }

    return recarga;
  }

  // Actualizar recarga
  async update(id: number, updateRecargaDto: UpdateRecargaDto) {
    const recarga = await this.findOne(id);

    // Si se actualiza el extintor, verificar que existe
    if (updateRecargaDto.extintorId) {
      const extintor = await this.extintoresRepository.findOne({
        where: { id: updateRecargaDto.extintorId },
      });

      if (!extintor) {
        throw new NotFoundException(
          `Extintor con ID ${updateRecargaDto.extintorId} no encontrado`,
        );
      }
    }

    // Si se actualiza el cliente, verificar que existe
    if (updateRecargaDto.clienteId) {
      const cliente = await this.clientsRepository.findOne({
        where: { id: updateRecargaDto.clienteId },
      });

      if (!cliente) {
        throw new NotFoundException(
          `Cliente con ID ${updateRecargaDto.clienteId} no encontrado`,
        );
      }
    }

    Object.assign(recarga, updateRecargaDto);
    const recargaActualizada = await this.recargasRepository.save(recarga);

    return {
      mensaje: 'Recarga actualizada exitosamente',
      recarga: recargaActualizada,
    };
  }

  // Eliminar recarga
  async remove(id: number) {
    const recarga = await this.findOne(id);
    await this.recargasRepository.remove(recarga);

    return {
      mensaje: 'Recarga eliminada exitosamente',
      id,
    };
  }

  // Obtener estadísticas de recargas
  async getStats() {
    const totalRecargas = await this.recargasRepository.count();
    
    const recargasCompletadas = await this.recargasRepository.count({
      where: { estado: 'completada' },
    });

    const recargasPendientes = await this.recargasRepository.count({
      where: { estado: 'pendiente' },
    });

    // Calcular ingreso total
    const recargas = await this.recargasRepository.find({
      where: { estado: 'completada' },
    });

    const ingresoTotal = recargas.reduce(
      (sum, recarga) => sum + Number(recarga.precioTotal),
      0,
    );

    return {
      totalRecargas,
      recargasCompletadas,
      recargasPendientes,
      ingresoTotal: ingresoTotal.toFixed(2),
    };
  }
}

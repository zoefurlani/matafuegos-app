import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Extintor } from 'src/database/entities/extintor.entity';
import { Client } from 'src/database/entities/client.entity';
import { CreateExtintorDto } from './dto/create-extintor.dto';
import { UpdateExtintorDto } from './dto/update-extintor.dto';

@Injectable()
export class ExtintoresService {
  constructor(
    @InjectRepository(Extintor)
    private extintoresRepository: Repository<Extintor>,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  // Crear extintor
  async create(createExtintorDto: CreateExtintorDto) {
    // Verificar que el cliente existe
    const cliente = await this.clientsRepository.findOne({
      where: { id: createExtintorDto.clienteId },
    });

    if (!cliente) {
      throw new NotFoundException(
        `Cliente con ID ${createExtintorDto.clienteId} no encontrado`,
      );
    }

    // Verificar que el número de equipo no exista
    const extintorExistente = await this.extintoresRepository.findOne({
      where: { numeroEquipo: createExtintorDto.numeroEquipo },
    });

    if (extintorExistente) {
      throw new ConflictException(
        'Ya existe un extintor con ese número de equipo',
      );
    }

    const nuevoExtintor = this.extintoresRepository.create(createExtintorDto);
    const extintorGuardado = await this.extintoresRepository.save(nuevoExtintor);

    return {
      mensaje: 'Extintor creado exitosamente',
      extintor: extintorGuardado,
    };
  }

  // Obtener todos los extintores
  async findAll() {
    const extintores = await this.extintoresRepository.find({
      relations: ['cliente'],
      order: { createdAt: 'DESC' },
    });

    return {
      total: extintores.length,
      extintores,
    };
  }

  // Obtener extintores por cliente
  async findByClient(clienteId: number) {
    const cliente = await this.clientsRepository.findOne({
      where: { id: clienteId },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${clienteId} no encontrado`);
    }

    const extintores = await this.extintoresRepository.find({
      where: { clienteId },
      order: { numeroEquipo: 'ASC' },
    });

    return {
      cliente: {
        id: cliente.id,
        nombre: cliente.nombre,
      },
      total: extintores.length,
      extintores,
    };
  }

  // Obtener un extintor por ID
  async findOne(id: number) {
    const extintor = await this.extintoresRepository.findOne({
      where: { id },
      relations: ['cliente'],
    });

    if (!extintor) {
      throw new NotFoundException(`Extintor con ID ${id} no encontrado`);
    }

    return extintor;
  }

  // Buscar por número de equipo
  async findByNumeroEquipo(numeroEquipo: string) {
    const extintor = await this.extintoresRepository.findOne({
      where: { numeroEquipo },
      relations: ['cliente'],
    });

    if (!extintor) {
      throw new NotFoundException(
        `Extintor con número de equipo ${numeroEquipo} no encontrado`,
      );
    }

    return extintor;
  }

  // Obtener extintores vencidos o por vencer
  async findExpiringSoon(dias: number = 30) {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + dias);

    const extintores = await this.extintoresRepository
      .createQueryBuilder('extintor')
      .leftJoinAndSelect('extintor.cliente', 'cliente')
      .where('extintor.fechaVencimiento <= :fechaLimite', { fechaLimite })
      .andWhere('extintor.fechaVencimiento >= :hoy', { hoy: new Date() })
      .orderBy('extintor.fechaVencimiento', 'ASC')
      .getMany();

    return {
      total: extintores.length,
      diasConsultados: dias,
      extintores,
    };
  }

  // Actualizar extintor
  async update(id: number, updateExtintorDto: UpdateExtintorDto) {
    const extintor = await this.findOne(id);

    // Si se actualiza el número de equipo, verificar que no exista
    if (
      updateExtintorDto.numeroEquipo &&
      updateExtintorDto.numeroEquipo !== extintor.numeroEquipo
    ) {
      const extintorConNumero = await this.extintoresRepository.findOne({
        where: { numeroEquipo: updateExtintorDto.numeroEquipo },
      });

      if (extintorConNumero) {
        throw new ConflictException(
          'Ya existe un extintor con ese número de equipo',
        );
      }
    }

    // Si se actualiza el cliente, verificar que existe
    if (updateExtintorDto.clienteId) {
      const cliente = await this.clientsRepository.findOne({
        where: { id: updateExtintorDto.clienteId },
      });

      if (!cliente) {
        throw new NotFoundException(
          `Cliente con ID ${updateExtintorDto.clienteId} no encontrado`,
        );
      }
    }

    Object.assign(extintor, updateExtintorDto);
    const extintorActualizado = await this.extintoresRepository.save(extintor);

    return {
      mensaje: 'Extintor actualizado exitosamente',
      extintor: extintorActualizado,
    };
  }

  // Eliminar extintor
  async remove(id: number) {
    const extintor = await this.findOne(id);
    await this.extintoresRepository.remove(extintor);

    return {
      mensaje: 'Extintor eliminado exitosamente',
      id,
    };
  }
}
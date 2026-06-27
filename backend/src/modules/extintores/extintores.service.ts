import { Injectable, NotFoundException } from '@nestjs/common';
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

  // p crear extintor
  async create(createExtintorDto: CreateExtintorDto) {
    // verificar que existe
    const cliente = await this.clientsRepository.findOne({
      where: { id: createExtintorDto.clienteId },
    });

    if (!cliente) {
      throw new NotFoundException(
        `Cliente con ID ${createExtintorDto.clienteId} no encontrado`,
      );
    }

    const nuevoExtintor = this.extintoresRepository.create(createExtintorDto);
    const extintorGuardado = await this.extintoresRepository.save(nuevoExtintor);

    return {
      mensaje: 'Extintor creado exitosamente',
      extintor: extintorGuardado,
    };
  }

  // obtener todos los extintores
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

  // extintores por cliente
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

  // extintor por ID
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

  // por número de equipo
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

  // para extintores vencidos o por vencer
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

  async update(id: number, updateExtintorDto: UpdateExtintorDto) {
    const extintor = await this.findOne(id);

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

  // eliminar extintor
  async remove(id: number) {
    const extintor = await this.findOne(id);
    await this.extintoresRepository.remove(extintor);

    return {
      mensaje: 'Extintor eliminado exitosamente',
      id,
    };
  }
}
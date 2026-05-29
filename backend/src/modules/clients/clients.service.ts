import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from 'src/database/entities/client.entity';
import { Extintor } from 'src/database/entities/extintor.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    @InjectRepository(Extintor)
    private extintoresRepository: Repository<Extintor>,
  ) {}

  async create(createClientDto: CreateClientDto) {
    if (createClientDto.cuit) {
      const clienteExistente = await this.clientsRepository.findOne({
        where: { cuit: createClientDto.cuit },
      });

      if (clienteExistente) {
        throw new ConflictException('Ya existe un cliente con ese CUIT');
      }
    }

    const nuevoCliente = this.clientsRepository.create(createClientDto);
    const clienteGuardado = await this.clientsRepository.save(nuevoCliente);

    return {
      mensaje: 'Cliente creado exitosamente',
      cliente: clienteGuardado,
    };
  }

  async findAll() {
    const clientes = await this.clientsRepository.find({
      order: { createdAt: 'DESC' },
    });

    return {
      total: clientes.length,
      clientes,
    };
  }

  //para obtener todos los clientes por su numero de equipo
  async findAllWithEquipos() {
    const clientes = await this.clientsRepository.find({
      order: { createdAt: 'DESC' },
    });

    // para obtener el numero de equipo de cada cliente
    const clientesConEquipos = await Promise.all(
      clientes.map(async (cliente) => {
        const extintores = await this.extintoresRepository.find({
          where: { clienteId: cliente.id },
          select: ['numeroEquipo'],
          order: { numeroEquipo: 'ASC' },
        });

        return {
          ...cliente,
          numerosEquipo: extintores.map((ext) => ext.numeroEquipo),
        };
      }),
    );

    return {
      total: clientesConEquipos.length,
      clientes: clientesConEquipos,
    };
  }

  // para obtener un cliente por id
  async findOne(id: number) {
    const cliente = await this.clientsRepository.findOne({ where: { id } });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return cliente;
  }

  // para buscar clientes por nombre
  async searchByName(nombre: string) {
    const clientes = await this.clientsRepository
      .createQueryBuilder('cliente')
      .where('cliente.nombre LIKE :nombre', { nombre: `%${nombre}%` })
      .getMany();

    return {
      total: clientes.length,
      clientes,
    };
  }

  // p actualizar cliente
  async update(id: number, updateClientDto: UpdateClientDto) {
    const cliente = await this.findOne(id);

    // por si se esta actualizando el cuit, verificar que no exista otro con ese cuit
    if (updateClientDto.cuit && updateClientDto.cuit !== cliente.cuit) {
      const clienteConCuit = await this.clientsRepository.findOne({
        where: { cuit: updateClientDto.cuit },
      });

      if (clienteConCuit) {
        throw new ConflictException('Ya existe un cliente con ese CUIT');
      }
    }

    Object.assign(cliente, updateClientDto);
    const clienteActualizado = await this.clientsRepository.save(cliente);

    return {
      mensaje: 'Cliente actualizado exitosamente',
      cliente: clienteActualizado,
    };
  }

  // para eliminar cliente
  async remove(id: number) {
    const cliente = await this.findOne(id);
    await this.clientsRepository.remove(cliente);

    return {
      mensaje: 'Cliente eliminado exitosamente',
      id,
    };
  }
}
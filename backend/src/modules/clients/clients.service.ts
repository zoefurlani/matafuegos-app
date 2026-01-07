import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from 'src/database/entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  // Crear nuevo cliente
  async create(createClientDto: CreateClientDto) {
    // Verificar si ya existe un cliente con el mismo CUIT (si se proporciona)
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

  // Obtener todos los clientes
  async findAll() {
    const clientes = await this.clientsRepository.find({
      order: { createdAt: 'DESC' },
    });

    return {
      total: clientes.length,
      clientes,
    };
  }

  // Obtener un cliente por ID
  async findOne(id: number) {
    const cliente = await this.clientsRepository.findOne({ where: { id } });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return cliente;
  }

  // Buscar clientes por nombre
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

  // Actualizar cliente
  async update(id: number, updateClientDto: UpdateClientDto) {
    const cliente = await this.findOne(id);

    // Si se está actualizando el CUIT, verificar que no exista otro cliente con ese CUIT
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

  // Eliminar cliente
  async remove(id: number) {
    const cliente = await this.findOne(id);
    await this.clientsRepository.remove(cliente);

    return {
      mensaje: 'Cliente eliminado exitosamente',
      id,
    };
  }
}
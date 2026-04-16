import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { Producto } from '../../database/entities/producto.entity';
import { Extintor } from '../../database/entities/extintor.entity';
import { Client } from '../../database/entities/client.entity';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventasRepository: Repository<Venta>,

    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,

    @InjectRepository(Extintor)
    private extintoresRepository: Repository<Extintor>,

    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  // ⭐ Crear venta
  async create(createVentaDto: CreateVentaDto, vendedorId: number) {
    const { clienteId, productoId, cantidad, precioUnitario, numeroEquipo, observaciones } = createVentaDto;

    // Verificar que el cliente existe
    const cliente = await this.clientsRepository.findOne({ where: { id: clienteId } });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${clienteId} no encontrado`);
    }

    // Verificar que el producto existe
    const producto = await this.productosRepository.findOne({ where: { id: productoId } });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${productoId} no encontrado`);
    }

    // Verificar stock disponible
    if (producto.stockActual < cantidad) {
      throw new BadRequestException(
        `Stock insuficiente. Disponible: ${producto.stockActual}, Solicitado: ${cantidad}`,
      );
    }

    // Verificar que el número de equipo no exista ya
    const extintorExistente = await this.extintoresRepository.findOne({
      where: { numeroEquipo },
    });
    if (extintorExistente) {
      throw new BadRequestException(
        `El número de equipo "${numeroEquipo}" ya existe en el sistema`,
      );
    }

    // Calcular precio total
    const precioTotal = precioUnitario * cantidad;

    // Crear venta
    const venta = this.ventasRepository.create({
      clienteId,
      productoId,
      cantidad,
      precioUnitario,
      precioTotal,
      numeroEquipo,
      observaciones,
      vendedorId,
    });

    const ventaGuardada = await this.ventasRepository.save(venta);

    // ⭐ Descontar stock del producto
    producto.stockActual -= cantidad;
    await this.productosRepository.save(producto);

    // ⭐ Crear extintor en el sistema del cliente
    const nuevoExtintor = this.extintoresRepository.create({
      numeroEquipo,
      tipo: this.extraerTipoDeProducto(producto.nombre), // ABC, HCFC, etc.
      capacidad: this.extraerCapacidadDeProducto(producto.nombre), // 1, 2.5, 5, 10
      marca: 'ZD Matafuegos', // Marca por defecto
      estado: 'activo',
      clienteId,
      fechaUltimaRecarga: new Date(), // Fecha de venta como primera recarga
      fechaVencimiento: this.calcularVencimiento(new Date()), // 1 año desde hoy
    });

    await this.extintoresRepository.save(nuevoExtintor);

    return {
      venta: ventaGuardada,
      mensaje: 'Venta registrada correctamente',
      extintorCreado: nuevoExtintor.numeroEquipo,
    };
  }

  // ⭐ Obtener todas las ventas
  async findAll() {
    return await this.ventasRepository.find({
      relations: ['cliente', 'producto', 'vendedor'],
      order: { createdAt: 'DESC' },
    });
  }

  // ⭐ Obtener venta por ID
  async findOne(id: number) {
    const venta = await this.ventasRepository.findOne({
      where: { id },
      relations: ['cliente', 'producto', 'vendedor'],
    });

    if (!venta) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }

    return venta;
  }

  // ⭐ Obtener ventas por cliente
  async findByCliente(clienteId: number) {
    return await this.ventasRepository.find({
      where: { clienteId },
      relations: ['producto', 'vendedor'],
      order: { createdAt: 'DESC' },
    });
  }

  // ⭐ Obtener ventas por rango de fechas
  async findByDateRange(startDate: string, endDate: string) {
    return await this.ventasRepository
      .createQueryBuilder('venta')
      .leftJoinAndSelect('venta.cliente', 'cliente')
      .leftJoinAndSelect('venta.producto', 'producto')
      .leftJoinAndSelect('venta.vendedor', 'vendedor')
      .where('venta.createdAt >= :startDate', { startDate })
      .andWhere('venta.createdAt <= :endDate', { endDate })
      .orderBy('venta.createdAt', 'DESC')
      .getMany();
  }

  // ⭐ Estadísticas de ventas
  async getStats() {
    const totalVentas = await this.ventasRepository.count();
    
    const ventasHoy = await this.ventasRepository
      .createQueryBuilder('venta')
      .where('DATE(venta.createdAt) = CURDATE()')
      .getCount();

    const ventasMes = await this.ventasRepository
      .createQueryBuilder('venta')
      .where('MONTH(venta.createdAt) = MONTH(CURDATE())')
      .andWhere('YEAR(venta.createdAt) = YEAR(CURDATE())')
      .getCount();

    const totalRecaudado = await this.ventasRepository
      .createQueryBuilder('venta')
      .select('SUM(venta.precioTotal)', 'total')
      .getRawOne();

    const totalRecaudadoMes = await this.ventasRepository
      .createQueryBuilder('venta')
      .select('SUM(venta.precioTotal)', 'total')
      .where('MONTH(venta.createdAt) = MONTH(CURDATE())')
      .andWhere('YEAR(venta.createdAt) = YEAR(CURDATE())')
      .getRawOne();

    return {
      totalVentas,
      ventasHoy,
      ventasMes,
      totalRecaudado: parseFloat(totalRecaudado?.total || 0),
      totalRecaudadoMes: parseFloat(totalRecaudadoMes?.total || 0),
    };
  }

  // ⭐ Actualizar venta (solo observaciones y precio)
  async update(id: number, updateVentaDto: UpdateVentaDto) {
    const venta = await this.findOne(id);

    // Solo permitir actualizar observaciones y precios
    if (updateVentaDto.observaciones !== undefined) {
      venta.observaciones = updateVentaDto.observaciones;
    }

    if (updateVentaDto.precioUnitario !== undefined) {
      venta.precioUnitario = updateVentaDto.precioUnitario;
      venta.precioTotal = venta.precioUnitario * venta.cantidad;
    }

    await this.ventasRepository.save(venta);

    return {
      mensaje: 'Venta actualizada correctamente',
      venta,
    };
  }

  // ⭐ Eliminar venta (solo si no pasó mucho tiempo)
  async remove(id: number) {
    const venta = await this.findOne(id);

    // Verificar que la venta sea reciente (menos de 24 horas)
    const horasDiferencia = 
      (new Date().getTime() - new Date(venta.createdAt).getTime()) / (1000 * 60 * 60);

    if (horasDiferencia > 24) {
      throw new BadRequestException(
        'No se puede eliminar una venta después de 24 horas de registrada',
      );
    }

    // Devolver stock al inventario
    const producto = await this.productosRepository.findOne({
      where: { id: venta.productoId },
    });

    if (producto) {
      producto.stockActual += venta.cantidad;
      await this.productosRepository.save(producto);
    }

    // Eliminar extintor creado
    await this.extintoresRepository.delete({ numeroEquipo: venta.numeroEquipo });

    // Eliminar venta
    await this.ventasRepository.remove(venta);

    return {
      mensaje: 'Venta eliminada correctamente. Stock restaurado.',
    };
  }

  // ═══════════════════════════════════════════════════════
  // FUNCIONES AUXILIARES
  // ═══════════════════════════════════════════════════════

  private extraerTipoDeProducto(nombreProducto: string): string {
    const nombreUpper = nombreProducto.toUpperCase();
    
    if (nombreUpper.includes('ABC')) return 'ABC';
    if (nombreUpper.includes('HCFC')) return 'HCFC';
    if (nombreUpper.includes('CO2')) return 'CO2';
    if (nombreUpper.includes('BC')) return 'BC';
    if (nombreUpper.includes('K')) return 'K';
    
    return 'ABC'; // Por defecto
  }

  private extraerCapacidadDeProducto(nombreProducto: string): number {
    // Buscar números en el nombre (ej: "Extintor ABC 5kg" → 5)
    const match = nombreProducto.match(/(\d+(?:\.\d+)?)\s*kg/i);
    
    if (match) {
      return parseFloat(match[1]);
    }
    
    return 5; // Por defecto 5kg
  }

  private calcularVencimiento(fechaRecarga: Date): Date {
    const vencimiento = new Date(fechaRecarga);
    vencimiento.setFullYear(vencimiento.getFullYear() + 1);
    return vencimiento;
  }
}
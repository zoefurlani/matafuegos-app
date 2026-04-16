import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recarga } from 'src/database/entities/recarga.entity';
import { Producto } from 'src/database/entities/producto.entity';
import { CreateRecargaDto } from './dto/create-recarga.dto';
import { UpdateRecargaDto } from './dto/update-recarga.dto';

@Injectable()
export class RecargasService {
  // ⭐ Mapeo de campos de recarga a IDs de productos
  private readonly PRODUCTO_IDS = {
    polvoKg: 1,      // Polvo Químico ABC
    manometros: 2,   // Manómetro 14x35
    orings: 4,       // Oring
    vastagos: 6,     // Vástago
    valvulas: 7,     // Válvula
    mangueras: 8,    // Manguera
    boquillas: 9,    // Boquilla
    seguros: 10,     // Seguro
    etiquetas: 11    // Etiqueta
  };

  constructor(
    @InjectRepository(Recarga)
    private recargasRepository: Repository<Recarga>,
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
  ) {}

  async create(createRecargaDto: CreateRecargaDto): Promise<Recarga> {
    console.log('🔵 [CREATE] Iniciando creación de recarga...');
    console.log('📦 Datos recibidos:', createRecargaDto);
    
    // ⭐ PASO 1: Verificar stock ANTES de guardar
    await this.verificarStock(createRecargaDto);

    // ⭐ PASO 2: Si hay stock, crear la recarga
    const recarga = this.recargasRepository.create(createRecargaDto);
    const recargaGuardada = await this.recargasRepository.save(recarga);
    console.log('✅ Recarga guardada con ID:', recargaGuardada.id);

    // ⭐ PASO 3: Descontar del inventario
    console.log('🔽 Descontando inventario...');
    await this.descontarInventario(createRecargaDto);
    console.log('✅ Inventario descontado');

    return this.findOne(recargaGuardada.id);
  }

  private async verificarStock(dto: CreateRecargaDto): Promise<void> {
    console.log('🔍 Verificando stock...');
    const erroresStock: string[] = [];

    // Revisar cada repuesto
    for (const [campo, productoId] of Object.entries(this.PRODUCTO_IDS)) {
      const cantidad = dto[campo];
      
      if (cantidad && cantidad > 0) {
        console.log(`  📌 ${campo}: ${cantidad} (producto ID: ${productoId})`);
        
        // Buscar el producto
        const producto = await this.productosRepository.findOne({ where: { id: productoId } });
        
        if (!producto) {
          console.log(`  ❌ Producto ID ${productoId} NO ENCONTRADO`);
          erroresStock.push(`Producto no encontrado (ID: ${productoId})`);
          continue;
        }

        console.log(`  ✅ Producto encontrado: ${producto.nombre} (Stock: ${producto.stockActual})`);

        // Verificar stock
        if (producto.stockActual < cantidad) {
          erroresStock.push(
            `❌ ${producto.nombre}: Stock insuficiente (Disponible: ${producto.stockActual}, Requerido: ${cantidad})`
          );
        }
      }
    }

    // Si hay errores de stock, lanzar excepción
    if (erroresStock.length > 0) {
      console.log('❌ Errores de stock encontrados:', erroresStock);
      throw new BadRequestException({
        message: 'Stock insuficiente para completar la recarga',
        errores: erroresStock
      });
    }
    
    console.log('✅ Stock verificado - OK');
  }

  private async descontarInventario(dto: CreateRecargaDto | UpdateRecargaDto): Promise<void> {
    console.log('💾 Descontando inventario...');
    
    for (const [campo, productoId] of Object.entries(this.PRODUCTO_IDS)) {
      const cantidad = dto[campo];
      
      if (cantidad && cantidad > 0) {
        console.log(`  🔽 Descontando ${campo}: ${cantidad} (producto ID: ${productoId})`);
        
        const producto = await this.productosRepository.findOne({ where: { id: productoId } });
        
        if (producto) {
          const stockAnterior = producto.stockActual;
          // Descontar del stock
          producto.stockActual = Number(producto.stockActual) - Number(cantidad);
          await this.productosRepository.save(producto);
          
          console.log(`  ✅ ${producto.nombre}: ${stockAnterior} → ${producto.stockActual}`);
        } else {
          console.log(`  ⚠️ Producto ID ${productoId} no encontrado al descontar`);
        }
      }
    }
  }

  async findAll(): Promise<Recarga[]> {
    return this.recargasRepository.find({
      relations: ['cliente', 'extintor'],
      order: { fechaRecarga: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Recarga> {
    const recarga = await this.recargasRepository.findOne({
      where: { id },
      relations: ['cliente', 'extintor']
    });

    if (!recarga) {
      throw new NotFoundException(`Recarga con ID ${id} no encontrada`);
    }

    return recarga;
  }

  async findByCliente(clienteId: number): Promise<Recarga[]> {
    return this.recargasRepository.find({
      where: { clienteId },
      relations: ['cliente', 'extintor'],
      order: { fechaRecarga: 'DESC' }
    });
  }

  async findByExtintor(extintorId: number): Promise<Recarga[]> {
    return this.recargasRepository.find({
      where: { extintorId },
      relations: ['cliente', 'extintor'],
      order: { fechaRecarga: 'DESC' }
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Recarga[]> {
    return this.recargasRepository
      .createQueryBuilder('recarga')
      .leftJoinAndSelect('recarga.cliente', 'cliente')
      .leftJoinAndSelect('recarga.extintor', 'extintor')
      .where('recarga.fechaRecarga BETWEEN :startDate AND :endDate', {
        startDate,
        endDate
      })
      .orderBy('recarga.fechaRecarga', 'DESC')
      .getMany();
  }

  async getStats(): Promise<any> {
    const recargas = await this.recargasRepository.find();
    
    const totalRecargas = recargas.length;
    const completadas = recargas.filter(r => r.estado === 'completada').length;
    const pendientes = recargas.filter(r => r.estado === 'pendiente').length;
    const ingresoTotal = recargas
      .filter(r => r.estado === 'completada')
      .reduce((sum, r) => sum + Number(r.precioTotal || 0), 0);

    return {
      totalRecargas,
      completadas,
      pendientes,
      ingresoTotal
    };
  }

  async update(id: number, updateRecargaDto: UpdateRecargaDto): Promise<Recarga> {
    const recargaExistente = await this.findOne(id);

    // ⭐ Al actualizar, primero devolvemos el stock anterior
    await this.devolverInventario(recargaExistente);

    // ⭐ Verificamos el nuevo stock
    await this.verificarStock(updateRecargaDto as any);

    // Actualizar
    await this.recargasRepository.update(id, updateRecargaDto);

    // ⭐ Descontar el nuevo inventario
    await this.descontarInventario(updateRecargaDto);

    return this.findOne(id);
  }

  private async devolverInventario(recarga: Recarga): Promise<void> {
    for (const [campo, productoId] of Object.entries(this.PRODUCTO_IDS)) {
      const cantidad = recarga[campo];
      
      if (cantidad && cantidad > 0) {
        const producto = await this.productosRepository.findOne({ where: { id: productoId } });
        
        if (producto) {
          // Devolver al stock
          producto.stockActual = Number(producto.stockActual) + Number(cantidad);
          await this.productosRepository.save(producto);
        }
      }
    }
  }

  async remove(id: number): Promise<void> {
    const recarga = await this.findOne(id);
    
    // ⭐ Al eliminar, devolver el stock
    await this.devolverInventario(recarga);
    
    await this.recargasRepository.delete(id);
  }
}
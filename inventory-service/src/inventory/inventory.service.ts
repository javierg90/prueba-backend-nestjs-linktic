import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Inventory } from './inventory.model';
import { firstValueFrom } from 'rxjs';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class InventoryService {
    constructor(
        @InjectModel(Inventory)
        private readonly inventoryModel: typeof Inventory,
        private readonly httpService: HttpService, // para comunicación con productos
    ) { }

    async create(dto: CreateInventoryDto): Promise<Inventory> {
        return this.inventoryModel.create(dto);
    }

    async findByProductId(producto_id: number): Promise<Inventory> {
        const inventory = await this.inventoryModel.findOne({ where: { producto_id } });
        if (!inventory) throw new NotFoundException('Inventario no encontrado');
        return inventory;
    }

    async updateCantidad(producto_id: number, cantidad: number): Promise<Inventory> {
        const inventory = await this.findByProductId(producto_id);
        inventory.cantidad = cantidad;
        await inventory.save();
        // Emitir evento simple
        console.log(`Inventario actualizado para producto ${producto_id}: ${cantidad}`);
        return inventory;
    }

    // Llamar al microservicio de productos (con API Key, manejo de error y reintentos)
    async getProductInfo(producto_id: number): Promise<any> {
        const apiKey = process.env.PRODUCTS_API_KEY;
        const url = `${process.env.PRODUCTS_URL}/products/${producto_id}`;
        try {
            const response = await firstValueFrom(
                this.httpService.get(url, {
                    headers: { 'x-api-key': apiKey },
                    timeout: 2000, // timeout en ms
                }),
            );
            return response.data;
        } catch (error) {
            // Manejo de reintentos y errores personalizados
            throw new NotFoundException('No se pudo obtener información del producto');
        }
    }
}

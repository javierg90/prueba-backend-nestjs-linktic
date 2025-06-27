import {
    Controller, Get, Post, Patch, Param, Body, Query, UseInterceptors, ParseIntPipe,
    BadRequestException,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { JsonApiInterceptor } from '../common/interceptors/json-api.interceptor';

@Controller('inventories')
@UseInterceptors(JsonApiInterceptor)
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Post()
    create(@Body() dto: CreateInventoryDto) {
        return this.inventoryService.create(dto);
    }

    // Consulta la cantidad disponible de un producto específico por su ID
    @Get(':producto_id')
    async getByProductId(@Param('producto_id', ParseIntPipe) producto_id: number) {
        // Opcional: también llamar a getProductInfo para traer datos del producto
        const inventory = await this.inventoryService.findByProductId(producto_id);
        return inventory;
    }

    // Actualiza la cantidad disponible tras una compra
    @Patch(':producto_id')
    async updateCantidad(
        @Param('producto_id', ParseIntPipe) producto_id: number,
        @Body() dto: UpdateInventoryDto,
    ) {
        if (dto.cantidad === undefined || dto.cantidad === null) {
            throw new BadRequestException('El campo cantidad es obligatorio.');
        }
        return this.inventoryService.updateCantidad(producto_id, dto.cantidad);
    }
}

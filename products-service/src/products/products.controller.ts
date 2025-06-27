import {
    Controller, Get, Post, Patch, Delete, Param, Body, Query, UseInterceptors, ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JsonApiInterceptor } from '../common/interceptors/json-api.interceptor';

@Controller('products')
@UseInterceptors(JsonApiInterceptor) // Para adaptar la salida al estándar JSON API
export class ProductsController {
    constructor(private readonly productService: ProductsService) { }

    @Post()
    create(@Body() dto: CreateProductDto) {
        return this.productService.create(dto);
    }

    @Get()
    findAll(
        @Query('limit') limit = 10,
        @Query('offset') offset = 0,
    ) {
        return this.productService.findAll(Number(limit), Number(offset));
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
        return this.productService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.productService.remove(id);
    }
}

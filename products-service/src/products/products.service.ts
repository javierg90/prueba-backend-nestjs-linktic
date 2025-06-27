import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product)
        private readonly productModel: typeof Product,
    ) { }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        return this.productModel.create(createProductDto);
    }

    async findAll(limit = 10, offset = 0): Promise<{ rows: Product[]; count: number }> {
        return this.productModel.findAndCountAll({ limit, offset });
    }

    async findOne(id: number): Promise<Product> {
        const product = await this.productModel.findByPk(id);
        if (!product) throw new NotFoundException('Producto no encontrado');
        return product;
    }

    async update(id: number, updateDto: UpdateProductDto): Promise<Product> {
        const product = await this.findOne(id);
        return product.update(updateDto);
    }

    async remove(id: number): Promise<void> {
        const product = await this.findOne(id);
        await product.destroy();
    }
}

import { Table, Column, Model, DataType } from 'sequelize-typescript';

interface ProductCreationAttrs {
    nombre: string;
    precio: number;
}

@Table({ tableName: 'products' })
export class Product extends Model<Product, ProductCreationAttrs> {
    @Column({ type: DataType.STRING, allowNull: false })
    nombre: string;

    @Column({ type: DataType.FLOAT, allowNull: false })
    precio: number;
}

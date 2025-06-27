import { Table, Column, Model, DataType } from 'sequelize-typescript';

interface InventoryCreationAttrs {
    producto_id: number;
    cantidad: number;
}

@Table({ tableName: 'inventories' })
export class Inventory extends Model<Inventory, InventoryCreationAttrs> {
    @Column({ type: DataType.INTEGER, allowNull: false })
    producto_id: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    cantidad: number;
}
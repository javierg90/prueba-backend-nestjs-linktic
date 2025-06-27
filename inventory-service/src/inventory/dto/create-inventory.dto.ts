import { IsInt, Min, IsNotEmpty } from 'class-validator';

export class CreateInventoryDto {
    @IsInt()
    @IsNotEmpty()
    producto_id: number;

    @IsInt()
    @Min(0)
    cantidad: number;
}
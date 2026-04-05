import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class OrderItemDTO {
  @IsNotEmpty()
  @IsString()
  productId!: string;

  @IsString()
  name!: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  quantity!: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  price!: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  orderId!: string;
  @IsNotEmpty()
  customerId!: string;
  status!: string;
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  totalAmount!: number;
  currency!: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDTO)
  items!: OrderItemDTO[];
}

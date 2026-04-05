class OrderItemDTO {
  productId!: string;

  name!: string;

  quantity!: number;

  price!: number;
}

export class CreateOrderDto {
  orderId!: string;

  customerId!: string;
  status!: string;

  totalAmount!: number;
  currency!: string;

  items!: OrderItemDTO[];
}

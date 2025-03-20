import { InputType, Field, ID, Int } from '@nestjs/graphql';

@InputType()
export class OrderItemInput {
  @Field(() => ID)
  productId: string;

  @Field(() => Int)
  quantity: number;
}

@InputType()
export class CreateOrderInput {
  @Field(() => ID)
  customerId: string;

  @Field(() => [OrderItemInput])
  products: OrderItemInput[];
}

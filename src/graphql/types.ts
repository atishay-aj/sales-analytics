import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class CustomerSpending {
  @Field(() => ID)
  customerId: string;

  @Field(() => Float)
  totalSpent: number;

  @Field(() => Float)
  averageOrderValue: number;

  @Field()
  lastOrderDate: Date;
}

@ObjectType()
export class TopProduct {
  @Field(() => ID)
  productId: string;

  @Field()
  name: string;

  @Field(() => Float)
  totalSold: number;
}

@ObjectType()
export class SalesAnalytics {
  @Field(() => Float)
  totalRevenue: number;

  @Field()
  completedOrders: number;

  @Field(() => [CategoryRevenue])
  categoryBreakdown: CategoryRevenue[];
}

@ObjectType()
export class CategoryRevenue {
  @Field()
  category: string;

  @Field(() => Float)
  revenue: number;
}

@ObjectType()
export class OrderProduct {
  @Field(() => ID)
  productId: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  priceAtPurchase: number;
}

@ObjectType()
export class CustomerOrder {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  customerId: string;

  @Field(() => [OrderProduct])
  products: OrderProduct[];

  @Field(() => Float)
  totalAmount: number;

  @Field()
  orderDate: Date;

  @Field()
  status: string;
}

@ObjectType()
export class PaginatedOrders {
  @Field(() => [CustomerOrder])
  orders: CustomerOrder[];

  @Field(() => Int)
  totalOrders: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;
}

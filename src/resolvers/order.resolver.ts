import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../schemas/order.schema';
import { Product } from '../schemas/product.schema';
import { CreateOrderInput } from '../graphql/order.input';
import { PaginatedOrders } from 'src/graphql/types';

@Resolver()
export class OrderResolver {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  @Mutation(() => String)
  async placeOrder(@Args('input') input: CreateOrderInput): Promise<string> {
    const { customerId, products } = input;

    let totalAmount = 0;
    const bulkUpdateOps: Array<{
      updateOne: {
        filter: { id: string };
        update: { $inc: { stock: number } };
      };
    }> = [];

    for (const item of products) {
      console.log(item);

      const product = await this.productModel
        .findOne({ id: item.productId })
        .lean();

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found.`);
      }
      if (product.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        );
      }

      totalAmount += product.price * item.quantity;
      bulkUpdateOps.push({
        updateOne: {
          filter: { id: product.id },
          update: { $inc: { stock: -item.quantity } },
        },
      });
      products.forEach((pro) => {
        pro['priceAtPurchase'] = product.price;
      });
    }

    const order = new this.orderModel({
      customerId,
      products,
      totalAmount,
      orderDate: new Date(),
      status: 'pending',
    });

    await order.save();
    await this.productModel.bulkWrite(bulkUpdateOps); // Update stock

    return `Order placed successfully with ID: ${order._id as string}`;
  }

  @Query(() => PaginatedOrders)
  async getCustomerOrders(
    @Args('customerId') customerId: string,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<PaginatedOrders> {
    const skip = (page - 1) * limit;

    // Get total number of orders for pagination
    const totalOrders = await this.orderModel.countDocuments({ customerId });

    // Get paginated orders
    const orders: any = await this.orderModel
      .find({ customerId })
      .sort({ orderDate: -1 }) // Sort by latest orders
      .skip(skip)
      .limit(limit)
      .lean(); // Use .lean() for performance

    return {
      orders,
      totalOrders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
    };
  }
}

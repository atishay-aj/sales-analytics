import { Resolver, Query, Args } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomerSpending, TopProduct, SalesAnalytics } from '../graphql/types';
import { Order } from '../schemas/order.schema';
import { Product } from '../schemas/product.schema';

@Resolver()
export class AnalyticsResolver {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  @Query(() => CustomerSpending)
  async getCustomerSpending(@Args('customerId') customerId: string) {
    const result = await this.orderModel.aggregate<[CustomerSpending]>([
      { $match: { customerId } },
      {
        $group: {
          _id: '$customerId',
          customerId: { $first: '$customerId' },
          totalSpent: { $sum: '$totalAmount' },
          lastOrderDate: { $max: '$orderDate' },
          averageOrderValue: { $avg: '$totalAmount' },
        },
      },
    ]);
    console.log(result);
    return result[0] || null;
  }

  @Query(() => [TopProduct])
  async getTopSellingProducts(@Args('limit') limit: number) {
    return this.orderModel.aggregate([
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.productId',
          totalSold: { $sum: '$products.quantity' },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          productId: '$product.id',
          name: '$product.name',
          totalSold: 1,
        },
      },
    ]);
  }

  @Query(() => SalesAnalytics)
  async getSalesAnalytics(
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string,
  ) {
    const result = await this.orderModel.aggregate<{
      totalRevenue: number;
      completedOrders: number;
    }>([
      {
        $match: {
          orderDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
          status: 'completed',
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          completedOrders: { $sum: 1 },
        },
      },
    ]);

    const categoryBreakdown = await this.orderModel.aggregate([
      {
        $match: {
          orderDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
          status: 'completed',
        },
      },
      { $unwind: '$products' },
      {
        $lookup: {
          from: 'products',
          localField: 'products.productId',
          foreignField: 'id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          revenue: { $sum: '$products.priceAtPurchase' },
        },
      },
      {
        $project: {
          category: '$_id',
          revenue: 1,
        },
      },
    ]);

    return { ...result[0], categoryBreakdown };
  }
}

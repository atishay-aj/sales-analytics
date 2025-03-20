import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Order extends Document {
  @Prop({ index: true })
  customerId: string;

  @Prop({
    type: [{ productId: String, quantity: Number, priceAtPurchase: Number }],
  })
  products: { productId: string; quantity: number; priceAtPurchase: number }[];

  @Prop()
  totalAmount: number;

  @Prop()
  orderDate: Date;

  @Prop({ index: true })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

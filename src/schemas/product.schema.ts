import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({ index: true })
  declare id: string;

  @Prop()
  name: string;

  @Prop({ index: true })
  category: string;

  @Prop()
  price: number;

  @Prop()
  stock: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

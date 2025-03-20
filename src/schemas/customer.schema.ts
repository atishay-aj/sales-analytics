import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Customer extends Document {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  age: number;

  @Prop()
  location: string;

  @Prop()
  gender: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';

import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { Product, ProductSchema } from './schemas/product.schema';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import { AnalyticsResolver } from './resolvers/analytics.resolver';
import { OrderResolver } from './resolvers/order.resolver';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/ecommerce'),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AnalyticsResolver, OrderResolver],
})
export class AppModule {}

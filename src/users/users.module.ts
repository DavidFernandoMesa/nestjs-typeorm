import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerController } from './controllers/customers.controller';
import { CustomersService } from './services/customers.service';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { Customer } from './entities/customer.entity';
import { Order } from './entities/order.entity';
import { User } from './entities/user.entity';
import { OrderItem } from './entities/order-item.entity';

import { ProductsModule } from '../products/products.module';
import { OrdersService } from './services/orders.service';
import { OrdersController } from './controllers/orders.controller';
import { OrdersItemController } from './controllers/order-item.controller';
import { OrdersItemService } from './services/order-item.service';

@Module({
  imports: [
    ProductsModule,
    TypeOrmModule.forFeature([Customer, Order, OrderItem, User]),
  ],
  controllers: [
    CustomerController,
    UsersController,
    OrdersController,
    OrdersItemController,
  ],
  providers: [CustomersService, UsersService, OrdersService, OrdersItemService],
})
export class UsersModule {}

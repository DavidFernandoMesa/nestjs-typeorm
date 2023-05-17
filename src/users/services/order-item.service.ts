import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreateOrderItemDto,
  FilterOrdersItemDto,
  UpdateOrderItemDto,
} from './../dtos/order-item.dto';
import { Order } from './../entities/order.entity';
import { OrderItem } from './../entities/order-item.entity';
import { Product } from './../../products/entities/product.entity';

@Injectable()
export class OrdersItemService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private itemsRepo: Repository<OrderItem>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  findAll(params?: FilterOrdersItemDto) {
    if (params) {
      const { limit, offset } = params;
      return this.itemsRepo.find({
        relations: ['order', 'order.customer'],
        take: limit,
        skip: offset,
      });
    }
    return this.itemsRepo.find({
      relations: ['order', 'order.customer'],
    });
  }

  async findOne(id: number) {
    const item = await this.itemsRepo.findOne({
      where: { id },
      relations: ['order', 'product'],
    });
    if (!item) {
      throw new NotFoundException('not found');
    }
    return item;
  }

  async create(data: CreateOrderItemDto) {
    const order = await this.orderRepo.findOne({
      where: { id: data.orderId },
    });
    const product = await this.productRepo.findOne({
      where: { id: data.productId },
    });
    const item = new OrderItem();
    item.order = order;
    item.product = product;
    item.quantity = data.quantity;
    return this.itemsRepo.save(item);
  }

  async update(id: number, changes: UpdateOrderItemDto) {
    const orderItem = await this.itemsRepo.findOne({
      where: { id },
    });
    if (changes.orderId) {
      const order = await this.orderRepo.findOne({
        where: { id: changes.orderId },
      });
      orderItem.order = order;
    }
    if (changes.productId) {
      const product = await this.productRepo.findOne({
        where: { id: changes.productId },
      });
      orderItem.product = product;
    }
    if (changes.quantity) {
      orderItem.quantity = changes.quantity;
    }
    return this.itemsRepo.save(orderItem);
  }

  remove(id: number) {
    return this.itemsRepo.delete(id);
  }
}

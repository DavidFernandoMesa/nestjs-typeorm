import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import {
  CreateOrderItemDto,
  FilterOrdersItemDto,
  UpdateOrderItemDto,
} from './../dtos/order-item.dto';
import { OrdersItemService } from './../services/order-item.service';

@Controller('order-item')
export class OrdersItemController {
  constructor(private itemService: OrdersItemService) {}
  @Get('')
  findAll(@Query() params: FilterOrdersItemDto) {
    return this.itemService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.itemService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateOrderItemDto) {
    return this.itemService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateOrderItemDto,
  ) {
    return this.itemService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.itemService.remove(id);
  }
}

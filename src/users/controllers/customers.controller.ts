import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { CustomersService } from '../services/customers.service';
import {
  CreateCustomerDto,
  FilterCustomersDto,
  UpdateCustomerDto,
} from '../dtos/customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private customersService: CustomersService) {}

  @Get()
  findAll(@Query() params: FilterCustomersDto) {
    return this.customersService.findAll(params);
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateCustomerDto) {
    return this.customersService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.remove(+id);
  }
}

import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { ProductsService } from './../../products/services/products.service';
import { CustomersService } from './customers.service';
import { FilterUsersDtos } from '../dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(
    private productsService: ProductsService,
    private configService: ConfigService,
    @Inject('PG') private client: Client,
    @InjectRepository(User) private userRep: Repository<User>,
    private customersService: CustomersService,
  ) {}

  findAll(params?: FilterUsersDtos) {
    const apiKey = this.configService.get('API_KEY');
    const dbName = this.configService.get('DATABASE_NAME');
    console.log(apiKey, dbName);
    if (params) {
      const { limit, offset } = params;
      return this.userRep.find({
        relations: ['customer'],
        take: limit,
        skip: offset,
      });
    }
    return this.userRep.find({
      relations: ['customer'],
    });
  }

  async findOne(id: number) {
    const user = await this.userRep.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async create(data: CreateUserDto) {
    const newUser = this.userRep.create(data);
    if (data.customerId) {
      const costumer = await this.customersService.findOne(data.customerId);
      newUser.customer = costumer;
    }
    return this.userRep.save(newUser);
  }

  async update(id: number, changes: UpdateUserDto) {
    const user = await this.findOne(id);
    this.userRep.merge(user, changes);
    return this.userRep.save(user);
  }

  remove(id: number) {
    return this.userRep.delete(id);
  }

  async getOrderByUser(id: number) {
    const user = this.findOne(id);
    return {
      date: new Date(),
      user,
      products: await this.productsService.findAll(),
    };
  }

  getTask() {
    return new Promise((resolve, reject) => {
      this.client.query('SELECT * FROM task', (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res.rows);
      });
    });
  }
}

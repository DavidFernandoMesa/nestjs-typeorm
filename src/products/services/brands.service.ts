import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Brand } from '../entities/brand.entity';
import {
  CreateBrandDto,
  FilterBrandsDto,
  UpdateBrandDto,
} from '../dtos/brand.dtos';

@Injectable()
export class BrandsService {
  constructor(@InjectRepository(Brand) private brandsRepo: Repository<Brand>) {}

  findAll(params?: FilterBrandsDto) {
    if (params) {
      const { limit, offset } = params;
      return this.brandsRepo.find({
        take: limit,
        skip: offset,
      });
    }
    return this.brandsRepo.find();
  }

  findOne(id: number) {
    const product = this.brandsRepo.findOne({
      relations: ['products'],
    });
    if (!product) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    return product;
  }

  create(data: CreateBrandDto) {
    const newBrand = this.brandsRepo.create(data);
    return this.brandsRepo.save(newBrand);
  }

  async update(id: number, changes: UpdateBrandDto) {
    const brand = await this.findOne(id);
    this.brandsRepo.merge(brand, changes);
    return this.brandsRepo.save(brand);
  }

  remove(id: number) {
    return this.brandsRepo.delete(id);
  }
}

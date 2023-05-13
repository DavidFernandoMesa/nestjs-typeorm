import { IsNotEmpty, IsOptional, IsPositive, Min } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  readonly orderId: number;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  readonly productId: number;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  readonly quantity: number;
}

export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {}

export class FilterOrdersItemDto {
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  @Min(0)
  offset: number;
}

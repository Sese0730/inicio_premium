import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishesController } from './dishes.controller';
import { DishesService } from './dishes.service';
import { Dish } from '../entities/dish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dish])],
  controllers: [DishesController],
  providers: [DishesService],
})
export class DishesModule implements OnApplicationBootstrap {
  constructor(private readonly dishesService: DishesService) {}

  async onApplicationBootstrap() {
    await this.dishesService.seedPremiumDishes();
  }
}
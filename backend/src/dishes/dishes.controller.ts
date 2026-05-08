import { Controller, Get, UseGuards } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Get('premium')
  @UseGuards(JwtAuthGuard)
  async getPremiumDishes() {
    const dishes = await this.dishesService.getPremiumDishes();
    
    return {
      success: true,
      data: dishes,
      error: null,
    };
  }
}
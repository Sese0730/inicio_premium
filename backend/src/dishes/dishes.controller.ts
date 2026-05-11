import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Get('premium')
  @UseGuards(JwtAuthGuard)
  async getPremiumDishes(@Query('search') search: string = '') {
    const dishes = await this.dishesService.getPremiumDishes(search);
    
    return {
      success: true,
      data: dishes,
      error: null,
    };
  }
}
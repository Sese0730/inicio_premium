import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dish } from '../entities/dish.entity';

@Injectable()
export class DishesService {
  constructor(
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
  ) {}

  async getPremiumDishes(): Promise<Dish[]> {
    return this.dishRepository.find({
      where: { isPremium: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getDishById(id: number): Promise<Dish> {
    const dish = await this.dishRepository.findOne({ where: { id } });

    if (!dish) {
      throw new NotFoundException(`Platillo con ID ${id} no encontrado`);
    }

    return dish;
  }

  async seedPremiumDishes() {
    const count = await this.dishRepository.count();
    
    if (count === 0) {
      const sampleDishes = [
        { name: '🍣 Sushi Premium', description: 'Surtido de 20 piezas con salmón noruego', price: 45.99, isPremium: true },
        { name: '🥩 Wagyu A5', description: 'Carne de Kobe con reducción de vino tinto', price: 120.00, isPremium: true },
        { name: '🦞 Langosta Termidor', description: 'Langosta al horno con salsa de queso', price: 89.50, isPremium: true },
        { name: '🍝 Trufa Negra', description: 'Pasta fresca con trufa negra y parmesano', price: 55.00, isPremium: true },
        { name: '🍰 Tiramisú Clásico', description: 'Postre italiano con café y mascarpone', price: 12.00, isPremium: true },
      ];
      
      await this.dishRepository.save(sampleDishes);
      console.log('✅ Platillos premium sembrados en la base de datos');
    }
  }
}
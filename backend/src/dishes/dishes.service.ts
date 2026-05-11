import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Dish } from '../entities/dish.entity';

@Injectable()
export class DishesService {
  constructor(
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
  ) {}

  async getPremiumDishes(search: string = ''): Promise<Dish[]> {
    const queryBuilder = this.dishRepository.createQueryBuilder('dish');
    
    queryBuilder.where('dish.isPremium = :isPremium', { isPremium: true });
    
    // ✅ Búsqueda por nombre (parcial, case insensitive)
    if (search && search.trim() !== '') {
      queryBuilder.andWhere('dish.name LIKE :search', { search: `%${search}%` });
    }
    
    return queryBuilder
      .orderBy('dish.id', 'ASC')
      .getMany();
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
        {
          name: '🍣 Sushi Premium Omakase',
          description: 'Selección del chef: 24 piezas de sashimi, nigiri y rollos',
          price: 89.99,
          isPremium: true,
          imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400'
        },
        {
          name: '🥩 Wagyu A5 Kobe',
          description: 'Carne de Kobe grado A5 con reducción de vino tinto',
          price: 149.99,
          isPremium: true,
          imageUrl: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=400'
        },
        {
          name: '🦞 Langosta Termidor',
          description: 'Langosta al horno con salsa de queso gratinado',
          price: 95.00,
          isPremium: true,
          imageUrl: 'https://images.unsplash.com/photo-1555431189-0b04d92f1bea?w=400'
        },
        {
          name: '🍝 Trufa Negra y Porcini',
          description: 'Pasta artesanal con trufa negra y hongos porcini',
          price: 65.00,
          isPremium: true,
          imageUrl: 'https://images.unsplash.com/photo-1551183053-bc91a1d3d2b3?w=400'
        },
        {
          name: '🐟 Salmón Noruego al Grill',
          description: 'Salmón salvaje con costra de hierbas y puré trufado',
          price: 55.00,
          isPremium: true,
          imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400'
        },
        {
          name: '🥘 Paella de Mariscos',
          description: 'Arroz bomba con bogavante y gambas rojas',
          price: 75.00,
          isPremium: true,
          imageUrl: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400'
        },
        {
          name: '🍔 Burguer Black Angus',
          description: '200gr de carne Black Angus con queso cheddar añejo',
          price: 32.00,
          isPremium: true,
          imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
        },
        {
          name: '🥑 Bowl Power Quinoa',
          description: 'Quinoa orgánica con aguacate y semillas',
          price: 28.50,
          isPremium: true,
          imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'
        },
        {
          name: '🍰 Tiramisú Clásico',
          description: 'Postre italiano con café y mascarpone',
          price: 14.00,
          isPremium: true,
          imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400'
        },
        {
          name: '🍫 Fondant de Chocolate',
          description: 'Corazón líquido de chocolate belga 70%',
          price: 16.50,
          isPremium: true,
          imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400'
        },
        {
          name: '🦪 Ostiones Rockefeller',
          description: 'Seis ostiones gratinados con espinacas y queso',
          price: 45.00,
          isPremium: true,
          imageUrl: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=400'
        },
        {
          name: '🍷 Tabla de Quesos Premium',
          description: 'Selección de 5 quesos importados',
          price: 38.00,
          isPremium: true,
          imageUrl: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400'
        },
      ];
      
      await this.dishRepository.save(sampleDishes);
      console.log('✅ 12 platillos premium sembrados con imágenes');
    }
  }
}
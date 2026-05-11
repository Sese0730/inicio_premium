import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getAllUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string = '',
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const queryBuilder = this.userRepository.createQueryBuilder('user');
    
    // ✅ Búsqueda por email (parcial, case insensitive)
    if (search && search.trim() !== '') {
      queryBuilder.where('user.email LIKE :search', { search: `%${search}%` });
    }

    const [users, total] = await queryBuilder
      .select(['user.id', 'user.email', 'user.role', 'user.createdAt'])
      .skip(skip)
      .take(limitNumber)
      .orderBy('user.id', 'ASC')
      .getManyAndCount();

    return {
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(total / limitNumber),
        },
        search: search || null,
      },
      error: null,
    };
  }
}
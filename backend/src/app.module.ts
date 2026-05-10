import { ThrottlerModule } from '@nestjs/throttler';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { DishesModule } from './dishes/dishes.module';
import { UsersModule } from './users/users.module';
import { User } from './entities/user.entity';
import { Dish } from './entities/dish.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, Dish],
        synchronize: true,  // ← Debe ser true para crear tablas
        logging: true,      // ← Para ver las queries SQL
      }),
      inject: [ConfigService],
    }),
    
    AuthModule,
    DishesModule,
    UsersModule,
  ],
})
export class AppModule {}
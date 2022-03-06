import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../utils/jwt.strategy';
import { Optative } from './entities/optative.entity';
import { OptativeController } from './controllers/optative.controller';
import { OptativeService } from './services/optative.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Optative]),
    JwtModule.register({
      secret: 'sao-secret-key',
    }),
  ],
  exports: [OptativeService],
  providers: [JwtStrategy, OptativeService],
  controllers: [OptativeController],
})
export class OptativeModule {}

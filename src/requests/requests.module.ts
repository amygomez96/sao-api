import { Module } from '@nestjs/common';
import { RequestController } from './controllers/request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { RequestService } from './services/request.service';
import { Requests } from './entities/request.entity';
import { JwtStrategy } from '../utils/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Requests]),
    JwtModule.register({
      secret: 'sao-secret-key',
    }),
  ],
  providers: [RequestService, JwtStrategy],
  controllers: [RequestController],
})
export class RequestsModule {}

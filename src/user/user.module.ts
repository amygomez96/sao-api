import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../utils/jwt.strategy';
import { OptativeModule } from '../optative/optative.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'sao-secret-key',
    }),
    OptativeModule,
  ],
  exports: [UserService],
  providers: [JwtStrategy, UserService],
  controllers: [UserController],
})
export class UserModule {}

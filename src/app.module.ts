import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptativeModule } from './optative/optative.module';
import { RequestsModule } from './requests/requests.module';
import { Role } from './utils/role.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'aymee',
      database: 'sao',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: false,
      retryAttempts: 10,
      retryDelay: 3000,
    }),
    Role,
    UserModule,
    OptativeModule,
    RequestsModule,
  ],
})
export class AppModule {}

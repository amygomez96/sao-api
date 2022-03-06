import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserRegisterRequestDto } from '../dto/user-register.req.dto';
import { VALIDATIONS } from '../../utils/utils';
import { User } from '../entities/user.entity';
import { from, Observable } from 'rxjs';
import { UserLoginRequestDto } from '../dto/user-login.req.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAll(): Observable<any> {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('professors')
  getAllProfessors(): Observable<any> {
    return this.userService.findAllProfessors();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('students')
  getAllStudents(): Observable<any> {
    return this.userService.findAllStudents();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getOne(@Param('id') id: number): Observable<any> {
    return this.userService.findOne(id);
  }

  @Post('/login')
  @HttpCode(200)
  login(@Body() user: UserLoginRequestDto): Observable<any> {
    return from(this.userService.login(user));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/register')
  register(
    @Body(VALIDATIONS.UNPROCESSABLE_ENTITY_VALIDATION)
    body: UserRegisterRequestDto,
  ): Observable<User> {
    return this.userService.register(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: number, @Body() body: any) {
    return this.userService.update(id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }
}

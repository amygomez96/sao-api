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
import { from, Observable } from 'rxjs';
import { OptativeService } from '../services/optative.service';
import { AuthGuard } from '@nestjs/passport';
import { OptativeRequestDto } from '../dto/optative.req.dto';

@Controller('optative')
export class OptativeController {
  constructor(private optativeService: OptativeService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAll(): Observable<any> {
    return this.optativeService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getOne(@Param('id') id: number): Observable<any> {
    return this.optativeService.findOne(id);
  }

  @Post('')
  @HttpCode(200)
  create(@Body() user: OptativeRequestDto): Observable<any> {
    return this.optativeService.create(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: number, @Body() body: any): Observable<any> {
    return from(this.optativeService.update(id, body));
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id') id: number): Observable<any> {
    return from(this.optativeService.delete(id));
  }
}

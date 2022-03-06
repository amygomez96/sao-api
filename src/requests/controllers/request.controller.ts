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
import { RequestService } from '../services/request.service';
import { AuthGuard } from '@nestjs/passport';
import { from, Observable } from 'rxjs';
import { RequestRequestDto } from '../dto/request.req.dto';

@Controller('request')
export class RequestController {
  constructor(private requestService: RequestService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAll(): Observable<any> {
    return this.requestService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('mine/:id')
  getMyRequests(@Param('id') id: number): Observable<any> {
    return this.requestService.findAllMyRequest(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getOne(@Param('id') id: number): Observable<any> {
    return this.requestService.findOne(id);
  }

  @Post('')
  @HttpCode(200)
  create(@Body() requests: RequestRequestDto): Observable<any> {
    return from(this.requestService.create(requests));
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: number, @Body() body: any): Observable<any> {
    return from(this.requestService.update(id, body));
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id') id: number): Observable<any> {
    return from(this.requestService.delete(id));
  }
}

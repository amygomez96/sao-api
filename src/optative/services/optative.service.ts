import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Optative } from '../entities/optative.entity';
import { from, map, Observable } from 'rxjs';
import { OptativeRequestDto } from '../dto/optative.req.dto';

@Injectable()
export class OptativeService {
  constructor(
    @InjectRepository(Optative)
    private OptativeRepository: Repository<Optative>,
  ) {}

  findAll(): Observable<any> {
    return from(this.OptativeRepository.find({ relations: ['professor'] }));
  }

  findOne(id: number): Observable<any> {
    const optative = this.OptativeRepository.findOne(id, {
      relations: ['professor'],
    });
    if (optative) {
      return from(optative);
    } else {
      throw new HttpException(
        'No se ha encontrado la asignatura optativa',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  isProfessor(professor: number): Observable<any> {
    return from(this.OptativeRepository.findOne({ professor })).pipe(
      map((professor: Optative) => {
        return !!professor;
      }),
    );
  }

  create(optative: OptativeRequestDto): Observable<any> {
    return from(
      this.OptativeRepository.save(this.OptativeRepository.create(optative)),
    );
  }

  async update(id: number, body: any): Promise<any> {
    const optative = await this.OptativeRepository.findOne(id);
    if (optative) {
      this.OptativeRepository.merge(optative, body);
      return this.OptativeRepository.save(optative);
    } else {
      throw new HttpException(
        'No se ha encontrado la asignatura optativa',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async delete(id: number): Promise<any> {
    const optative = await this.OptativeRepository.findOne(id);
    if (optative) {
      await this.OptativeRepository.delete(id);
      return true;
    } else {
      throw new HttpException(
        'No se ha encontrado la asignatura optativa',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}

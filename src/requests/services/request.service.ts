import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Requests } from '../entities/request.entity';
import { from, Observable } from 'rxjs';
import { RequestRequestDto } from '../dto/request.req.dto';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Requests)
    private RequestsRepository: Repository<Requests>,
    private userService: UserService,
  ) {}

  findAll(): Observable<any> {
    return from(
      this.RequestsRepository.find({
        select: ['id'],
        relations: ['student', 'optative'],
      }),
    );
  }

  findAllMyRequest(id: number): Observable<any> {
    return from(
      this.RequestsRepository.find({
        select: ['id'],
        relations: ['student', 'optative'],
        where: { student: id },
      }),
    );
  }

  findOne(id: number): Observable<any> {
    const requets = this.RequestsRepository.findOne(id);
    if (requets) {
      return from(requets);
    } else {
      throw new HttpException(
        'No se ha encontrado la solicitud',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(requests: RequestRequestDto): Promise<Requests> {
    return this.ifExistsRequests(requests.student, requests.optative).then(
      (exists: boolean) => {
        console.log(exists);
        if (!exists) {
          return this.RequestsRepository.save(
            this.RequestsRepository.create(requests),
          );
        } else {
          throw new HttpException(
            'La solicitud para esta asignatura ya ha sido realizada',
            HttpStatus.CONFLICT,
          );
        }
      },
    );
  }

  async update(id: number, body: any): Promise<any> {
    const requests = await this.RequestsRepository.findOne(id);
    if (requests) {
      this.RequestsRepository.merge(requests, body);
      return this.RequestsRepository.save(requests);
    } else {
      throw new HttpException(
        'No se ha encontrado la asignatura optativa',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async delete(id: number): Promise<any> {
    const requests = await this.RequestsRepository.findOne(id);
    if (requests) {
      await this.RequestsRepository.delete(id);
      return true;
    } else {
      throw new HttpException(
        'No se ha encontrado la asignatura optativa',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  private async ifExistsRequests(
    student: number,
    optative: number,
  ): Promise<boolean> {
    return this.RequestsRepository.findOne({ student }).then(
      async (st: Requests) => {
        if (st?.id) {
          return await this.RequestsRepository.findOne({ optative }).then(
            (op: Requests) => {
              return !!op?.id;
            },
          );
        } else {
          return false;
        }
      },
    );
  }

  async assignOptative(id: number): Promise<any> {
    const requests = await this.RequestsRepository.findOne(id, {
      relations: ['student', 'optative'],
    });

    const requestsAux = JSON.parse(JSON.stringify(requests));

    if (requestsAux) {
      return this.userService
        .update(requestsAux?.student?.id, {
          optional: requestsAux?.optative?.id,
        })
        .then(
          async (data: any) => {
            await this.RequestsRepository.find({
              student: requestsAux?.student?.id,
            }).then(
              (r: Requests[]) => {
                delete data?.password;
                delete data?.deleted_at;

                for (const item of r) {
                  this.RequestsRepository.delete(item);
                }

                setTimeout(() => {
                  return data;
                }, 250);
              },
              () => {
                return data;
              },
            );
          },
          () => {
            throw new HttpException(
              'No se ha podido asignar la asignatura optativa',
              HttpStatus.NOT_FOUND,
            );
          },
        );
    } else {
      throw new HttpException(
        'No se ha encontrado la solicitud',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}

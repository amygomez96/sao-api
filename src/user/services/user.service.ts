import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserRegisterRequestDto } from '../dto/user-register.req.dto';
import { UserLoginRequestDto } from '../dto/user-login.req.dto';
import { from, map, Observable, switchMap } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OptativeService } from '../../optative/services/optative.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
    private jwtService: JwtService,
    private optativeService: OptativeService,
  ) {}

  private createJwtToken(userId: number, username: string, type: string): any {
    return this.jwtService.sign({
      id: userId,
      username: username,
      type: type,
    });
  }

  login(user: UserLoginRequestDto): Observable<any> {
    return this.findUserByUsername(user.username).pipe(
      switchMap((foundUser: User) => {
        if (foundUser) {
          return UserService.validatePassword(
            user.password,
            foundUser.password,
          ).pipe(
            map((passwordMatch: boolean) => {
              if (passwordMatch) {
                const { password, ...user } = foundUser;
                return {
                  user: user,
                  token: this.createJwtToken(
                    foundUser.id,
                    foundUser.username,
                    'authentication',
                  ),
                };
              } else {
                throw new HttpException(
                  'No se ha podido autenticar',
                  HttpStatus.UNAUTHORIZED,
                );
              }
            }),
          );
        } else {
          throw new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
        }
      }),
    );
  }

  register(user: UserRegisterRequestDto): Observable<User> {
    return this.usernameExists(user.username).pipe(
      switchMap((exists: boolean) => {
        if (!exists) {
          return this.emailExists(user.email).pipe(
            switchMap((existsEmail: boolean) => {
              if (!existsEmail) {
                return from(
                  this.UserRepository.save(this.UserRepository.create(user)),
                );
              } else {
                throw new HttpException(
                  'El correo electrónico ya existe',
                  HttpStatus.CONFLICT,
                );
              }
            }),
          );
        } else {
          throw new HttpException(
            'El nombre de usuario ya existe',
            HttpStatus.CONFLICT,
          );
        }
      }),
    );
  }

  private usernameExists(username: string): Observable<boolean> {
    return from(this.UserRepository.findOne({ username })).pipe(
      map((user: User) => {
        return !!user;
      }),
    );
  }

  private emailExists(email: string): Observable<boolean> {
    return from(this.UserRepository.findOne({ email })).pipe(
      map((user: User) => {
        return !!user;
      }),
    );
  }

  private findUserByUsername(username: string): Observable<User> {
    return from(
      this.UserRepository.findOne(
        { username },
        {
          select: [
            'id',
            'username',
            'password',
            'name',
            'last_name',
            'email',
            'phone',
          ],
          relations: ['role', 'optional'],
        },
      ),
    );
  }

  private static comparePassword(
    password: string,
    hash: string,
  ): Observable<any> {
    return from(bcrypt.compare(password, hash));
  }

  private static validatePassword(
    password: string,
    storedPassword: string,
  ): Observable<boolean> {
    return UserService.comparePassword(password, storedPassword);
  }

  findAll(): Observable<any> {
    return from(this.UserRepository.find({ relations: ['role', 'optional'] }));
  }

  findAllProfessors(): Observable<any> {
    return from(
      this.UserRepository.find({
        relations: ['role', 'optional'],
        where: { role: { id: 2 } },
      }),
    );
  }

  findAllStudents(): Observable<any> {
    return from(
      this.UserRepository.find({
        relations: ['role', 'optional'],
        where: { role: { id: 3 } },
      }),
    );
  }

  findOne(id: number): Observable<any> {
    return from(
      this.UserRepository.findOne(id, { relations: ['role', 'optional'] }),
    );
  }

  async update(id: number, body: any) {
    const user = await this.UserRepository.findOne(id);
    this.UserRepository.merge(user, body);
    return this.UserRepository.save(user);
  }

  async delete(id: number) {
    const user = await this.UserRepository.findOne(id);
    if (user) {
      return this.optativeService.isProfessor(id).pipe(
        switchMap(async (existsId: boolean) => {
          if (!existsId) {
            await this.UserRepository.delete(id);
            return true;
          } else {
            throw new HttpException(
              'No se puede eliminar el usuario pues es profesor de una optativa',
              HttpStatus.CONFLICT,
            );
          }
        }),
      );
    } else {
      throw new HttpException(
        'No se ha encontrado el usuario',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}

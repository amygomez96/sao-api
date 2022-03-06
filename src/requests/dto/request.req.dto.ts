import { IsNotEmpty } from 'class-validator';

export class RequestRequestDto {
  @IsNotEmpty()
  student: number;

  @IsNotEmpty()
  optative: number;
}

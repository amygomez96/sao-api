import { IsNotEmpty } from 'class-validator';

export class OptativeRequestDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  classroom: string;

  @IsNotEmpty()
  professor: number;
}

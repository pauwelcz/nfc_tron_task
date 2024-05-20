import { IsEmail, IsString, Length } from '@nestjs/class-validator';

export class CreateCustomerDto {
  @IsString()
  @Length(1, 50)
  firstname: string;

  @IsString()
  @Length(1, 50)
  lastname: string;

  @IsEmail()
  @Length(1, 255)
  email: string;
}

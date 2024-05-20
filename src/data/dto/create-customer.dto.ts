import { IsEmail, IsString, Length } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Paul', description: 'Customers firstname.' })
  @IsString()
  @Length(1, 50)
  firstname: string;

  @ApiProperty({ example: 'Saddler', description: 'Customers lastname.' })
  @IsString()
  @Length(1, 50)
  lastname: string;

  @ApiProperty({
    example: 'paul.saddler@email.com',
    description:
      'Customers email, should be unique for each customer stored in database.',
  })
  @IsEmail()
  @Length(1, 255)
  email: string;
}

import { Type } from 'class-transformer';
import { Column } from 'typeorm/decorator/columns/Column';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { Entity } from 'typeorm/decorator/entity/Entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column({ type: 'timestamptz' })
  @Type(() => Date)
  created_at: Date;

  @Column({ type: 'timestamptz' })
  @Type(() => Date)
  updated_at: Date;
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class SharedService {
  public getRandomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

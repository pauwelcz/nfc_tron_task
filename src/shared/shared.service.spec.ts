import { Test, TestingModule } from '@nestjs/testing';
import { SharedService } from './shared.service';

describe('SharedService', () => {
  let service: SharedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedService],
    }).compile();

    service = module.get<SharedService>(SharedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRandomIntFromInterval', () => {
    it('should generate a specific number', () => {
      const number = service.getRandomIntFromInterval(1, 1);
      expect(number).toBe(1);
    });

    it('should generate a number in specific range', () => {
      const number = service.getRandomIntFromInterval(1, 10);
      for (let i = 0; i <= 50; i++) {
        expect(number).toBeGreaterThanOrEqual(1);
        expect(number).toBeLessThanOrEqual(10);
      }
    });
  });
});

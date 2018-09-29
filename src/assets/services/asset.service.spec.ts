import { Test, TestingModule } from '@nestjs/testing';
import { AssetService } from './asset.service';

describe('AssetService', () => {
  let service: AssetService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssetService],
    }).compile();
    service = module.get<AssetService>(AssetService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AssetController } from './asset.controller';

describe('Asset Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [AssetController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: AssetController = module.get<AssetController>(
      AssetController,
    );
    expect(controller).toBeDefined();
  });
});

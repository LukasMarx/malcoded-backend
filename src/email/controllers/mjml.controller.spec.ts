import { Test, TestingModule } from '@nestjs/testing';
import { MjmlController } from './mjml.controller';

describe('Mjml Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [MjmlController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: MjmlController = module.get<MjmlController>(
      MjmlController,
    );
    expect(controller).toBeDefined();
  });
});

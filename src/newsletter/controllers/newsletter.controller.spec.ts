import { Test, TestingModule } from '@nestjs/testing';
import { NewsletterController } from './newsletter.controller';

describe('Newsletter Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [NewsletterController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: NewsletterController = module.get<NewsletterController>(NewsletterController);
    expect(controller).toBeDefined();
  });
});

import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

@Injectable()
export class ConfigService {
  constructor(filePath?: string) {
    dotenv.config();
  }

  get(key: string): string {
    return process.env[key];
  }
}

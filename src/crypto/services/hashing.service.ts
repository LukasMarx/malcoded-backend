import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashingService {
  async hash(input: string): Promise<string> {
    return await bcrypt.hash(input, 12);
  }

  async compare(input: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(input, hash);
  }
}

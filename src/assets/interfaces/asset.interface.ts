import { Document } from 'mongoose';

export interface Asset extends Document {
  id: string;
  fileName: string;
  type: string;
  size: number;
}

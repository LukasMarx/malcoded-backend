import { Document } from 'mongoose';

export interface EmailTemplate extends Document {
  id: string;
  name: string;
  mjml: string;
  previewBase64: string;
  variables: string[];
}

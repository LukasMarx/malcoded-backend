import { Injectable } from '@nestjs/common';
import { Stream } from 'stream';
import * as sharp from 'sharp';

@Injectable()
export class ImageService {
  reformatImage(stream: Stream, extension?: string, width?: number) {
    let transform = sharp();
    let mediaType: string;

    switch (extension) {
      case '.png' || '.PNG': {
        transform = transform.toFormat('png');
        mediaType = 'image/png';
        break;
      }
      case '.jpg' || '.JPG': {
        transform = transform
          .background({ r: 255, g: 255, b: 255, alpha: 1 })
          .flatten(true);
        transform = transform.toFormat('jpg');
        mediaType = 'image/jpg';
        break;
      }
      case '.webp' || '.WEBP': {
        transform = transform.toFormat('webp');
        mediaType = 'image/webp';
        break;
      }
    }

    if (width) {
      transform = transform.resize(width);
    }

    return { stream: stream.pipe(transform), mediaType };
  }
}

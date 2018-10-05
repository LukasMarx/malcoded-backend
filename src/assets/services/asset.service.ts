import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { QueryListResult } from 'common/interfaces/query-list-result.interface';
import { Asset } from '../interfaces/asset.interface';
import { Readable, Stream } from 'stream';
import { GridFSBucket } from 'mongodb';

import { Connection, Mongoose } from 'mongoose';
import { DbConnectionToken } from '../../constants';

@Injectable()
export class AssetService {
  private defaultBucket: GridFSBucket;

  constructor(@Inject(DbConnectionToken) mongoose: Mongoose) {
    this.defaultBucket = new GridFSBucket(mongoose.connection.db);
  }

  async findAll(skip?: number, limit?: number) {
    const allAssets = await this.defaultBucket
      .find()
      .skip(skip || 0)
      .limit(skip || 0)
      .toArray();

    const numberOfAssets = await this.defaultBucket.find().count();
    return {
      result: allAssets as Asset[],
      totalCount: numberOfAssets,
    };
  }

  async findOne(filename: string, res: any) {
    try {
      const stream = this.defaultBucket.openDownloadStreamByName(filename);
      stream.on('error', error => {
        res.sendStatus(400);
      });
      return stream;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async create(file: any) {
    const stream = new Readable();
    stream.push(file.buffer);
    stream.push(null);

    const extension = file.originalname.match(/\.[^/.]+$/)[0];
    const filename = file.originalname.replace(/\.[^/.]+$/, '');

    const uploadStream = this.defaultBucket.openUploadStream(filename, {
      contentType: file.mimetype,
      metadata: {
        originalExtension: extension,
      },
    });

    stream.pipe(uploadStream);
  }
}

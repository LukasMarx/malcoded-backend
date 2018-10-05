import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { EmailTemplate } from '../interfaces/email-template.interface';
import { EmailTemplateToken } from '../constants';
import {
  CreateEmailTemplateDto,
  UpdateEmailTemplateDto,
} from '../dto/template.dto';

@Injectable()
export class TemplateService {
  constructor(
    @Inject(EmailTemplateToken)
    private readonly templateModel: Model<EmailTemplate>,
  ) {}

  async findAll(skip: number, limit: number) {
    const allTemplates = await this.templateModel
      .find()
      .skip(skip || 0)
      .limit(limit || 0)
      .exec();
    const numberOfTemplates = await this.templateModel.countDocuments();
    return {
      result: allTemplates,
      totalCount: numberOfTemplates,
    };
  }

  async findOneById(id: string) {
    return await this.templateModel.findById(id).exec();
  }

  async create(createEmailTemplateDto: CreateEmailTemplateDto) {
    const createdTemplate = new this.templateModel(createEmailTemplateDto);
    return await createdTemplate.save();
  }

  async update(id: string, updateEmailTemplateDto: UpdateEmailTemplateDto) {
    return await this.templateModel
      .findByIdAndUpdate(id, updateEmailTemplateDto, {
        new: true,
      })
      .exec();
  }

  async delete(id: string) {
    await this.templateModel.deleteOne({ _id: id }).exec();
    return id;
  }
}

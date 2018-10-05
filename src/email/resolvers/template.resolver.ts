import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Roles } from '../../authentication/decorators/roles.decorator';
import { GraphqlService } from '../../common/services/graphql.service';
import { TemplateService } from '../services/template.service';
import { CreateEmailTemplateDto } from '../dto/template.dto';

@Resolver('EmailTemplate')
export class EmailTemplateResolver {
  constructor(
    private graphQlService: GraphqlService,
    private templateService: TemplateService,
  ) {}

  @Roles('admin')
  @Query('getEmailTemplates')
  async getEmailTemplates(
    @Args('skip') skip: number,
    @Args('limit') limit: number,
  ) {
    const allPostsListResult = await this.templateService.findAll(skip, limit);

    return this.graphQlService.convertArrayToConnection(
      allPostsListResult.result,
      allPostsListResult.totalCount,
    );
  }

  @Roles('admin')
  @Query('emailTemplate')
  async emailTemplate(@Args('id') id: string) {
    return await this.templateService.findOneById(id);
  }

  @Roles('admin')
  @Mutation('createEmailTemplate')
  async createEmailTemplate(
    @Args('createEmailTemplateInput')
    createEmailTemplateInput: CreateEmailTemplateDto,
  ) {
    return await this.templateService.create(createEmailTemplateInput);
  }

  @Roles('admin')
  @Mutation('updateEmailTemplate')
  async updateEmailTemplate(
    @Args('id') id: string,
    @Args('updateEmailTemplateInput')
    updateEmailTemplateInput: CreateEmailTemplateDto,
  ) {
    return await this.templateService.update(id, updateEmailTemplateInput);
  }

  @Roles('admin')
  @Mutation('deleteEmailTemplate')
  async deleteEmailTemplate(@Args('id') id: string) {
    return await this.templateService.delete(id);
  }
}

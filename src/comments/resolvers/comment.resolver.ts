import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Roles } from 'authentication/decorators/roles.decorator';
import { GraphqlService } from 'common/services/graphql.service';
import { CommentService } from '../services/comment.service';
import { CreateCommentDto, UpdateCommentDto } from '../dto/comment.dto';
import { User } from 'authentication/decorators/user.decorator';
import { User as IUser } from 'user/interfaces/user.interface';

@Resolver('Comment')
export class CommentResolver {
  constructor(
    private readonly commentService: CommentService,
    private graphQlService: GraphqlService,
  ) {}

  @Roles('Admin')
  @Query('getComments')
  async getComments(@Args('skip') skip: number, @Args('limit') limit: number) {
    const allPostsListResult = await this.commentService.findAll(skip, limit);

    return this.graphQlService.convertArrayToConnection(
      allPostsListResult.result,
      allPostsListResult.totalCount,
    );
  }

  @Query('getCommentsForPost')
  async getCommentsForPost(
    @Args('skip') skip: number,
    @Args('limit') limit: number,
  ) {
    const allPostsListResult = await this.commentService.findAll(skip, limit);

    return this.graphQlService.convertArrayToConnection(
      allPostsListResult.result,
      allPostsListResult.totalCount,
    );
  }

  @Query('comment')
  async getComment(@Args('id') id: string) {
    return await this.commentService.findOne(id);
  }

  @Roles('user')
  @Mutation()
  async createCommentForPost(
    @Args('postId') postId: string,
    @Args('createCommentInput') createCommentDto: CreateCommentDto,
    @User() user: IUser,
  ) {
    return await this.commentService.create(postId, user.id, createCommentDto);
  }

  @Roles('user')
  @Mutation()
  async updatePost(
    @Args('commentId') commentId: string,
    @Args('createCommentInput') updateCommentDto: UpdateCommentDto,
  ) {
    return await this.commentService.updateOne(commentId, updateCommentDto);
  }
}

import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { Roles } from '../../authentication/decorators/roles.decorator';
import { GraphqlService } from '../../common/services/graphql.service';
import { CommentService } from '../services/comment.service';
import { CreateCommentDto, UpdateCommentDto } from '../dto/comment.dto';
import { User } from '../../authentication/decorators/user.decorator';
import { User as IUser } from '../../user/interfaces/user.interface';
import { UserService } from '../../user/services/user.service';
import { PostService } from './../../post/services/post.service';
import { create } from 'domain';

@Resolver('Comment')
export class CommentResolver {
  constructor(
    private readonly commentService: CommentService,
    private readonly graphQlService: GraphqlService,
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  @Roles('admin')
  @Query('getComments')
  async getComments(@Args('skip') skip: number, @Args('limit') limit: number) {
    const allCommentsListResult = await this.commentService.findAll(
      skip,
      limit,
    );

    return this.graphQlService.convertArrayToConnection(
      allCommentsListResult.result,
      allCommentsListResult.totalCount,
    );
  }

  @Query('getCommentsForPost')
  async getCommentsForPost(
    @Args('skip') skip: number,
    @Args('limit') limit: number,
    @Args('postId') postId: string,
  ) {
    const allCommentsListResult = await this.commentService.findAllForPost(
      postId,
      skip,
      limit,
    );

    return this.graphQlService.convertArrayToConnection(
      allCommentsListResult.result,
      allCommentsListResult.totalCount,
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
  async updateComment(
    @Args('commentId') commentId: string,
    @Args('updateCommentInput') updateCommentDto: UpdateCommentDto,
    @User() user: IUser,
  ) {
    return await this.commentService.updateOne(
      commentId,
      updateCommentDto,
      user,
    );
  }

  @Roles('user')
  @Mutation()
  async deleteComment(
    @Args('commentId') commentId: string,
    @User() user: IUser,
  ) {
    await this.commentService.delete(commentId, user);
    return commentId;
  }

  @Roles('user')
  @Mutation()
  async deleteAnswer(
    @Args('commentId') commentId: string,
    @Args('answerId') answerId: string,
    @User() user: IUser,
  ) {
    await this.commentService.deleteAnswer(commentId, answerId, user);
    return commentId;
  }

  @Roles('user')
  @Mutation()
  async answerComment(
    @Args('commentId') commentId: string,
    @Args('createCommentInput') createCommentDto: CreateCommentDto,
    @User() user: IUser,
  ) {
    return await this.commentService.answerComment(
      commentId,
      user.id,
      createCommentDto,
    );
  }

  @ResolveProperty('author')
  async getAuthor(@Parent() comment) {
    const { author } = comment;
    const result = await this.userService.findOne(author);
    return {
      id: result.id,
      displayName: result.displayName,
      image: result.image.toString('base64'),
    };
  }

  @ResolveProperty('post')
  async getPost(@Parent() comment) {
    const { post } = comment;
    const result = await this.postService.findOne(post);
    return result;
  }

  @ResolveProperty('answers')
  async getAnswer(@Parent() comment) {
    const { answers } = comment;
    const allCommentsListResult = await this.commentService.findMany(answers);

    return this.graphQlService.convertArrayToConnection(
      allCommentsListResult.result,
      allCommentsListResult.totalCount,
    );
  }
}

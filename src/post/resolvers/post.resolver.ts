import {
  Resolver,
  Query,
  ResolveProperty,
  Parent,
  Args,
  Mutation,
} from '@nestjs/graphql';
import { PostService } from '../services/post.service';
import { UpdatePostDto, CreatePostDto } from '../dto/post.dto';
import { Roles } from '../../authentication/decorators/roles.decorator';
import { GraphqlService } from '../../common/services/graphql.service';
import { UserService } from '../../user/services/user.service';
import { CommentService } from '../../comments/services/comment.service';

@Resolver('Post')
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService,
    private graphQlService: GraphqlService,
    private commentService: CommentService,
  ) {}

  @Roles('admin')
  @Query('getPosts')
  async getPosts(@Args('skip') skip: number, @Args('limit') limit: number) {
    const allPostsListResult = await this.postService.findAll(skip, limit);

    return this.graphQlService.convertArrayToConnection(
      allPostsListResult.result,
      allPostsListResult.totalCount,
    );
  }

  @Query('getPublicPosts')
  async getPublicPosts(
    @Args('skip') skip: number,
    @Args('limit') limit: number,
    @Args('category') category: string,
  ) {
    const allPostsListResult = await this.postService.findAllPublished(
      skip,
      limit,
      category,
    );

    return this.graphQlService.convertArrayToConnection(
      allPostsListResult.result,
      allPostsListResult.totalCount,
    );
  }

  @Roles('admin')
  @Query('post')
  async getPost(@Args('id') id: string) {
    return await this.postService.findOne(id);
  }

  @Query('publicPost')
  async getPublicPost(@Args('url') url: string) {
    return await this.postService.findOnePublished(url);
  }

  @Roles('admin')
  @Mutation('createPost')
  async createPost(@Args('createPostInput') createPostDto: CreatePostDto) {
    return await this.postService.create(createPostDto);
  }

  @Roles('admin')
  @Mutation('releasePost')
  async releasePost(@Args('id') id: string) {
    return await this.postService.release(id);
  }

  @Roles('admin')
  @Mutation('takeDownPost')
  async takeDownPost(@Args('id') id: string) {
    return await this.postService.takeDown(id);
  }

  @Roles('admin')
  @Mutation('updatePost')
  async updatePost(
    @Args('id') postId: string,
    @Args('updatePostInput') updatePostDto: UpdatePostDto,
  ) {
    return await this.postService.updateOne(postId, updatePostDto);
  }

  @ResolveProperty('recommendedPosts')
  async getRecommendations(@Parent() post) {
    const { recommendedPosts } = post;
    const allPostsListResult = await this.postService.findMany(
      recommendedPosts,
    );

    return this.graphQlService.convertArrayToConnection(
      allPostsListResult.result,
      allPostsListResult.totalCount,
    );
  }

  @ResolveProperty('author')
  async getAuthor(@Parent() post) {
    const { author } = post;
    return await this.userService.findOne(author);
  }

  @ResolveProperty('comments')
  async getComments(@Parent() post) {
    return await this.commentService.findAllForPost(post.id);
  }
}

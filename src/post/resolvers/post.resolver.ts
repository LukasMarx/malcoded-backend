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
import { Roles } from 'authentication/decorators/roles.decorator';
import { GraphqlService } from 'common/services/graphql.service';

@Resolver('Post')
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private graphQlService: GraphqlService,
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

  @Query('getPublishedPosts')
  async getPublishedPosts(
    @Args('skip') skip: number,
    @Args('limit') limit: number,
  ) {
    const allPostsListResult = await this.postService.findAll(skip, limit);

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

  @Query('publishedPost')
  async getPublishedPost(@Args('id') id: string) {
    return await this.postService.findOne(id);
  }

  @Roles('admin')
  @Mutation()
  async createPost(@Args('createPostInput') createPostDto: CreatePostDto) {
    return await this.postService.create(createPostDto);
  }

  @Roles('admin')
  @Mutation()
  async updatePost(
    @Args('id') postId: string,
    @Args('updatePostInput') updatePostDto: UpdatePostDto,
  ) {
    return await this.postService.updateOne(postId, updatePostDto);
  }

  @ResolveProperty('recommendations')
  async getRecommendations(@Parent() post) {
    const { recommendations } = post;
    return await this.postService.findMany(recommendations);
  }
}

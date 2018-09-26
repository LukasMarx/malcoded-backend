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

@Resolver('Post')
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Query('getPosts')
  async getPosts() {
    return await this.postService.findAll();
  }

  @Roles('admin')
  @Query('post')
  async getPost(@Args('id') id: string) {
    return await this.postService.findOne(id);
  }

  @Mutation()
  async createPost(@Args('createPostInput') createPostDto: CreatePostDto) {
    return await this.postService.create(createPostDto);
  }

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

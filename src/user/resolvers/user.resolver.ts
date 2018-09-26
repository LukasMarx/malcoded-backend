import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query('getUsers')
  async getPosts() {
    return await this.userService.findAll();
  }

  @Query('user')
  async getPost(@Args('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Mutation()
  async createUser(@Args('createUserInput') createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Mutation()
  async updatePost(
    @Args('id') userId: string,
    @Args('updateUserInput') updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateOne(userId, updateUserDto);
  }
}

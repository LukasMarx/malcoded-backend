import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { Roles } from 'authentication/decorators/roles.decorator';
import { GraphqlService } from 'common/services/graphql.service';
import { User } from 'authentication/decorators/user.decorator';
import { User as IUser } from '../interfaces/user.interface';
import { UnauthorizedException } from '@nestjs/common';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly graphqlService: GraphqlService,
  ) {}

  @Roles('admin')
  @Query('getUsers')
  async getUsers(@Args('skip') skip: number, @Args('limit') limit: number) {
    const allUsersQueryResult = await this.userService.findAll(skip, limit);
    return this.graphqlService.convertArrayToConnection(
      allUsersQueryResult.result,
      allUsersQueryResult.totalCount,
    );
  }

  @Roles('admin', 'user')
  @Query('user')
  async getUser(@Args('id') id: string, @User() user: IUser) {
    // only allow user to access his own profile
    if (!user.roles.includes('admin')) {
      if (id !== user.id) {
        throw new UnauthorizedException();
      }
    }

    return await this.userService.findOne(id);
  }

  @Mutation()
  async createUser(@Args('createUserInput') createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  // @Roles('admin')
  // @Mutation()
  // async updateUser(
  //   @Args('id') userId: string,
  //   @Args('updateUserInput') updateUserDto: UpdateUserDto,
  // ) {
  //   return await this.userService.updateOne(userId, updateUserDto);
  // }
}

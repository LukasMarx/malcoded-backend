import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Roles } from 'authentication/decorators/roles.decorator';
import { GraphqlService } from 'common/services/graphql.service';
import { AssetService } from '../services/asset.service';

@Resolver('Asset')
export class AssetResolver {
  constructor(
    private readonly assetService: AssetService,
    private graphQlService: GraphqlService,
  ) {}

  @Roles('admin')
  @Query('getAssets')
  async getAssets(@Args('skip') skip: number, @Args('limit') limit: number) {
    console.log('test');
    const allAssetListResult = await this.assetService.findAll(skip, limit);

    return this.graphQlService.convertArrayToConnection(
      allAssetListResult.result,
      allAssetListResult.totalCount,
    );
  }
}

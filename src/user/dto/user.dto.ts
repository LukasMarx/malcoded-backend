export class CreateUserDto {
  readonly email: string;
  readonly password: string;
}

export class UpdateUserDto {
  readonly password: string;
}
export class FromOAuthDto {
  email: string;
  displayName: string;
  provider: 'GOOGLE' | 'FACEBOOK' | 'GITHUB' | 'TWITTER';
  providerId: string;
  image: Buffer;
}

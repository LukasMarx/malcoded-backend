export class CreateUserDto {
  readonly email: string;
  readonly password: string;
}

export class UpdateUserDto {
  readonly password: string;
}

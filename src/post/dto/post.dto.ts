export class CreatePostDto {
  readonly title: string;
  readonly description: string;
  readonly releaseDate: Date;
  readonly thumbnail: string;
  readonly url: string;
  readonly primaryColor: string;
  readonly content: string;
}

export class UpdatePostDto {
  readonly title: string;
  readonly description: string;
  readonly releaseDate: Date;
  readonly thumbnail: string;
  readonly url: string;
  readonly primaryColor: string;
  readonly content: string;
}

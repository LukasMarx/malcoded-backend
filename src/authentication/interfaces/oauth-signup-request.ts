export interface OAuthSignupRequest {
  email: string;
  displayName: string;
  provider: 'GOOGLE' | 'FACEBOOK' | 'GITHUB' | 'TWITTER';
  providerId: string;
  image: Buffer;
}

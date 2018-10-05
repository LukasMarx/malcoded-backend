export interface TokenObject {
  access_token: string;
  user: {
    id: string;
    displayName: string;
    image: string;
  };
}

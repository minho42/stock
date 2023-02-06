export interface IUser {
  _id: string;
  name: string;
  email: string;
  tokens: string[];
  isSuperuser: boolean;
}

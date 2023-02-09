import { IUser } from "./UserType";

export interface IUserContext {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  isLoading: boolean;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

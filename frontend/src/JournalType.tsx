export interface IJournal {
  _id: string;
  owner: string;
  isPublic: boolean;
  action: string;
  symbol: string;
  amount: number;
  units: number;
  date: Date;
  content: string;
}

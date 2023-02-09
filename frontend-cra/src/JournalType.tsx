export interface IJournal {
  _id: string;
  owner: string;
  isPublic: boolean;
  action: "buy" | "sell" | "watch" | "note";
  symbol?: string;
  amount?: number;
  units?: number;
  date?: Date;
  content?: string;
}

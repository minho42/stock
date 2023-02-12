import { ObjectId } from "mongodb";

export interface IJournal {
  _id: ObjectId;
  owner: string;
  isPublic: boolean;
  action: "buy" | "sell" | "watch" | "note";
  symbol?: string;
  amount?: number;
  units?: number;
  date?: Date;
  content?: string;
}

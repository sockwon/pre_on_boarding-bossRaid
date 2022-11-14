export interface IRaidRecord {
  id: number;
  userId: number;
  score: number;
  level: number;
  isClear: boolean;
  enterTime: Date;
  endTime: Date;
}

export interface IRaidRecordInput {
  userId: number;
  level: number;
}

export interface Value {
  canEnter: boolean;
  enteredUserId: number | null;
}
export interface IScores {
  level: number;
  score: number;
}

export interface IRaidEndInput {
  userId: number;
  raidRecordId: number;
  level: IScores[];
}

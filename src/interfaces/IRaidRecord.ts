export interface IRaidRecord {
  id: number;
  userId: number;
  score: number;
  level: number;
  isClear: boolean;
  enterTime: Date;
  endTime: Date;
}

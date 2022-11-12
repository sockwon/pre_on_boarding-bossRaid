import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinTable,
} from "typeorm";
import BossRaid from "./BossRaid";
import User from "./User";

@Entity()
export class RaidRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne((type) => User, (user) => user.id)
  user!: number;

  @ManyToOne((type) => BossRaid, (bossRaid) => bossRaid.id)
  bossRaid!: number;

  @Column({ type: "int", default: 0 })
  score!: number;

  @Column({ type: "int", default: 1 })
  level!: number;

  @Column({ type: "boolean", default: false })
  isClear!: boolean;

  @CreateDateColumn()
  enterTime!: Date;

  @UpdateDateColumn()
  endTime!: Date;
}

export default RaidRecord;

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class BossRaid {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int", default: true })
  canEnter!: number;

  @Column({ type: "int", default: null })
  enteredUserId!: number;

  @Column({
    type: "varchar",
    default:
      "https://dmpilf5svl7rv.cloudfront.net/assignment/backend/bossRaidData.json",
  })
  staticDataURL!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export default BossRaid;

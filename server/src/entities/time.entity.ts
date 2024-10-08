import { Entity, Column } from "typeorm";
import { BaseEntity } from "../base/entity/base.entity";

@Entity({ name: 'time' })
export class Time extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  time: string;
}

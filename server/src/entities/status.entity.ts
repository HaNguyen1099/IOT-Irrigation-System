import { Entity, Column } from "typeorm";
import { BaseEntity } from "../base/entity/base.entity";

@Entity({ name: 'status' })
export class Status extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  status: string;
}

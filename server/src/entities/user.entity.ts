import { Exclude } from "class-transformer";
import { Entity, Column } from "typeorm";
import { BaseEntity } from "../base/entity/base.entity";

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Exclude()
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastEmailSent: Date; // thời gian gửi mail lần cuối
}

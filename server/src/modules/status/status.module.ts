import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StatusController } from "./status.controller";
import { StatusService } from "./status.service";
import { Status } from "../../entities/status.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Status])],
    controllers: [StatusController],
    providers: [StatusService]
})

export class StatusModule {};
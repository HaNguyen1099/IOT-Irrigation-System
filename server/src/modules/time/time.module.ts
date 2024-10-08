import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TimeController } from "./time.controller";
import { Time } from "../../entities/time.entity";
import { TimeService } from "./time.service";

@Module({
    imports: [TypeOrmModule.forFeature([Time])],
    controllers: [TimeController],
    providers: [TimeService]
})

export class TimeModule {};
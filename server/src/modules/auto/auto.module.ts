import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Auto } from "../../entities/auto.entity";
import { AutoController } from "./auto.controller";
import { AutoService } from "./auto.service";


@Module({
    imports: [TypeOrmModule.forFeature([Auto])],
    controllers: [AutoController],
    providers: [AutoService]
})

export class AutoModule {};
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../entities/user.entity";
import { AlertController } from "./alert.controller";
import { AlertService } from "./alert.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),

    ],
    controllers: [AlertController],
    providers: [AlertService],
    exports: []
})

export class AlertModule {}
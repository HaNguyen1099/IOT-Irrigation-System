import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../entities/user.entity";
import { Repository } from "typeorm";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class AlertService {
    constructor(
        private readonly mailerService: MailerService,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async sendAlert() {
        const users = await this.userRepository.find();

        for (const user of users) {
            const today = new Date();
            const lastEmailSent = user.lastEmailSent ? new Date(user.lastEmailSent) : null;

            if (!lastEmailSent || lastEmailSent.toDateString() !== today.toDateString()) {
                await this.mailerService.sendMail({
                    to: user.email,
                    subject: "Cảnh báo máy bơm!",
                    template: "./alert",
                    context: {
                        name: user.name
                    }
                })

                // Cập nhật thời gian gửi mail
                user.lastEmailSent = new Date();
                await this.userRepository.save(user);
            }
        }
    }
}
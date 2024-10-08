import { ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Time } from "../../entities/time.entity";

@Injectable()
export class TimeService {
    constructor(
        @InjectRepository(Time)
        private timeRepository: Repository<Time>,
    ) {}

    async create(time: string): Promise<Time> {
        const countTime = await this.timeRepository.count({
            where: { time }
        });

        if (countTime > 0) {
            throw new ConflictException(`Time ${time} đã được cài đặt.`);
        }

        const newTime = this.timeRepository.create({time})
        
        return this.timeRepository.save(newTime)
    }

    async getList(): Promise<Time[]> {
        return await this.timeRepository.find();
    }

    async getDetail(id: number): Promise<Time> {
        return await this.timeRepository.findOneBy({id});
    }

    async update(id: number, time: string) {
        await this.timeRepository.update({id: id}, {time: time});

        return this.timeRepository.findOneBy({id});
    }

    async delete(id: number) {
        return await this.timeRepository.delete({id: id})
    }
}


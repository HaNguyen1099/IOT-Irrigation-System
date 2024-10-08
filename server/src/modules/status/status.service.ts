import { Injectable} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Status } from "../../entities/status.entity";

@Injectable()
export class StatusService {
    constructor(
        @InjectRepository(Status)
        private statusRepository: Repository<Status>,
    ) {}

    async create(status: string): Promise<Status> {
        const newStatus = this.statusRepository.create({status})
        
        return this.statusRepository.save(newStatus)
    }

    async update(id: number, status: string) {
        await this.statusRepository.update({id: id}, {status: status});

        return this.statusRepository.findOneBy({id});
    }

    async getDetail(id: number): Promise<Status> {
        return await this.statusRepository.findOneBy({id});
    }
}


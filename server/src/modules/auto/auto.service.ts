import { Injectable} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Auto } from "../../entities/auto.entity";

@Injectable()
export class AutoService {
    constructor(
        @InjectRepository(Auto)
        private autoRepository: Repository<Auto>,
    ) {}

    async create(status: string): Promise<Auto> {
        const newStatus = this.autoRepository.create({status})
        
        return this.autoRepository.save(newStatus)
    }

    async getList(): Promise<Auto[]> {
        return await this.autoRepository.find();
    }
}


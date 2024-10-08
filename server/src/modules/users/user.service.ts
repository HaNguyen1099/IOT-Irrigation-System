import { ConflictException, Injectable } from "@nestjs/common"; 
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../entities/user.entity";
import { UserRegisterDto, UserUpdateDto } from "../../dto/user.dto";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async register(userDto: UserRegisterDto): Promise<User> {
        const { password, email, ...rest } = userDto;

        const salt = await bcrypt.genSalt();

        const hashPassword = await bcrypt.hash(password, salt);

        const countEmail = await this.usersRepository.count({
            where: { email }
        });

        if (countEmail > 0) {
            throw new ConflictException(`Email ${email} đã được sử dụng.`);
        }

        const newUser = this.usersRepository.create({
            ...rest,
            email,
            password: hashPassword
        })
        
        return this.usersRepository.save(newUser)
    }

    async getProfile(id: number): Promise<User> {
        return await this.usersRepository.findOne({
            where: {id},
            select: ['name', 'email']
        })
    }

    async updateProfile(id: number, userDto: UserUpdateDto): Promise<User> {
        await this.usersRepository.update({id: id}, userDto);

        return this.usersRepository.findOneBy({id});
    }
}


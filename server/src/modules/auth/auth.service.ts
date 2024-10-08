import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../entities/user.entity";
import { Repository } from "typeorm";
import { UserLoginDto } from "../../dto/user.dto";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    async login(userDto: UserLoginDto): Promise< any > {
        const { email, password } = userDto;

        const user = await this.usersRepository.findOneBy({ email }) 

        if (!user) {
            throw new ConflictException("Could not find user");
        }

        const passwordMatched = await bcrypt.compare(
            password,
            user.password
        );

        if (passwordMatched) {
            delete user.password;
        
            return {
                id: user.id,
                code: "200"
            };
        } else {
            throw new UnauthorizedException("Password does not match"); 
        }

    }
}
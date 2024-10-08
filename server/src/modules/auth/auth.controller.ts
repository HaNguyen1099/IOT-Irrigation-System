import { Body, Controller, Post, Req } from "@nestjs/common";
import { User } from "../../entities/user.entity";
import { plainToInstance } from "class-transformer";
import { AuthService } from "./auth.service";
import { UserService } from "../users/user.service";
import { UserLoginDto, UserRegisterDto } from "../../dto/user.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('auth')
@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}
    
    @Post('/register')
    @ApiOperation({ summary: 'Register account' })
    async register(@Body() userDto: UserRegisterDto): Promise<User>{
        const user = await this.userService.register(userDto);
        return plainToInstance(User, user)
    }

    @Post('/login')
    @ApiOperation({ summary: 'Login account' })
    async login(@Req() req, @Body() userDto: UserLoginDto): Promise<any>{
        const user = await this.authService.login(userDto);

        return plainToInstance(User, user)
    }
}
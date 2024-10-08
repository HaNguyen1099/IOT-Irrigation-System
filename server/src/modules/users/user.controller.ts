import { Body, Controller, Delete, Get, Param, Patch, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "../../entities/user.entity";
import { plainToInstance } from "class-transformer";
import { UserUpdateDto } from "../../dto/user.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {};
    
    @Get('/profile')
    @ApiOperation({ summary: 'Get user profile' })
    async getProfile(@Req() req): Promise<User>{
        const userId = req.user.id;
        const user = this.userService.getProfile(userId);
        return plainToInstance(User, user);
    }

    @Patch('profile/update')
    @ApiOperation({ summary: 'Update user profile' })
    async updateProfile(
        @Req() req,
        @Body() userDto: UserUpdateDto
    ): Promise<User>{
        const userId = req.user.id;
        const user = this.userService.updateProfile(userId, userDto);
        return plainToInstance(User, user);
    }
}
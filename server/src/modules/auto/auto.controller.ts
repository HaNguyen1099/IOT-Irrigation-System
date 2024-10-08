import { Body, Controller, Get, Post } from "@nestjs/common";
import { AutoService } from "./auto.service";
import { Auto } from "../../entities/auto.entity";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('status')
@Controller('auto')
export class AutoController {
    constructor(private readonly autoService: AutoService) {};

    @Post('/create')
    @ApiOperation({ summary: 'Add pump status' })
    async create(
        @Body() body: {status: string}
    ): Promise<any>{
        return this.autoService.create(body.status);
    }

    @Get()
    @ApiOperation({ summary: 'Get list pump status' })
    async getList(): Promise<Auto[]> {
        return this.autoService.getList();
    }
}
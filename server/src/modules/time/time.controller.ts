import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, ValidationPipe } from "@nestjs/common";
import { TimeService } from "./time.service";
import { Time } from "../../entities/time.entity";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('schedule')
@Controller('time')
export class TimeController {
    constructor(private readonly timeService: TimeService) {};

    @Post('/create')
    @ApiOperation({ summary: 'Add automatic pump schedule' })
    async create(
        @Body() body: {time: string}
    ): Promise<any>{
        return this.timeService.create(body.time);
    }

    @Get()
    @ApiOperation({ summary: 'Get list automatic pump schedule' })
    async getList(): Promise<Time[]> {
        return this.timeService.getList();
    }

    @Get('/detail/:id')
    @ApiOperation({ summary: 'Get detail automatic pump schedule' })
    async detail(@Param('id') id: number): Promise<Time> {
        return this.timeService.getDetail(id);
    }

    @Patch('/edit/:id')
    @ApiOperation({ summary: 'Edit automatic pump schedule' })
    async update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() body: {time: string}
    ): Promise<any>{
        return this.timeService.update(id, body.time);
    }

    @Delete('delete/:id')
    @ApiOperation({ summary: 'Delete automatic pump schedule' })
    async delete(@Param('id') id: number) {
        return this.timeService.delete(id);
    }
}
import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { StatusService } from "./status.service";
import { Status } from "../../entities/status.entity";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('manual')
@Controller('status')
export class StatusController {
    constructor(private readonly statusService: StatusService) {};

    @Post('/create')
    @ApiOperation({ summary: 'Add manual pump status' })
    async create(
        @Body() body: {status: string}
    ): Promise<any>{
        return this.statusService.create(body.status);
    }

    @Patch('/edit/:id')
    @ApiOperation({ summary: 'Edit manual pump status' })
    async update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() body: {status: string}
    ): Promise<any>{
        return this.statusService.update(id, body.status);
    }

    @Get('/detail/:id')
    @ApiOperation({ summary: 'Delete manual pump status' })
    async detail(@Param('id') id: number): Promise<Status> {
        return this.statusService.getDetail(id);
    }
}
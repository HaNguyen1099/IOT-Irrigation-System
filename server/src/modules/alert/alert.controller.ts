import { Controller, Get } from "@nestjs/common";
import { AlertService } from "./alert.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('mail')
@Controller('alert')
export class AlertController {
    constructor(private readonly alertService: AlertService) {}

    @Get('sendMail')
    @ApiOperation({ summary: 'Send alert mail' })
    async sendAlert() {
      await this.alertService.sendAlert();
      return 'Checked and alert sent if conditions met';
    }
  }
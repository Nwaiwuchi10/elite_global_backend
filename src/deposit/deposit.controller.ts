import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { DepositService } from './deposit.service';
import { ApproveDepositDto, CreateDepositDto } from './dto/create-deposit.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';

@Controller('deposit')
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @Post()
  create(@Body() createDepositDto: CreateDepositDto) {
    return this.depositService.create(createDepositDto);
  }

  @Get()
  findAll() {
    return this.depositService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.depositService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDepositDto: UpdateDepositDto) {
    return this.depositService.update(id, updateDepositDto);
  }
  @Patch(':id/approve')
  async approveDeposit(@Param('id') depositId: string) {
    return this.depositService.approveDeposit(depositId);
  }
  @Patch(':id/approvel')
  approve(@Param('id') id: string, @Body() approveDto: ApproveDepositDto) {
    return this.depositService.approve(id, approveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.depositService.remove(id);
  }

  @Get('user/:userId/all')
  async getUserDeposits(@Param('userId') userId: string) {
    return this.depositService.getUserDeposits(userId);
  }
  @Get('total/:userId')
  async getUserTotalDeposits(@Param('userId') userId: string) {
    if (!userId) {
      throw new NotFoundException('Invalid user ID');
    }

    const totalDeposits =
      await this.depositService.getUserTotalDeposits(userId);
    return { userId, totalDeposits };
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersinvestmentplanService } from './usersinvestmentplan.service';
import { CreateUsersinvestmentplanDto } from './dto/create-usersinvestmentplan.dto';
import { UpdateUsersinvestmentplanDto } from './dto/update-usersinvestmentplan.dto';

@Controller('usersinvestmentplan')
export class UsersinvestmentplanController {
  constructor(
    private readonly usersinvestmentplanService: UsersinvestmentplanService,
  ) {}
  @Post(':planId')
  async invest(
    @Param('planId') planId: string,
    @Body() body: { clientId: string; amount: number },
  ) {
    return this.usersinvestmentplanService.invest(
      body.clientId,
      planId,
      body.amount,
    );
  }
  @Post()
  create(@Body() createDto: CreateUsersinvestmentplanDto) {
    return this.usersinvestmentplanService.create(createDto);
  }

  @Get()
  findAll() {
    return this.usersinvestmentplanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersinvestmentplanService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateUsersinvestmentplanDto,
  ) {
    return this.usersinvestmentplanService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersinvestmentplanService.remove(id);
  }
  @Patch(':userId/pause')
  pause(@Param('userId') userId: string) {
    return this.usersinvestmentplanService.pause(userId);
  }

  @Patch(':userId/end')
  end(@Param('userId') userId: string) {
    return this.usersinvestmentplanService.end(userId);
  }
  @Patch(':userId/percent')
  async updateUserInvestmentPercent(
    @Param('userId') userId: string,
    @Body('percent') percent: number,
  ) {
    return this.usersinvestmentplanService.updateUserInvestmentPercent(
      userId,
      percent,
    );
  }
  @Get('user-investments/:userId')
  async getUserInvestments(@Param('userId') userId: string) {
    return this.usersinvestmentplanService.getUserInvestments(userId);
  }
}

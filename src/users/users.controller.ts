import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() credentials: LoginDto) {
    return this.usersService.login(credentials);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
  ///
  @Patch(':id/block/user')
  block(@Param('id') id: string) {
    return this.usersService.blockUser(id);
  }

  @Patch(':id/referral-balance')
  updateReferralBalance(
    @Param('id') id: string,
    @Body('amount') amount: number,
  ) {
    return this.usersService.updateReferralBalance(id, amount);
  }

  @Patch(':id/referral-count')
  updateReferralCount(@Param('id') id: string, @Body('count') count: number) {
    return this.usersService.updateReferralCount(id, count);
  }

  @Get(':id/referrals')
  getReferrals(@Param('id') id: string) {
    return this.usersService.getUserReferrals(id);
  }

  @Patch(':id/change-password')
  changePassword(
    @Param('id') id: string,
    @Body() dto: { oldPass: string; newPass: string },
  ) {
    return this.usersService.changePasswordJege(id, dto.oldPass, dto.newPass);
  }

  @Patch(':id/reset-password')
  resetPassword(@Param('id') id: string, @Body('newPass') newPass: string) {
    return this.usersService.resetPasswordJege(id, newPass);
  }
}

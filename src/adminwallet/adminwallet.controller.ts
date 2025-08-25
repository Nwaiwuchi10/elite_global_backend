import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AdminwalletService } from './adminwallet.service';
import { CreateAdminwalletDto } from './dto/create-adminwallet.dto';
import { UpdateAdminwalletDto } from './dto/update-adminwallet.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('adminwallet')
export class AdminwalletController {
  constructor(private readonly adminwalletService: AdminwalletService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('files', {
      storage: diskStorage({
        destination: './FileUploads',
        filename: (req, file, cb) => {
          const sanitized = file.originalname
            .replace(/\s+/g, '')
            .replace(/[^a-zA-Z0-9.-]/g, '');
          cb(null, `${Date.now()}-${sanitized}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body('walletData') createWalletDto: string,
  ) {
    const parsedDto = JSON.parse(createWalletDto);
    // Pass both signup data and the optional profilePics to the service
    return this.adminwalletService.create(parsedDto, file);
  }

  // @Post()
  // create(@Body() createAdminwalletDto: CreateAdminwalletDto) {
  //   return this.adminwalletService.create(createAdminwalletDto);
  // }
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('files', {
      storage: diskStorage({
        destination: './FileUploads',
        filename: (req, file, cb) => {
          const sanitized = file.originalname
            .replace(/\s+/g, '')
            .replace(/[^a-zA-Z0-9.-]/g, '');
          cb(null, `${Date.now()}-${sanitized}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('walletData') updateWalletDto: string,
  ) {
    const parsedDto = JSON.parse(updateWalletDto);
    return this.adminwalletService.update(id, parsedDto, file);
  }
  @Get()
  findAll() {
    return this.adminwalletService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminwalletService.findOne(id);
  }

  @Patch(':id/old')
  updates(
    @Param('id') id: string,
    @Body() updateAdminwalletDto: UpdateAdminwalletDto,
  ) {
    return this.adminwalletService.update(id, updateAdminwalletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminwalletService.remove(id);
  }
}

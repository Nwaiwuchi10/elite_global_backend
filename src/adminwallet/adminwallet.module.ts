import { Module } from '@nestjs/common';
import { AdminwalletService } from './adminwallet.service';
import { AdminwalletController } from './adminwallet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Adminwallet, AdminwalletSchema } from './entities/adminwallet.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Adminwallet.name,
        schema: AdminwalletSchema,
      },
    ]),
  ],
  controllers: [AdminwalletController],
  providers: [AdminwalletService],
})
export class AdminwalletModule {}

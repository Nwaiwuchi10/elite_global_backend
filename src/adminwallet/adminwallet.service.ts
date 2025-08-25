import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminwalletDto } from './dto/create-adminwallet.dto';
import { UpdateAdminwalletDto } from './dto/update-adminwallet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Adminwallet } from './entities/adminwallet.entity';
import { Model } from 'mongoose';

@Injectable()
export class AdminwalletService {
  constructor(
    @InjectModel(Adminwallet.name) private AdminwalletModel: Model<Adminwallet>,

    // private mailService: MailService,
  ) {}
  async create(
    createWalletDto: CreateAdminwalletDto,
    file?: Express.Multer.File,
  ) {
    const { walletName, walletAdress, walletQR } = createWalletDto;

    const walletInUse = await this.AdminwalletModel.findOne({ walletName });
    if (walletInUse) {
      throw new BadRequestException('Wallet already in use');
    }
    let fileData: string | undefined;
    if (file) {
      try {
        const filePath = `${process.env.Base_Url || process.env.Base_Url_Local}/uploads/${file.filename}`;
        // PicsUrl.push(filePath);
        fileData = filePath;
      } catch (error) {
        console.error('File Save Error:', error);
        throw new BadRequestException('Error saving file(s)');
      }
    }

    // Log the profilePicsUrl before saving to MongoDB
    console.log('picture URL:', fileData);

    const newWallet = new this.AdminwalletModel({
      walletName,
      walletAdress,
      walletQR: fileData,
    });

    await newWallet.save();

    return {
      _id: newWallet._id,
      walletName: newWallet.walletName,
      walletAdress: newWallet.walletAdress,
      walletQR: newWallet.walletQR,
    };
  }

  async findOne(id: string): Promise<any> {
    const wallet = await this.AdminwalletModel.findById(id).exec();
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }
  async findAll(): Promise<any> {
    try {
      const wallet = await this.AdminwalletModel.find()
        .sort({ createdAt: -1 })
        .exec();
      return wallet;
    } catch (error) {
      return { error: error.message };
    }
  }
  async remove(id: string) {
    const deleteUser = await this.AdminwalletModel.findByIdAndDelete(id);
    if (!deleteUser) {
      throw new BadRequestException('Wallet not found');
    }
    return { message: 'Wallet Deleted' };
  }

  async update(id: string, updateWalletDto: any, file?: Express.Multer.File) {
    const { walletName, walletAdress } = updateWalletDto;

    // Check if wallet exists
    const existingWallet = await this.AdminwalletModel.findById(id);
    if (!existingWallet) {
      throw new BadRequestException('Wallet not found');
    }

    // If a new file is uploaded, update the walletQR path
    let fileData = existingWallet.walletQR;
    if (file) {
      try {
        fileData = `${process.env.Base_Url || process.env.Base_Url_Local}/uploads/${file.filename}`;
      } catch (error) {
        console.error('File Save Error:', error);
        throw new BadRequestException('Error saving file');
      }
    }

    // Update wallet
    existingWallet.walletName = walletName || existingWallet.walletName;
    existingWallet.walletAdress = walletAdress || existingWallet.walletAdress;
    existingWallet.walletQR = fileData;

    await existingWallet.save();

    return {
      _id: existingWallet._id,
      walletName: existingWallet.walletName,
      walletAdress: existingWallet.walletAdress,
      walletQR: existingWallet.walletQR,
    };
  }
}

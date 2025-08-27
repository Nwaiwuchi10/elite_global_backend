import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from './dto/login.dto';
import { MailService } from './services/mai.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private readonly mailService: MailService,

    // private mailService: MailService,
  ) {}
  async create(createAuthDto: CreateUserDto) {
    const { email, password, firstName, lastName, country, referralCode } =
      createAuthDto;

    const emailInUse = await this.UserModel.findOne({ email });
    if (emailInUse) {
      throw new BadRequestException('Email already in use');
    }
    const newReferralCode = `${firstName}-${uuidv4().slice(0, 8)}`; // short unique code

    let referredBy = '';

    // Check if referral code was provided
    if (referralCode) {
      const referrer = await this.UserModel.findOne({ referralCode });
      if (!referrer) {
        throw new BadRequestException('Invalid referral code');
      }
      // Increase referrer’s balance
      referrer.referralBalance += 5;
      await referrer.save();
      referredBy = referralCode;
    }

    const newUser = new this.UserModel({
      email,
      password,
      firstName,
      country,
      lastName,
      referralCode: newReferralCode,
      referredBy,
    });

    await newUser.save();

    try {
      await this.mailService.sendSignupMail(
        email,
        firstName,
        lastName,
        password,
      );
    } catch (error) {
      throw new Error(`Failed to send email to ${email}`);
    }

    return {
      userId: newUser._id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      country: newUser.country,
      password: newUser.password,
    };
  }

  async login(credentials: LoginDto) {
    const { email, password } = credentials;
    //Find if user exists by email
    const user = await this.UserModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Email not found');
    }

    //Compare entered password with existing password
    const passwordMatch = await this.UserModel.findOne({ password });
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    //Generate JWT tokens
    try {
      await this.mailService.sendLoginMail(
        user.email,
        user.firstName,
        user.lastName,
        user.password,
      );
    } catch (error) {
      throw new Error(`Failed to send email to ${email}`);
    }
    return {
      userId: user._id,
      email: user.email,
      // isAdmin: user.isAdmin,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      country: user.country,
    };
  }

  async findOne(id: string): Promise<any> {
    const user = await this.UserModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
  async findAll(): Promise<any> {
    try {
      const user = await this.UserModel.find().sort({ createdAt: -1 }).exec();
      return user;
    } catch (error) {
      return { error: error.message };
    }
  }
  async remove(id: string) {
    const deleteUser = await this.UserModel.findByIdAndDelete(id);
    if (!deleteUser) {
      throw new BadRequestException('User not found');
    }
    return { message: 'User Deleted' };
  }
  createNew(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
}

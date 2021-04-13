import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoIdDto } from 'src/common/dto/mongoId.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}
  async create(createUserDto: CreateUserDto, file: Express.Multer.File): Promise<string> {
    // check the username and phone number entered to be unique
    await this.checkUserPreExistence(createUserDto);

    if (createUserDto.avatar == '') delete createUserDto.avatar;

    if (file) Object.assign(createUserDto, { avatar: file.filename });

    await this.userModel.create({ verified: true, ...createUserDto });

    return 'user created successfully';
  }

  async findAll(): Promise<UserDocument[]> {
    return await this.userModel.find();
  }

  async findOne(mongoIdDto: MongoIdDto): Promise<UserDocument> {
    const user = await this.userModel.findById(mongoIdDto.id);

    if (!user) throw new NotFoundException('user not found');

    return user;
  }

  async update(
    mongoIdDto: MongoIdDto,
    updateUserDto: UpdateUserDto,
    file: Express.Multer.File,
  ): Promise<string> {
    const user = await this.findOne(mongoIdDto);
    if (updateUserDto.phoneNumber || updateUserDto.username)
      await this.checkUserPreExistence(updateUserDto);

    if (updateUserDto.avatar == '') delete updateUserDto.avatar;

    if (file) Object.assign(updateUserDto, { avatar: file.filename });

    await user.updateOne(updateUserDto);

    return 'user information updated successfully';
  }

  async remove(mongoIdDto: MongoIdDto): Promise<string> {
    const user = await this.findOne(mongoIdDto);

    await user.deleteOne();

    return 'user removed successfully';
  }

  //* PRIVATE METHODS
  private async checkUserPreExistence(userDto) {
    const { username, phoneNumber } = userDto;

    const user = await this.userModel.findOne({ $or: [{ username }, { phoneNumber }] });

    if (user)
      throw new BadRequestException(
        'the entered username or phone number already exists ',
      );
  }
}

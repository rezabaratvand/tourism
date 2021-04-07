import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/modules/users/schema/user.schema';
import adminDetails from '../common/constants/superadmin-details.const';

@Injectable()
export class DataGeneratorService implements OnModuleInit {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}
  async onModuleInit() {
    await this.generateSuperAdmin();
  }

  //! PRIVATE METHODS
  private async generateSuperAdmin() {
    const superAdmin = await this.userModel.findOne({ username: adminDetails.username });

    if (!superAdmin) {
      await this.userModel.create(adminDetails);

      Logger.verbose('superadmin generated successfully');
    }
  }
}

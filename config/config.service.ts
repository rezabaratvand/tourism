import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private readonly envConfig;
  constructor(
    @Inject('CONFIG_OPTIONS') private readonly options: { folder: string },
  ) {
    const filePath = `${process.env.NODE_ENV || 'development'}.env`;
    const envFile = path.resolve(
      __dirname,
      '../../../',
      options.folder,
      filePath,
    );

    this.envConfig = dotenv.parse(fs.readFileSync(envFile));
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}

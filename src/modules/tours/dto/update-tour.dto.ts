import { CreateTourDto } from './create-tour.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateTourDto
  extends PartialType(CreateTourDto)
  implements Partial<CreateTourDto> {}

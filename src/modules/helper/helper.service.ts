import { Injectable } from '@nestjs/common';
import { FilterQueryDto } from 'src/common/dto/filter-query.dto';
import { promisify } from 'util';

@Injectable()
export class HelperService {
  async findAll(
    model,
    filterQueryDto: FilterQueryDto,
    populate: Array<string> = [''],
    query?: object,
  ): Promise<any> {
    //! promisifying paginate() method
    model.paginate = promisify(model.paginate);

    const queryObject = { ...filterQueryDto };

    //! ignore excluded fields from queryObject
    const fieldsToExclude = ['sort', 'limit', 'page'];
    fieldsToExclude.forEach(el => delete queryObject[el]);

    //! filtering
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|ne)\b/g, match => `$${match}`);

    //! sorting
    let sortBy = '-_id'; // default sort by id(latest doc comes first)
    if (filterQueryDto.sort) sortBy = filterQueryDto.sort.split(',').join(' ');

    //! paginating
    const page = +filterQueryDto.page || 1;
    const limit = +filterQueryDto.limit || 20;

    //! options
    const options = { sort: sortBy, page, limit, populate };

    return await model.paginate({ ...query, ...JSON.parse(queryStr) }, options);
  }
}

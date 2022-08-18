import { Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryErrorFilter extends BaseExceptionFilter {
  public catch(exception: any, host: ArgumentsHost): void {
    const detail = exception.message;
    if (typeof detail === 'string' && detail.includes('Duplicate entry')) {
      // $table entity with ($field)=($value) already exists.
      let [table] = detail.match(/'[a-zA-Z]+\./);
      table = table.replace(/'|\./g, '');
      let [field] = detail.match(/\.(.)*'/);
      field = field.replace(/'|\./g, '');
      let [value] = detail.match(/'[^']*'/);
      value = value.replace(/'|\./g, '');
      exception = new BadRequestException(
        `${table} entity with (${field})=(${value}) already exists.`,
      );
    }
    return super.catch(exception, host);
  }
}

import {
  isString,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

export function IsSlug(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsUserName',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message:
          'Invalid site name. Please enter a site name with only letters, numbers, and dashes.',
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return isString(value) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
        },
      },
    });
  };
}

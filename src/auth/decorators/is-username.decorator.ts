import {
  registerDecorator,
  ValidationOptions,
  isEmail,
  isPhoneNumber,
} from 'class-validator';

export function IsUserName(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsUserName',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'Invalid user name. Please enter an email or a phone number',
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return isEmail(value) || isPhoneNumber(value);
        },
      },
    });
  };
}

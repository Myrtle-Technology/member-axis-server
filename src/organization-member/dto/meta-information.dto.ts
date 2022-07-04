export type MetaInformationType =
  | 'text'
  | 'date'
  | 'datetime'
  | 'number'
  | 'boolean'
  | 'select'
  | 'file';

export class MetaInformation {
  name: string;

  type: MetaInformationType = 'text';

  value?: any;

  options?: string[] | { key: string; value: string }[] = [];

  required? = false;
  [key: string]: any;

  constructor({
    name,
    type,
    value,
    options,
    required,
  }: Partial<MetaInformation>) {
    this.name = name;
    this.type = type;
    this.value = value;
    this.options = options?.length ? options : [];
    this.required = required;
  }
}

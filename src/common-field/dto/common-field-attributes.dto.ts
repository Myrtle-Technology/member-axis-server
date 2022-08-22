export class CommonFieldAttributes {
  min?: number;
  max?: number;
  disabled?: number;
  [key: string]: any;

  constructor(data?: Partial<CommonFieldAttributes>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

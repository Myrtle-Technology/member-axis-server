export class CommonFieldAttributes {
  min?: number;
  max?: number;
  hidden?: boolean;
  [key: string]: any;

  constructor(data?: Partial<CommonFieldAttributes>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

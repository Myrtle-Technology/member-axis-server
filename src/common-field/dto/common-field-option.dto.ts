export class CommonFieldOption {
  label: string;
  value: any;

  constructor(data?: Partial<CommonFieldOption>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

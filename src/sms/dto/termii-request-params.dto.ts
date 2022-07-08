export class TermiiRequestParams {
  to: string;
  from: string;
  sms: string;
  type: string;
  channel: string;
  api_key: string;
  media?: Media;
  pin: string;
  pin_id: string;
  pin_attempts?: number;
  pin_time_to_live?: number;
  pin_length?: number;
  pin_placeholder?: string;
  message_text?: string;
  pin_type?: string;
  message_type?: string;

  constructor(payload: Partial<TermiiRequestParams>) {
    Object.assign(this, payload);
  }

  toString() {
    return JSON.stringify(this);
  }
}

export interface Media {
  url: string;
  caption: string;
}

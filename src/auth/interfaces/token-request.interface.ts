import { Request } from 'express';
import { TokenData } from '../dto/token-data.dto';

export interface TokenRequest extends Request {
  tokenData: TokenData;
}

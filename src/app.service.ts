import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return "Testing auto deployment to the dev environment";
  }
}

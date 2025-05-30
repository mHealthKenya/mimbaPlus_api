import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return "Docker build successful! Welcome to the NestJS application.";
  }
}

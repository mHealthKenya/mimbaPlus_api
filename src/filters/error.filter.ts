import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class CustomErrorFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      error?.response?.message || error?.message || 'Internal server error';

    switch (error?.response?.code) {
      case 'P2002':
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: error.response.meta.target[0] + ' already exists',
        });
        break;

      case 'P2025':
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: 'Record not found',
        });
        break;

      case 'P2016':
      case 'P2017':
      case 'P2018':
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: 'Invalid data',
        });
        break;

      case 'P2016':
      case 'P2017':
      case 'P2018':
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: 'Invalid data',
        });
        break;

      default:
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message,
        });
        break;
    }
  }
}

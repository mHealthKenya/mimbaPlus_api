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
      case '1000':
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: 'Authentication failed against database server',
        });
        break;

      case '1001':
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: "Can't reach database server",
        });
        break;

      case '1002':
      case '1008':
      case '2024':
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: 'Connection timeout',
        });
        break;

      case '1003':
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: 'Invalid database connection',
        });
        break;

      case '1009':
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: 'Duplicate error',
        });
        break;

      case '1010':
      case '1011':
      case '1013':
      case '1017':
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: 'Invalid connection',
        });
        break;

      case '1012':
      case '1015':
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: 'Upgrade error',
        });
        break;

      case '1014':
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: 'Invalid model',
        });
        break;

      case '1016':
      case '2000':
      case '2005':
      case '2006':
      case '2007':
      case '2009':
      case '2010':
      case '2011':
      case '2012':
      case '2013':
      case '2016':
      case '2019':
      case '2020':
      case '2021':
      case '2022':
      case '2023':
      case '2026':
      case '2027':
      case '2028':
      case '2030':
      case '2031':
      case '2033':
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: 'Invalid input',
        });
        break;

      case '2001':
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: 'Not found exception',
        });
        break;

      case 'P2002':
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: error.response.meta.target[0] + ' already exists',
        });
        break;

      case 'P2003':
      case 'P2004':
      case 'P2014':
      case '2017':
      case '2018':
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: 'Could not complete request due to relationship conflicts',
        });
        break;

      case 'P2015':
      case 'P2025':
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: 'Related record could not be found',
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

      case 'P2034':
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: 'Transaction failed',
        });
        break;

      default:
        switch (error?.response?.name) {
          case 'PrismaClientUnknownRequestError':
            response.status(status).json({
              statusCode: status,
              timestamp: new Date().toISOString(),
              path: request.url,
              message:
                'PrismaClientUnknownRequestError. Please check db connection.',
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
}

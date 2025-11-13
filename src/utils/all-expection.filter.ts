import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
import { MyLoggerService } from 'src/my-logger/my-logger.service';
import ErrorHandler from './error-handler';

type MyResponseObj = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
};

// err.statusCode = err.statusCode || 500;
// err.message = err.message || 'Internal server error';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new MyLoggerService(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const myResponseObj: MyResponseObj = {
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: '',
    };

    // Add more Prisma Error Types if you want
    if (exception instanceof HttpException) {
      myResponseObj.statusCode = exception.getStatus();
      myResponseObj.response = exception.getResponse();
    } else if (exception instanceof PrismaClientValidationError) {
      myResponseObj.statusCode = 422;
      myResponseObj.response = exception.message.replaceAll(/\n/g, ' ');
    } else if (exception instanceof PrismaClientKnownRequestError) {
      // Handle duplicate key error
      if (exception.code === 'P2002' && exception) {
        const message = `Duplicate field error: ${Object.keys(exception?.meta?.target as any).join(', ')}`;
        myResponseObj.response = new ErrorHandler(message, 400);
      }

      // Handle foreign key constraint violation
      if (exception.code === 'P2003' && exception) {
        const message = `Foreign key constraint failed: ${exception.meta?.target}`;
        myResponseObj.response = new ErrorHandler(message, 400);
      }

      // Handle invalid data or failed query (e.g., not found errors)
      if (exception.code === 'P2025' && exception) {
        const message = `Resource not found. Invalid: ${exception?.meta?.target}`;
        myResponseObj.response = new ErrorHandler(message, 400);
      }

      // Handle other Prisma known request errors
      if (exception.code === 'P2010') {
        const message = `Invalid data provided for query: ${exception.meta?.query}`;
        myResponseObj.response = new ErrorHandler(message, 400);
      }

      // Handle other Prisma-specific errors
      if (exception.code === 'P2023') {
        const message = `Invalid operation: ${exception.meta?.operation}`;
        myResponseObj.response = new ErrorHandler(message, 400);
      }

      // myResponseObj.statusCode = 400;
      // const fieldName = exception.meta?.target || 'unique constraint';
      // const message = `A record with this ${fieldName} already exists.`;
      // myResponseObj.response = fieldName
      //   ? message
      //   : exception.message.replaceAll(/\n/g, ' ');
    } else if (exception instanceof PrismaClientUnknownRequestError) {
      // Handle Prisma Unknown Request errors
      const message = 'An unknown Prisma error occurred';
      myResponseObj.response = new ErrorHandler(message, 500);
    } else {
      myResponseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      myResponseObj.response = 'Internal Server Error';
    }

    response.status(myResponseObj.statusCode).json(myResponseObj);

    this.logger.error(myResponseObj.response, AllExceptionsFilter.name);

    super.catch(exception, host);
  }
}

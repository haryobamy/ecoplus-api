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
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { MyLoggerService } from 'src/my-logger/my-logger.service';

type ErrorResponse = {
  success: false;
  statusCode: number;
  error: string;
  message: string | string[];
  timestamp: string;
  path: string;
  method: string;
  requestId: string;
  details?: unknown;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new MyLoggerService(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId =
      (request.headers['x-request-id'] as string) || randomUUID();
    const timestamp = new Date().toISOString();

    const errorPayload = this.buildErrorPayload(
      exception,
      request,
      requestId,
      timestamp,
    );

    response.status(errorPayload.statusCode).json(errorPayload);

    if (!this.shouldSuppressLog(request, errorPayload.statusCode)) {
      const stack =
        exception instanceof Error ? exception.stack : JSON.stringify(exception);
      this.logger.error(
        `[${requestId}] ${request.method} ${request.url} -> ${errorPayload.statusCode} :: ${errorPayload.message}`,
        stack,
      );
    }
  }

  private buildErrorPayload(
    exception: unknown,
    request: Request,
    requestId: string,
    timestamp: string,
  ): ErrorResponse {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';
    let message: string | string[] = 'An unexpected error occurred';
    let details: unknown = undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const response = exception.getResponse();
      if (typeof response === 'string') {
        message = response;
      } else if (typeof response === 'object') {
        const resObj = response as Record<string, any>;
        message = this.extractMessage(resObj.message ?? message);
        error = resObj.error ?? exception.name;
        details = resObj.details;
      }
    } else if (exception instanceof PrismaClientValidationError) {
      statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
      error = 'ValidationError';
      message = exception.message.replace(/\n/g, ' ');
    } else if (exception instanceof PrismaClientKnownRequestError) {
      const prismaError = this.transformPrismaKnownError(exception);
      statusCode = prismaError.statusCode;
      error = prismaError.error;
      message = prismaError.message;
      details = prismaError.details;
    } else if (exception instanceof PrismaClientUnknownRequestError) {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      error = 'PrismaUnknownError';
      message = 'An unknown database error occurred';
    } else if (exception instanceof Error) {
      message = exception.message || message;
      error = exception.name || error;
      details = this.isDevelopment()
        ? { stack: exception.stack }
        : undefined;
    }

    return {
      success: false,
      statusCode,
      error,
      message,
      timestamp,
      path: request.url,
      method: request.method,
      requestId,
      ...(details ? { details } : {}),
    };
  }

  private transformPrismaKnownError(exception: PrismaClientKnownRequestError) {
    const base = {
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'DatabaseError',
      message: 'A database error occurred',
      details: {
        code: exception.code,
        meta: exception.meta,
      },
    };

    switch (exception.code) {
      case 'P2002':
        return {
          ...base,
          message: `Duplicate value for ${exception.meta?.target}`,
        };
      case 'P2003':
        return {
          ...base,
          message: this.formatForeignKeyMessage(exception),
        };
      case 'P2025':
        return {
          ...base,
          statusCode: HttpStatus.NOT_FOUND,
          error: 'NotFound',
          message:
            (exception.meta?.cause as string) ||
            'The requested resource could not be found',
        };
      case 'P2010':
        return {
          ...base,
          message: `Invalid data provided for query`,
        };
      case 'P2023':
        return {
          ...base,
          message: `Invalid operation: ${exception.meta?.operation}`,
        };
      default:
        return base;
    }
  }

  private isDevelopment() {
    return process.env.NODE_ENV !== 'production';
  }

  private shouldSuppressLog(request: Request, statusCode: number) {
    const suppressedPaths = ['/service-worker.js'];
    return statusCode === HttpStatus.NOT_FOUND &&
      suppressedPaths.includes(request.path)
      ? true
      : false;
  }

  private extractMessage(message: unknown): string {
    if (Array.isArray(message)) {
      return message
        .filter((value) => typeof value === 'string')
        .join('; ');
    }
    if (typeof message === 'string') {
      return message;
    }
    if (message && typeof message === 'object') {
      if ('message' in message) {
        return this.extractMessage((message as any).message);
      }
    }
    return 'We could not process your request at this time.';
  }

  private formatForeignKeyMessage(
    exception: PrismaClientKnownRequestError,
  ): string {
    const target = (exception.meta?.target as string) ?? '';
    if (!target) return 'One of the referenced records does not exist.';

    const cleaned = target
      .replace(/[_-]fkey$/i, '')
      .replace(/_/g, ' ')
      .replace(/product/gi, 'product');

    return `The related record for "${cleaned.trim()}" does not exist. Please create it first or use a valid identifier.`;
  }
}

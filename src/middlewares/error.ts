import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';

export function handlePrismaError(error: any) {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': // Unique constraint failed
        return new BadRequestException(
          `Duplicate field value for: ${(error.meta?.target as string[])?.join(', ')}`,
        );

      case 'P2003': // Foreign key constraint failed
        return new BadRequestException(
          `Foreign key constraint failed on: ${error.meta?.target}`,
        );

      case 'P2025': // Record not found
        return new NotFoundException(
          `Resource not found or invalid: ${error.meta?.target ?? 'Record'}`,
        );

      case 'P2010': // Invalid data for query
        return new BadRequestException(
          `Invalid data provided for query: ${error.meta?.query}`,
        );

      case 'P2023': // Invalid operation
        return new BadRequestException(
          `Invalid operation: ${error.meta?.operation}`,
        );

      default:
        return new BadRequestException(`Database error: ${error.message}`);
    }
  }

  if (error instanceof PrismaClientUnknownRequestError) {
    return new InternalServerErrorException('An unknown Prisma error occurred');
  }

  // Any other non-Prisma error
  return new InternalServerErrorException(error.message || 'Unexpected error');
}

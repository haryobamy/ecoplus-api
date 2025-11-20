import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user (admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fullName: { type: 'string', example: 'Jane Doe' },
        email: { type: 'string', format: 'email', example: 'jane@example.com' },
        phone: { type: 'string', example: '08039433746' },
        password: { type: 'string', example: 'Password123#' },
        role: {
          type: 'string',
          enum: ['ADMIN', 'MANAGER', 'CUSTOMER'],
          example: 'CUSTOMER',
        },
      },
      required: ['fullName', 'email', 'password'],
    },
  })
  @ApiOkResponse({ description: 'User created successfully' })
  create(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch a paginated list of users' })
  @ApiQuery({
    name: 'role',
    required: false,
    description: 'Filter users by role',
    enum: ['ADMIN', 'MANAGER', 'CUSTOMER'],
  })
  @ApiOkResponse({ description: 'Users retrieved successfully' })
  findAll(@Query('role') role?: string) {
    return this.usersService.findAll(role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single user by id' })
  @ApiParam({
    name: 'id',
    description: 'User identifier',
    example: '8f4a5f5a-0c82-4c0d-8c8b-6c5e2a7e4d11',
  })
  @ApiOkResponse({ description: 'User retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiParam({
    name: 'id',
    description: 'User identifier',
    example: '8f4a5f5a-0c82-4c0d-8c8b-6c5e2a7e4d11',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fullName: { type: 'string' },
        phone: { type: 'string' },
        role: { type: 'string', enum: ['ADMIN', 'MANAGER', 'CUSTOMER'] },
        isActive: { type: 'boolean' },
      },
    },
  })
  @ApiOkResponse({ description: 'User updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({
    name: 'id',
    description: 'User identifier',
    example: '8f4a5f5a-0c82-4c0d-8c8b-6c5e2a7e4d11',
  })
  @ApiOkResponse({ description: 'User removed successfully' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

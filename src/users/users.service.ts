import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt-ts';
import { DatabaseService } from 'src/database/database.service';
import { MailerService } from 'src/mailer/mailer.service';
import { handlePrismaError } from 'src/middlewares/error';

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private mailerService: MailerService,
  ) {}
  async create(createUserDto: Prisma.UserCreateInput) {
    try {
      console.log(createUserDto);
      const reqBod = createUserDto;

      const password = await hash(createUserDto.password, 10);
      const newUser: Prisma.UserCreateInput = {
        ...createUserDto,
        password: password,
      };

      const data = await this.databaseService.user.create({
        data: { ...newUser },
      });

      return {
        data: { ...data },
        message: 'User created successfully',
        status: true,
      };
    } catch (error) {
      const handledError = handlePrismaError(error);
      console.log(error);
      throw handledError;
    }
  }

  async findAll(role?: string) {
    try {
      const where: Prisma.UserWhereInput = {};
      if (role) {
        where.role = role as any;
      }

      const users = await this.databaseService.user.findMany({
        where,
      });

      return {
        data: users,
        message: 'Users retrieved successfully',
        status: true,
      };
    } catch (error) {}
  }

  async findOne(id: string) {
    return await this.databaseService.user.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateUserDto: Prisma.UserUpdateInput) {
    return await this.databaseService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    return await this.databaseService.user.delete({
      where: { id },
    });
  }

  async sendVerificationOtpEmail(params: {
    recipients: any;
    subject?: string;
    template?: string;
    data?: Record<string, any>;
  }) {
    // Implementation for sending verification OTP email
    try {
      await this.mailerService.sendEmail({
        recipients: [...params.recipients],
        subject: params.subject || '',
        template: params?.template || '',
        data: params?.data || {},
      });
    } catch (error) {}
  }
}

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
      const newUser: Prisma.UserCreateInput = {
        ...createUserDto,
        passwordHash: await hash(createUserDto.passwordHash, 10),
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

  async findAll(role?: Prisma.EnumUserRoleFilter<'User'>) {
    try {
      const users = await this.databaseService.user.findMany({
        where: role ? { role } : {},
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

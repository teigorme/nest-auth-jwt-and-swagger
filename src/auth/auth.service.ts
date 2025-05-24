import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Auth } from './entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { Payload } from 'src/types/payload';
import { Sub } from 'src/types/sub';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  async validation(createAuthDto: CreateAuthDto): Promise<Auth> {
    const user = await this.prisma.user.findUnique({
      where: { email: createAuthDto.email },
    });

    if (!user || !(await bcrypt.compare(createAuthDto.password, user.password)))
      throw new BadRequestException();

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    } as Payload;

    const prop = { sub: user.id } as Sub;

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(prop, {
        expiresIn: '7d',
        secret: process.env.REFRESH_TOKEN,
      }),
    };
  }

  async refreshToken(refreshTokenDto: string): Promise<Auth> {
    try {
      const { sub } = (await this.jwtService.verifyAsync(refreshTokenDto, {
        secret: process.env.REFRESH_TOKEN,
      })) as Sub;

      const user = await this.prisma.user.findUnique({
        where: { id: sub },
      });
      if (!user) throw new BadRequestException();

      const payload = {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      } as Payload;

      const prop = { sub: user.id } as Sub;

      return {
        accessToken: await this.jwtService.signAsync(payload),
        refreshToken: await this.jwtService.signAsync(prop, {
          expiresIn: '7d',
          secret: process.env.REFRESH_TOKEN,
        }),
      };
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async update(id: string, updateAuthDto: UpdateUserDto): Promise<User> {
    return await this.usersService.update(id, updateAuthDto);
  }

  async remove(id: string): Promise<User> {
    return await this.usersService.remove(id);
  }
}

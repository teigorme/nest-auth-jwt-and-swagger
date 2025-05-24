import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { HttpError } from 'src/types/http-error';
import { Auth } from './entities/auth.entity';
import { Request, Response } from 'express';
import { Public } from './auth.decorator';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiResponse({ status: 201, type: User })
  @ApiResponse({ status: 400, type: HttpError })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.create(createUserDto);
  }

  @Post('login')
  @Public()
  @ApiResponse({ status: 201, type: Auth })
  @ApiResponse({ status: 401, type: HttpError })
  async validation(
    @Body() createAuthDto: CreateAuthDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Auth> {
    const tokens = await this.authService.validation(createAuthDto);

    response.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refresh-token',
    });

    return tokens;
  }

  @Post('refresh-token')
  @Public()
  @ApiResponse({ status: 201, type: Auth })
  @ApiResponse({ status: 401, type: HttpError })
  async refreshToken(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<Auth> {
    const tokens = await this.authService.refreshToken(
      request.cookies?.refreshToken,
    );

    response.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refresh-token',
    });

    return tokens;
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({ status: 404, type: HttpError })
  async update(
    @Param('id') id: string,
    @Body() updateAuthDto: UpdateUserDto,
  ): Promise<User> {
    return await this.authService.update(id, updateAuthDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({ status: 404, type: HttpError })
  async remove(@Param('id') id: string): Promise<User> {
    return await this.authService.remove(id);
  }
}

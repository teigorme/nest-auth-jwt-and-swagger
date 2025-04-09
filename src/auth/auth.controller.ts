import {
  Controller,
  Get,
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
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { HttpError } from 'src/types/http-error';
import { Auth } from './entities/auth.entity';
import { Request, Response } from 'express';
import { Public } from './auth.decorator';

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
    response.cookie('token', tokens.access_token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
      sameSite: 'lax',
      path: '/',
    });

    response.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      path: '/api/refresh-token',
    });

    return tokens;
  }

  @Post('refresh-token')
  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: Auth })
  @ApiResponse({ status: 401, type: HttpError })
  async refreshToken(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<Auth> {
    const tokens = await this.authService.refreshToken(
      request.cookies?.refresh_token,
    );

    response.cookie('token', tokens.access_token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
      sameSite: 'lax',
      path: '/',
    });

    response.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      path: '/api/refresh-token',
    });
    return tokens;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}

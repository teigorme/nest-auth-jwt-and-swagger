import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { HttpError } from 'src/types/http-error';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: User })
  @ApiResponse({ status: 400, type: HttpError })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({ status: 404, type: HttpError })
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({ status: 404, type: HttpError })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({ status: 404, type: HttpError })
  async remove(@Param('id') id: string): Promise<User> {
    return await this.usersService.remove(id);
  }
}

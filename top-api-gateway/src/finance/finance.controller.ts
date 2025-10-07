import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { FinanceService } from './finance.service';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post()
  async create(@Body() createFinanceDto: CreateFinanceDto) {
    try {
      return await this.financeService.create(createFinanceDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create finance record',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(@Query('userId') userId?: string) {
    try {
      return await this.financeService.findAll(
        userId ? parseInt(userId, 10) : undefined,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch finance records',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    try {
      return await this.financeService.findByUser(userId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch finance records for user',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.financeService.findOne(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Finance record not found',
        error.status || HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFinanceDto: UpdateFinanceDto,
  ) {
    try {
      return await this.financeService.update(id, updateFinanceDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update finance record',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.financeService.remove(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete finance record',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

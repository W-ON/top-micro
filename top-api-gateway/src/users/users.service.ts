import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return firstValueFrom(
      this.usersClient.send({ cmd: 'create_user' }, createUserDto),
    );
  }

  async findAll(params?: { page?: number; limit?: number; search?: string }) {
    return firstValueFrom(
      this.usersClient.send({ cmd: 'list_users' }, params || {}),
    );
  }

  async findOne(id: string) {
    return firstValueFrom(
      this.usersClient.send({ cmd: 'find_one_user' }, { id }),
    );
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return firstValueFrom(
      this.usersClient.send({ cmd: 'update_user' }, { id, ...updateUserDto }),
    );
  }

  async remove(id: string) {
    return firstValueFrom(
      this.usersClient.send({ cmd: 'remove_user' }, { id }),
    );
  }
}

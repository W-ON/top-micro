import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository.interface';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user || user.isDeleted) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return user;
  }
}

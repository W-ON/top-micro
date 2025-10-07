import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { Address } from '../../domain/value-objects/address.value-object';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository.interface';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    // Verificar se email já existe
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser && !existingUser.isDeleted) {
      throw new ConflictException('Email já cadastrado');
    }

    const address = new Address(
      dto.rua,
      dto.numero,
      dto.bairro,
      dto.complemento || '',
      dto.cidade,
      dto.estado,
      dto.cep,
    );

    const user = User.create(dto.nome, dto.email, address, dto.status);

    return await this.userRepository.create(user);
  }
}

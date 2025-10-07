import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { Address } from '../../domain/value-objects/address.value-object';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository.interface';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user || user.isDeleted) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    // Atualizar apenas os campos fornecidos
    const updatedAddress = new Address(
      dto.rua ?? user.address.rua,
      dto.numero ?? user.address.numero,
      dto.bairro ?? user.address.bairro,
      dto.complemento ?? user.address.complemento,
      dto.cidade ?? user.address.cidade,
      dto.estado ?? user.address.estado,
      dto.cep ?? user.address.cep,
    );

    user.updateInfo(
      dto.nome ?? user.nome,
      dto.email ?? user.email,
      updatedAddress,
      dto.status ?? user.status,
    );

    return await this.userRepository.update(id, user);
  }
}

import { Injectable, NotAcceptableException } from '@nestjs/common';
import { ResponseDto } from 'src/common/dto/common.dto';
import { AuthRepository } from './repository/auth.repository';
import * as bcrpyt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async checkNickname(nickname: string): Promise<ResponseDto> {
    const exNicknameId = await this.authRepository.checkNickname(nickname);

    if (exNicknameId)
      throw new NotAcceptableException('이미 존재하는 닉네임 입니다.');

    return { success: true, message: '사용 가능한 닉네임 입니다.' };
  }

  async registerUser(
    nickname: string,
    email: string,
    password: string,
  ): Promise<ResponseDto> {
    await this.checkNickname(nickname);
    const saltOrRounds = +process.env.HASH;
    console.log(typeof saltOrRounds);
    const hashedPassword = await bcrpyt.hash(password, saltOrRounds);
    await this.authRepository.registerUser(nickname, email, hashedPassword);
    return {
      success: true,
      message: '회원가입 완료, 이메일 인증이 필요합니다.',
    };
  }
}

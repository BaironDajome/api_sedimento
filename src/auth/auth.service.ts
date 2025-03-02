import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs'
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ){}

  async register(registerDto:RegisterDto){
    console.log(registerDto);
    
    const user = await this.userService.findOneByEmail(registerDto.email); 
    
    if(user){
      throw new BadRequestException("User ya existe");
    }
    
    registerDto.password = await bcryptjs.hash(registerDto.password,10);
    await this.userService.create(registerDto);

    const {name,email} = registerDto;
    return {
      name,
      email
    }
  }
   
  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneEmailConPassword(loginDto.email);
  
    if (!user) {
      throw new UnauthorizedException("Las credenciales no son correctas");
    }
  
    const isPasswordValid = await bcryptjs.compare(loginDto.password, user.password);
    if (!isPasswordValid) { 
      throw new UnauthorizedException("Las credenciales no son correctas");
    }
  
    const payload = { email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload); 
  
    return {
      token,
      email: user.email,
    };
  }

  async perfil({email,role}:{email:string,role:string}) {
    return await this.userService.findOneByEmail(email);
  }
}

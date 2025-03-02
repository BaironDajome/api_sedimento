import { Body, Controller, Get,Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../common/enums/rol.enum';
import { Auth } from './decorators/auth.decorator';
import { ActiveUser } from './decorators/active-user.decprator';
import { ActiveUserInterface } from 'src/common/interfaces/user-active.interface';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';

@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post("register")
  register(@Body() registerDto: RegisterDto) {
    console.log(registerDto);
    
    return this.authService.register(registerDto);
  }

  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // @Get("perfil")
  // @Roles(Role.ADMIN)
  // @UseGuards(AuthGuard,RolesGuard)
  // perfil(@Request() req: RequestAuthUser){
  //   return req.user;
  // }

  @Get("perfil")
  @Auth(Role.CIENTIFICO,Role.ADMIN)
  perfil(@ActiveUser() user:ActiveUserInterface) {
    return this.authService.perfil(user);
  }
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../common/enums/rol.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!role) {
      return false;
    }

    const { user } = context.switchToHttp().getRequest();

    console.log(`Roles permitidos: ${role}`);
    console.log(`Rol del usuario: ${user.role}`);

    // Verifica si el usuario tiene al menos uno de los roles permitidos
    return role.includes(user.role);
    
  }
}

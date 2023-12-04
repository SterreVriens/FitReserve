import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      // If roles are not explicitly defined, deny access
      return false;
    }

    const { user } = context.switchToHttp().getRequest();
    console.log(user);

    if (!user || !user.roles) {
      // If user or user roles are not defined, deny access
      throw new UnauthorizedException();
    }

    return requiredRoles.some((Role) => user.roles.includes(Role));
  }
}

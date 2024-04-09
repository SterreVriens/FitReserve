
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { jwtConstants } from './constants';
  import { Request } from 'express';
  import { Reflector } from "@nestjs/core";
  import { IS_PUBLIC_KEY } from "./decorators/public.decorator";
  
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    // Injecteer de JwtService en Reflector in de constructor
    constructor(private jwtService: JwtService, private reflector: Reflector) {}
  
    // Implementeer de canActivate methode van CanActivate interface
    async canActivate(context: ExecutionContext): Promise<boolean> {
      // Haal de waarde van IS_PUBLIC_KEY op van de metadata van de huidige route-handler of controller
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      // Als de route als openbaar is gemarkeerd, geef true terug
      if (isPublic) {
        return true;
      }
  
      // Als de route niet als openbaar is gemarkeerd, voer de authenticatiecontrole uit
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
  
      // Als er geen geldig token aanwezig is, gooi een UnauthorizedException
      if (!token) {
        throw new UnauthorizedException();
      }
  
      // Probeer het JWT-token te verifiëren
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: jwtConstants.secret,
        });
        // Als het token geldig is, voeg het payload (gebruikersinformatie) toe aan het request object
        request['user'] = payload;
      } catch {
        // Als er een fout optreedt bij de verificatie, gooi een UnauthorizedException
        throw new UnauthorizedException();
      }
  
      // Als alles goed gaat, geef true terug om de toegang toe te staan
      return true;
    }
  
    // JWT-token uit de Authorization-header van het verzoek te halen
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }
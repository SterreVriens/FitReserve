/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, IUser } from '@fit-reserve/shared/api';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';


/**
 * See https://angular.io/guide/http#requesting-data-from-a-server
 */
export const httpOptions = {
    observe: 'body',
    responseType: 'json',
};

/**
 *
 *
 */
@Injectable()
export class AuthService {
    private jwtHelper: JwtHelperService = new JwtHelperService();
    endpoint = 'http://localhost:3000/api/auth';

    constructor(private readonly http: HttpClient) {}

    login(user: IUser | null, options?: any): Observable<IUser> {
      const url = `${this.endpoint}/login`;

      return this.http.post<ApiResponse<IUser>>(url, user, { ...httpOptions, ...options }).pipe(
          map((response: any) => {
              return response.results as IUser;
          }),
          tap(console.log),
          catchError(this.handleError)
      );
  }

    public register(user: IUser | null, options?: any): Observable<IUser> {
        const url = `${this.endpoint}/register`;
        console.log(`register - ${url}`);
        console.log(user);
    
        return this.http
            .post<ApiResponse<IUser>>(url, user, { ...httpOptions, ...options })
            .pipe(
                map((response: any) => response.results as IUser),
                tap(console.log),
                catchError(this.handleError)
            );
    }

    public getProfile(options?: any): Observable<IUser> {
        const url = `${this.endpoint}/profile`;
        return this.http
          .get<ApiResponse<IUser>>(url, { ...httpOptions, ...options })
          .pipe(
            map((response: any) => response.results as IUser),
            tap(console.log),
            catchError(this.handleError)
          );
    }

    getUserIdFromToken(): string | null {
      const token = sessionStorage.getItem('access_token');
      if (token) {
          const decodedToken = this.jwtHelper.decodeToken(token);
          return decodedToken.sub; // Assuming 'sub' is the property containing the user ID
      }
      return null;
    }
    getAccessToken(): string | null {
      return sessionStorage.getItem('access_token');
    }

    getToken(): string | null {
        return this.getAccessToken();
    }
    // public  setAccessToken(token: string): void {
    //     localStorage.setItem('access_token', token);
    //   }
    
    // public  getAccessToken(): string | null {
    //     return localStorage.getItem('access_token');
    //   }

    // public  getPayloadFromToken(token: string): any {
    //     return this.jwtHelper.decodeToken(token);
    //   }

    public handleError(error: HttpErrorResponse): Observable<any> {
        console.log('handleError in authService', error);

        return throwError(() => new Error(error.message));
    }
}


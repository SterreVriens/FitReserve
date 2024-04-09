/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, IUser, Role } from '@fit-reserve/shared/api';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@fit-reserve/shared/environment';


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
    endpoint = `${environment.dataApiUrl}/api/auth`;

    constructor(private readonly http: HttpClient) {}

    login(user: IUser | null, options?: any): Observable<IUser> {
      const url = `${this.endpoint}/login`;

      return this.http.post<ApiResponse<IUser>>(url, user, { ...httpOptions, ...options }).pipe(
          map((response: any) => {
              return response.results as IUser;
          }),
          tap(),
          catchError(this.handleError)
      );
  }

    public register(user: IUser | null, options?: any): Observable<IUser> {
        const url = `${this.endpoint}/register`;
    
        return this.http
            .post<ApiResponse<IUser>>(url, user, { ...httpOptions, ...options })
            .pipe(
                map((response: any) => response.results as IUser),
                tap(),
                catchError(this.handleError)
            );
    }

    public getProfile(options?: any): Observable<IUser> {
        const url = `${this.endpoint}/profile`;

        const token = sessionStorage.getItem('access_token'); // Get the token from session storage
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Set the token in the Authorization header
        });

        return this.http
          .get<ApiResponse<IUser>>(url, { ...httpOptions, ...options,headers })
          .pipe(
            map((response: any) => response.results as IUser),
            tap(),
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
    getUserRoleFromToken(): Role | null {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            const decodedToken = this.jwtHelper.decodeToken(token);
            return decodedToken.Role; 
        }
        return null;
      }
    getAccessToken(): string | null {
      return sessionStorage.getItem('access_token');
    }

    getToken(): string | null {
        return this.getAccessToken();
    }

    public handleError(error: HttpErrorResponse): Observable<any> {

        return throwError(() => new Error(error.message));
    }
}


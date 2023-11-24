/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, IUser } from '@fit-reserve/shared/api';
import { Injectable } from '@angular/core';

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
    endpoint = 'http://localhost:3000/api/auth';

    constructor(private readonly http: HttpClient) {}

    public login(user: IUser | null, options?: any): Observable<IUser> {
        const url = `${this.endpoint}/login`;
        console.log(`login - ${url}`);
        console.log(user);
    
        return this.http
            .post<ApiResponse<IUser>>(url, user, { ...httpOptions, ...options })
            .pipe(
                map((response: any) => response.results as IUser),
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

    public handleError(error: HttpErrorResponse): Observable<any> {
        console.log('handleError in authService', error);

        return throwError(() => new Error(error.message));
    }
}


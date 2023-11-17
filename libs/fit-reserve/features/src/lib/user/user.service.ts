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
export class UserService {
    endpoint = 'http://localhost:3000/api/user';

    constructor(private readonly http: HttpClient) {}

    /**
     * Get all items.
     *
     * @options options - optional URL queryparam options
     */
    public list(options?: any): Observable<IUser[] | null> {
        console.log(`list - ${this.endpoint}`);

        return this.http
            .get<ApiResponse<IUser[]>>(this.endpoint, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as IUser[]),
                tap(console.log),
                catchError(this.handleError)
            );
    }

    /**
     * Get a single item from the service.
     *
     */
    public read(id: string | null, options?: any): Observable<IUser> {
        const url = `${this.endpoint}/${id}`; // Update de URL om het ID op te nemen
        console.log(`Read - ${url}`);
    
        return this.http
          .get<ApiResponse<IUser>>(url, { ...options, ...httpOptions })
          .pipe(
            map((response: any) => response.results as IUser),
            tap(console.log),
            catchError(this.handleError)
          );
      }

      public create(user: IUser | null, options?: any): Observable<IUser> {
        const url = `${this.endpoint}`;
        console.log(`Create - ${url}`);
    
        return this.http
            .post<ApiResponse<IUser>>(url, user, { ...httpOptions, ...options })
            .pipe(
                map((response: any) => response.results as IUser),
                tap(console.log),
                catchError(this.handleError)
            );
    }
    
      
    /**
     * Handle errors.
     */
    public handleError(error: HttpErrorResponse): Observable<any> {
        console.log('handleError in userService', error);

        return throwError(() => new Error(error.message));
    }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, ITraining } from '@fit-reserve/shared/api';
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
export class TrainingService {
    endpoint = 'http://localhost:3000/api/user';

    constructor(private readonly http: HttpClient) {}

    /**
     * Get all items.
     *
     * @options options - optional URL queryparam options
     */
    public list(options?: any): Observable<ITraining[] | null> {
        console.log(`list ${this.endpoint}`);

        return this.http
            .get<ApiResponse<ITraining[]>>(this.endpoint, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as ITraining[]),
                tap(console.log),
                catchError(this.handleError)
            );
    }

    /**
     * Get a single item from the service.
     *
     */
    public read(id: string | null, options?: any): Observable<ITraining> {
        const url = `${this.endpoint}/${id}`; // Update de URL om het ID op te nemen
        console.log(`read ${url}`);
    
        return this.http
          .get<ApiResponse<ITraining>>(url, { ...options, ...httpOptions })
          .pipe(
            map((response: any) => response.results as ITraining),
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

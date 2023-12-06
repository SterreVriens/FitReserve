/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, ICreateTraining, IEnrollment, ITraining } from '@fit-reserve/shared/api';
import { Injectable } from '@angular/core';

/**
 * See https://angular.io/guide/http#requesting-data-from-a-server
 */
export const httpOptions = {
    observe: 'body' as const, // Cast observe naar het juiste type
    responseType: 'json' as const, // Cast responseType naar het juiste type
};

/**
 *
 *
 */
@Injectable()
export class TrainingService {
    endpoint = 'http://localhost:3000/api/training';

    constructor(private readonly http: HttpClient) {}

    /**
     * Get all training sessions.
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
     * Get a single training session from the service.
     *
     */
    public read(id: string | null, options?: any): Observable<ITraining> {
        const url = `${this.endpoint}/full/${id}`;
        console.log(`read ${url}`);
    
        return this.http
          .get<ApiResponse<ITraining>>(url, { ...options, ...httpOptions })
          .pipe(
            map((response: any) => 
            response.results as ITraining),
            tap(console.log),
            catchError(this.handleError)
          );
    }

    /**
     * Delete a training session.
     */
    public delete(id: string | null, options?: any): Observable<ITraining | null> {
        const url = `${this.endpoint}/${id}`;
        console.log(`Delete - ${url}`);
      
        return this.http
          .delete<ApiResponse<ITraining>>(url, { ...httpOptions, ...options })
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
        console.log('handleError in trainingService', error);

        return throwError(() => new Error(error.message));
    }

    /**
     * Update a training session.
     */
    public update(training: ICreateTraining,id:string, options?: any): Observable<ITraining> {
        const url = `${this.endpoint}/${id}`;
        console.log(`Update training - ${url}`);

        return this.http
            .put<ApiResponse<ITraining>>(url, training, { ...httpOptions, ...options })
            .pipe(
                map((response: any) => response.results as ITraining),
                tap(console.log),
                catchError(this.handleError)
            );
    }

    /**
     * Create a new training session.
     */
    public create(training: ICreateTraining| null,options?: any): Observable<ITraining> {
        console.log('Create training -', training);

        return this.http
            .post<ApiResponse<ITraining>>(this.endpoint, training, { ...httpOptions, ...options })
            .pipe(
                map((response: any) => response.results as ITraining),
                tap(console.log),
                catchError(this.handleError)
            );
    }

    /**
     * Enroll in training session
     */

    public enroll(enrollment: IEnrollment| null,options?: any): Observable<IEnrollment> {
        const url = `http://localhost:3000/api/enrollment/`;
        console.log('Create enrollment -', enrollment);

        return this.http
            .post<ApiResponse<ITraining>>(url, enrollment, { ...httpOptions, ...options })
            .pipe(
                map((response: any) => response.results as ITraining),
                tap(console.log),
                catchError(this.handleError)
            );
    }

    /**
     * Check if user is already enrolled
     */

    public checkIfUserEnrolled(trainingId: string, userId: string): Observable<boolean> {
        const url = `http://localhost:3000/api/enrollment/${trainingId}/${userId}`;
        console.log('Check if user is enrolled');
      
        return this.http
          .get<ApiResponse<IEnrollment>>(url, httpOptions)
          .pipe(
            map((response: any) => !!response.results), // Convert to boolean
            tap(console.log),
            catchError(this.handleError)
          );
      }

    
}

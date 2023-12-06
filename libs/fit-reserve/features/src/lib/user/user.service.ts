/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, IEnrollment, IProgress, IUser } from '@fit-reserve/shared/api';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

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

    constructor(private readonly http: HttpClient,
      private readonly authService: AuthService,) {}

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

    public update(user: IUser, options?: any): Observable<IUser> {
      const url = `${this.endpoint}/${user._id}`;
      console.log(`Update - ${url}`);

      const token = sessionStorage.getItem('access_token'); // Get the token from session storage
      const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Set the token in the Authorization header
      });

      return this.http
          .put<ApiResponse<IUser>>(url, user, { ...httpOptions, ...options, headers })
          .pipe(
              map((response: any) => response.results as IUser),
              tap(console.log),
              catchError(this.handleError)
          );
  }
      
      public delete(id: string | null, options?: any): Observable<IUser> {
        const url = `${this.endpoint}/${id}`;
        console.log(`Delete - ${url}`);
      
        return this.http
          .delete<ApiResponse<IUser>>(url, { ...httpOptions, ...options })
          .pipe(
            map((response: any) => response.results as IUser),
            tap(console.log),
            catchError(this.handleError)
          );
    }

    public getAllEnrollments(id:string | null, options?: any): Observable<IEnrollment[]>{
        const url = `http://localhost:3000/api/enrollment/user/${id}`;
        console.log(`getAllEnrollments - ${url}`);
      
        return this.http
          .get<ApiResponse<IEnrollment>>(url, { ...httpOptions, ...options })
          .pipe(
            map((response: any) => response.results as IEnrollment),
            tap(console.log),
            catchError(this.handleError)
          );
    }
    
    public deleteEnrollment(enrollmentId: string | null, options?: any): Observable<IEnrollment> {
        const url = `http://localhost:3000/api/enrollment/${enrollmentId}`;
        console.log(`Delete Enrollment - ${url}`);
    
        return this.http
          .delete<ApiResponse<IEnrollment>>(url, { ...httpOptions, ...options })
          .pipe(
            map((response: any) => response.results as IEnrollment),
            tap(console.log),
            catchError(this.handleError)
          );
      }
    
      public getProgress(trainingId: string | null, userid: string | null, options?: any): Observable<IProgress> {
        const url = `http://localhost:3000/api/progress/check/${trainingId}/${userid}`;
        console.log(`getProgress - ${url}`);
      
        // Make the HTTP request and log the response
        return this.http
          .get<ApiResponse<IProgress>>(url, { ...httpOptions, ...options })
          .pipe(
            tap(console.log),
            map((response: any) => response.results as IProgress),
            catchError(this.handleError)
          );
      }
      
      public createProgress(p: IProgress , options?: any):Observable<IProgress>{
        const url = `http://localhost:3000/api/progress/`;
        console.log(`Create progress - ${url}`);
    
        return this.http
            .post<ApiResponse<IUser>>(url, p, { ...httpOptions, ...options })
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

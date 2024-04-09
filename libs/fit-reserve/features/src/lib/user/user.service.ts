/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, IEnrollment, ILocation, IProgress, ITraining, IUser } from '@fit-reserve/shared/api';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
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
export class UserService {
    endpoint = `${environment.dataApiUrl}/api/user`;

    constructor(private readonly http: HttpClient,
      private readonly authService: AuthService,) {}

    /**
     * Get all items.
     *
     * @options options - optional URL queryparam options
     */
    public list(options?: any): Observable<IUser[] | null> {

        return this.http
            .get<ApiResponse<IUser[]>>(this.endpoint, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as IUser[]),
                tap(),
                catchError(this.handleError)
            );
    }

    /**
     * Get a single item from the service.
     *
     */
    public read(id: string | null, options?: any): Observable<IUser> {
        const url = `${this.endpoint}/${id}`; // Update de URL om het ID op te nemen
    
        return this.http
          .get<ApiResponse<IUser>>(url, { ...options, ...httpOptions })
          .pipe(
            map((response: any) => response.results as IUser),
            tap(),
            catchError(this.handleError)
          );
      }

      public create(user: IUser | null, options?: any): Observable<IUser> {
        const url = `${this.endpoint}`;
    
        return this.http
            .post<ApiResponse<IUser>>(url, user, { ...httpOptions, ...options })
            .pipe(
                map((response: any) => response.results as IUser),
                tap(),
                catchError(this.handleError)
            );
    }

    public update(user: IUser, options?: any): Observable<IUser> {
      const url = `${this.endpoint}/${user._id}`;

      const token = sessionStorage.getItem('access_token'); // Get the token from session storage
      const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Set the token in the Authorization header
      });

      return this.http
          .put<ApiResponse<IUser>>(url, user, { ...httpOptions, ...options, headers })
          .pipe(
              map((response: any) => response.results as IUser),
              tap(),
              catchError(this.handleError)
          );
  }
      
      public delete(id: string | null, options?: any): Observable<IUser> {
        const url = `${this.endpoint}/${id}`;
      
        return this.http
          .delete<ApiResponse<IUser>>(url, { ...httpOptions, ...options })
          .pipe(
            map((response: any) => response.results as IUser),
            tap(),
            catchError(this.handleError)
          );
    }

    public getAllEnrollments(id:string | null, options?: any): Observable<IEnrollment[]>{
        const url = `${environment.dataApiUrl}/api/enrollment/user/${id}`;
      
        return this.http
          .get<ApiResponse<IEnrollment>>(url, { ...httpOptions, ...options })
          .pipe(
            map((response: any) => response.results as IEnrollment),
            tap(),
            catchError(this.handleError)
          );
    }
    
    public deleteEnrollment(enrollmentId: string | null, options?: any): Observable<IEnrollment> {
        const url = `${environment.dataApiUrl}/api/enrollment/${enrollmentId}`;

        const token = sessionStorage.getItem('access_token'); // Get the token from session storage
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Set the token in the Authorization header
        });
      
        return this.http
          .delete<ApiResponse<IEnrollment>>(url, { ...httpOptions, ...options,headers })
          .pipe(
            map((response: any) => response.results as IEnrollment),
            tap(),
            catchError(this.handleError)
          );
      }
    
      public getProgress(trainingId: string | null, userid: string | null, options?: any): Observable<IProgress> {
        const url = `${environment.dataApiUrl}/api/progress/check/${trainingId}/${userid}`;
      
        // Make the HTTP request and log the response
        return this.http
          .get<ApiResponse<IProgress>>(url, { ...httpOptions, ...options })
          .pipe(
            tap(),
            map((response: any) => response.results as IProgress),
            catchError(this.handleError)
          );
      }
      
      public getTrainingFromUser( userid: string| null, options?: any): Observable<ITraining[]> {
        const url = `${environment.dataApiUrl}/api/recommendations/${userid}`;

        const token = sessionStorage.getItem('access_token'); // Get the token from session storage
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Set the token in the Authorization header
        });
      
      
        // Make the HTTP request and log the response
        return this.http
          .get<ApiResponse<ITraining>>(url, { ...httpOptions, ...options,headers })
          .pipe(
            tap(),
            map((response: any) => response.results as ITraining),
            catchError(this.handleError)
          );
      }
      

      public createProgress(p: IProgress , options?: any):Observable<IProgress>{
        const url = `${environment.dataApiUrl}/api/progress/`;

        const token = sessionStorage.getItem('access_token'); // Get the token from session storage
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Set the token in the Authorization header
        });
    
        return this.http
            .post<ApiResponse<IUser>>(url, p, { ...httpOptions, ...options,headers })
            .pipe(
                map((response: any) => response.results as IUser),
                tap(),
                catchError(this.handleError)
            );
      }
      
    public getAllLocations(options?: any): Observable<ILocation[]> {
        const url = `${environment.dataApiUrl}/api/location`;
        
        const token = sessionStorage.getItem('access_token'); // Get the token from session storage
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Set the token in the Authorization header
        });
      
        return this.http
          .get<ApiResponse<ILocation>>(url, { ...httpOptions, ...options,headers })
          .pipe(
            map((response: any) => response.results as ILocation),
            tap(),
            catchError(this.handleError)
          );
      
    } 

    public createLocation(location: ILocation | null, options?: any): Observable<ILocation> {
        const url = `${environment.dataApiUrl}/api/location`;
        
        const token = sessionStorage.getItem('access_token'); // Get the token from session storage
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Set the token in the Authorization header
        });

        return this.http
            .post<ApiResponse<ILocation>>(url, location, { ...httpOptions, ...options,headers })
            .pipe(
                map((response: any) => response.results as ILocation),
                tap(),
                catchError(this.handleError)
            );
    }
    /**
     * Handle errors.
     */
    public handleError(error: HttpErrorResponse): Observable<any> {

        return throwError(() => new Error(error.message));
    }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { JwtService } from '../../../containers/auth/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  private setHeaders() {
    let token = this.jwtService.getRawToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': "application/json",
        'Authorization': 'Bearer '+token
      })
    };
    return httpOptions;
  }

  private setPostHeaders() {
    let token = this.jwtService.getRawToken();
    const httpOptions = {
      headers: new HttpHeaders({
       // 'Content-Type': "application/json",
        'Authorization': 'Bearer '+token
      })
    };
    return httpOptions;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // client-side or network error occurred.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      `${JSON.stringify(error.error.error)}`
    );
  };

  get(pathUrl) {

    return this.http.get(`${environment.apiUrl}${pathUrl}`,this.setHeaders())
      .pipe(
        catchError(this.handleError)
      );
  }
  post(postUrl, body: Object) {
    return this.http.post(`${environment.apiUrl}${postUrl}`, JSON.stringify(body), this.setHeaders())
      .pipe(
        catchError(this.handleError)
      );
  }
  delete(delUrl) {
    return this.http.delete(`${environment.apiUrl}${delUrl}`, this.setHeaders())
      .pipe(
        catchError(this.handleError)
      );
  }
  put(putUrl, body: Object) {
    return this.http.put(`${environment.apiUrl}${putUrl}`, JSON.stringify(body), this.setHeaders())
      .pipe(
        catchError(this.handleError)
      );
  }

  postFile(postUrl, body: any) {
    return this.http.post(`${environment.apiUrl}${postUrl}`, body, this.setPostHeaders() )
      .pipe(
        catchError(this.handleError)
      );
  }
 
  /****************The below can be used if the entire http response is required to pass to component**************************/
  // getConfigResponse(): Observable<HttpResponse<any>> {
  //   return this.http.get<any>(
  //     this.configUrl, { observe: 'response' })
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }
}

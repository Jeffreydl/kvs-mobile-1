import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';

export class HttpErrorInterceptor implements HttpInterceptor {

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                retry(1),
                catchError((err: HttpErrorResponse) => {
                    let errorMessage = '';
                    if ((err.error instanceof ErrorEvent)) {
                        // client-side error
                        errorMessage = `Error: ${err.error.message}`;
                    } else {
                        // server-side error
                        errorMessage = `Error Code: ${err.status}\nMessage: ${err.message}`;
                    }
                    return throwError(errorMessage);
                })
            );
    }
}

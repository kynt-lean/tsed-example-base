import { Injectable } from "@tsed/common";
import { catchError, isObservable, Observable, throwError } from "rxjs";

@Injectable()
export class RpcProxy {
  public create(
    targetCallback: (...args: unknown[]) => Promise<Observable<any>>
  ) {
    return async (...args: unknown[]) => {
      try {
        const result = await targetCallback(...args);
        return !isObservable(result)
          ? result
          : result.pipe(
            catchError(error => this.handleError(error))
          )
      } catch (error) {
        return this.handleError(error);
      }
    }
  }

  protected handleError(err: Error): Observable<any> {
    return throwError(() => new Error(err.message));
  }
}
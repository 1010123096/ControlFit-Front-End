import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

export const responseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse && event.body && typeof event.body === 'object' && 'data' in event.body) {
        const body = event.body as {
          data: unknown;
          total?: number;
          page?: number;
          pageSize?: number;
        };

        const isPaginated = body.page !== undefined;

        if (isPaginated) {
          return event.clone({
            body: {
              items: body.data,
              total: body.total ?? 0,
              page: body.page ?? 1,
              pageSize: body.pageSize ?? 25,
            },
          });
        }

        return event.clone({ body: body.data });
      }
      return event;
    })
  );
};

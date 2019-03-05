declare module 'express-wrap-async' {
  function wrapAsync<T>(origin: T): T;
  export = wrapAsync;
}
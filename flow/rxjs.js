/* @flow */
declare module 'rxjs' {
  declare interface Observer<T> {
    isUnsubscribed?: boolean;
    next: (value: T) => void;
    error: (err: any) => void;
    complete: () => void;
  }
}

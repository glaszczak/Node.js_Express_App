export interface QueryHandler<TQuery, TResult> {
    handle: (query?: TQuery) => Promise<TResult>;
}

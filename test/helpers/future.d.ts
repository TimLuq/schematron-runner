export interface ICompletableFuture<T> extends Promise<T> {
    readonly asCallback: (err: any, value?: T) => void;

    complete(value: T): boolean;
    completeExceptionally(throwable: Error): boolean;
}

export type CompletableFuture<T> = ICompletableFuture<T> & Promise<T>;

export default function future<T>(): CompletableFuture<T>;

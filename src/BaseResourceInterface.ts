interface BaseResourceInterface<T> {
    readonly Id: string;
    readonly Src: string;
    Content?: T;

    ContentLoaded(content: T): void;
}

export default BaseResourceInterface;
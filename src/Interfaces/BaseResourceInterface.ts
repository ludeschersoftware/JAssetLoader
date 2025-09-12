interface BaseResourceInterface<T> {
    readonly Id: string;
    readonly Src: string;
    Content: T | undefined;

    ContentLoaded(content: T): void;
}

export default BaseResourceInterface;
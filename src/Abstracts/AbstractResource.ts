import BaseResourceInterface from "../Interfaces/BaseResourceInterface";

abstract class AbstractResource<T> implements BaseResourceInterface<T> {
    public readonly Id: string;
    public readonly Src: string;
    public Content: T | undefined;

    constructor(id: string, src: string) {
        this.Id = id;
        this.Src = src;
    }

    public ContentLoaded(content: T): void {
        this.Content = content;
    }
}

export default AbstractResource;
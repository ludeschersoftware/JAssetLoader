abstract class AbstractResource<T> {
    public readonly Id: string;
    public readonly Src: string;
    public readonly Content: T;

    constructor(id: string, src: string, content: T) {
        this.Id = id;
        this.Src = src;
        this.Content = content;
    }
}

export default AbstractResource;
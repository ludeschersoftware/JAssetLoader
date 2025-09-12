import AbstractResource from "../Abstracts/AbstractResource";

class JsonResource<T = any> extends AbstractResource<T> {
    constructor(id: string, src: string, content: T) {
        super(id, src, content);
    }
}

export default JsonResource;
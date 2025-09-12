import AbstractResource from "../Abstracts/AbstractResource";

class JsonResource<T = any> extends AbstractResource<T> {
    constructor(id: string, src: string) {
        super(id, src);
    }
}

export default JsonResource;
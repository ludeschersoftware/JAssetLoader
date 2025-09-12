import AbstractResource from "../Abstracts/AbstractResource";

class TextureResource extends AbstractResource<ImageBitmap> {
    constructor(id: string, src: string) {
        super(id, src);
    }
}

export default TextureResource;
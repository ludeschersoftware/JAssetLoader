import AbstractResource from "../Abstracts/AbstractResource";

class TextureResource extends AbstractResource<ImageBitmap> {
    constructor(id: string, src: string, content: ImageBitmap) {
        super(id, src, content);
    }
}

export default TextureResource;
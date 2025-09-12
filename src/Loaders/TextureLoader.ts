import AbstractLoader from "../Abstracts/AbstractLoader";
import ContentLoadType from "../Enums/ContentLoadType";
import TextureResource from "../Resources/TextureResource";
import LoaderLoadResultType from "../Types/LoaderLoadResultType";

class TextureLoader extends AbstractLoader<ImageBitmap> {
    protected async fetchResource(src: string): Promise<ImageBitmap> {
        return new Promise((resolve, reject) => {
            const IMG: HTMLImageElement = new Image();
            IMG.onload = () => createImageBitmap(IMG).then(resolve).catch(reject);
            IMG.onerror = reject;
            IMG.src = src;
        });
    }

    public LoadTexture(src: string, type: ContentLoadType): LoaderLoadResultType<TextureResource> {
        const { id, promise } = this.Load(src, type);
        const WRAPPED_PROMISE: Promise<TextureResource> = promise.then(bitmap => {
            return new TextureResource(id, src, bitmap);
        });

        return [id, WRAPPED_PROMISE];
    }
}

export default new TextureLoader();
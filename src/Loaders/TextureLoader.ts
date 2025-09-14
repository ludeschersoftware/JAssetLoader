import AbstractLoader from "../Abstracts/AbstractLoader";
import WrappedPromiseInterface from "../Interfaces/WrappedPromiseInterface";
import TextureResource from "../Resources/TextureResource";

class TextureLoader extends AbstractLoader<ImageBitmap> {
    public LoadTexture(src: string, cache?: boolean): WrappedPromiseInterface<TextureResource> {
        const { id, promise } = this.Load(src, cache);
        const WRAPPED_PROMISE: Promise<TextureResource> = promise.then(bitmap => {
            return new TextureResource(id, src, bitmap);
        });

        return {
            id,
            promise: WRAPPED_PROMISE,
        };
    }

    protected async fetchResource(src: string): Promise<ImageBitmap> {
        return new Promise((resolve, reject) => {
            const IMG: HTMLImageElement = new Image();
            IMG.onload = () => createImageBitmap(IMG).then(resolve).catch(reject);
            IMG.onerror = reject;
            IMG.src = src;
        });
    }
}

export default new TextureLoader();
import AbstractLoader from "../Abstracts/AbstractLoader";
import ContentLoadType from "../Enums/ContentLoadType";
import TextureResource from "../Resources/TextureResource";

class TextureLoader extends AbstractLoader<ImageBitmap> {
    protected async fetchResource(src: string): Promise<ImageBitmap> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => createImageBitmap(img).then(resolve).catch(reject);
            img.onerror = reject;
            img.src = src;
        });
    }

    public LoadTexture(src: string, type: ContentLoadType) {
        const { id, promise } = this.Load(src, type);
        const texture = new TextureResource(id, src);

        const wrappedPromise = promise.then(bitmap => {
            texture.ContentLoaded(bitmap);
            return texture;
        });

        return { id, resource: texture, promise: wrappedPromise };
    }
}

export default new TextureLoader();
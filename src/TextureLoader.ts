import Ref from "@ludeschersoftware/ref";
import ContentLoadType from "./ContentLoadType";
import { CreateUniqHash, HashValue } from "@ludeschersoftware/utils";

class TextureLoader {
    private static CACHE = new Map<number, WeakRef<ImageBitmap>>();
    private static LOAD_COUNTS = new Map<number, Ref<number>>();

    public static Load(src: string, cacheMode: ContentLoadType): {
        id: string;
        texture: Texture2D;
        promise: Promise<void>;
    } {
        const id = CreateUniqHash(50);
        const texture = new Texture2D(id, src);
        const promise = this.loadIntoTexture(texture, cacheMode);
        return { id, texture, promise };
    }

    private static loadIntoTexture(texture: Texture2D, cacheMode: ContentLoadType): Promise<void> {
        const srcHash = HashValue(texture.Src);

        // ✅ check cache
        const cached = this.CACHE.get(srcHash)?.deref();
        if (cached) {
            texture.ContentLoaded(cached);
            return Promise.resolve();
        }

        // ✅ load fresh
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                createImageBitmap(img).then(bitmap => {
                    texture.ContentLoaded(bitmap);

                    // cache policy
                    if (cacheMode === ContentLoadType.Cache) {
                        this.CACHE.set(srcHash, new WeakRef(bitmap));
                    } else {
                        const ref = this.LOAD_COUNTS.get(srcHash) ?? new Ref(0);
                        ref.value++;
                        this.LOAD_COUNTS.set(srcHash, ref);

                        if (ref.value >= 5) {
                            this.CACHE.set(srcHash, new WeakRef(bitmap));
                            this.LOAD_COUNTS.delete(srcHash);
                        }
                    }
                    resolve();
                }).catch(reject);
            };
            img.src = texture.Src;
        });
    }
}

export default TextureLoader;
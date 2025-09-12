import Ref from "@ludeschersoftware/ref";
import { CreateUniqHash, HashValue } from "@ludeschersoftware/utils";
import ContentLoadType from "./ContentLoadType";

/**
 * Generic loader with caching + lazy/eager logic.
 */
abstract class AbstractLoader<TResource extends WeakKey> {
    private readonly cache = new Map<number, WeakRef<TResource>>();
    private readonly loadCounts = new Map<number, Ref<number>>();

    public Load(src: string, type: ContentLoadType = ContentLoadType.Default): { id: string; promise: Promise<TResource>; } {
        const id = CreateUniqHash(50);
        const promise = this.loadInternal(src, type);
        return { id, promise };
    }

    protected abstract fetchResource(src: string): Promise<TResource>;

    private async loadInternal(src: string, type: ContentLoadType): Promise<TResource> {
        const srcHash = HashValue(src);

        // Check cache
        const cached = this.cache.get(srcHash)?.deref();
        if (cached) return cached;

        const resource = await this.fetchResource(src);

        // Cache policy
        if (type === ContentLoadType.Cache) {
            this.cache.set(srcHash, new WeakRef(resource));
        } else {
            const ref = this.loadCounts.get(srcHash) ?? new Ref(0);
            ref.value++;
            this.loadCounts.set(srcHash, ref);

            if (ref.value >= 5) {
                this.cache.set(srcHash, new WeakRef(resource));
                this.loadCounts.delete(srcHash);
            }
        }

        return resource;
    }
}

export default AbstractLoader;
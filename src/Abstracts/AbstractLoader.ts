import Ref from "@ludeschersoftware/ref";
import { CreateUniqHash, HashValue } from "@ludeschersoftware/utils";
import ContentLoadType from "../Enums/ContentLoadType";
import LoaderLoadResultInterface from "../Interfaces/LoaderLoadResultInterface";

abstract class AbstractLoader<TResource extends WeakKey> {
    private readonly m_cache: Map<number, WeakRef<TResource>>;
    private readonly m_load_counts: Map<number, Ref<number>>;

    public constructor() {
        this.m_cache = new Map();
        this.m_load_counts = new Map();
    }

    public Load(src: string, type?: ContentLoadType): LoaderLoadResultInterface<TResource> {
        return {
            id: CreateUniqHash(50),
            promise: this.loadInternal(src, type),
        };
    }

    protected abstract fetchResource(src: string): Promise<TResource>;

    private async loadInternal(src: string, type?: ContentLoadType): Promise<TResource> {
        const SRC_HASH: number = HashValue(src);
        const CACHE_HIT: WeakRef<TResource> | undefined = this.m_cache.get(SRC_HASH);
        const CACHED: TResource | undefined = CACHE_HIT?.deref();

        if (CACHED) {
            return CACHED;
        } else if (CACHE_HIT) { // WeakRef got GC'ed
            this.m_cache.delete(SRC_HASH);
        }

        const RESOURCE: Awaited<TResource> = await this.fetchResource(src);

        if (type === ContentLoadType.Cache) {
            this.m_cache.set(SRC_HASH, new WeakRef(RESOURCE));

            return RESOURCE;
        }

        const REF: Ref<number> = this.m_load_counts.get(SRC_HASH) ?? new Ref(0);

        REF.value++;

        this.m_load_counts.set(SRC_HASH, REF);

        if (REF.value >= 5) { // Check if the resource got loaded multiple times => cache anyway!
            this.m_cache.set(SRC_HASH, new WeakRef(RESOURCE));
            this.m_load_counts.delete(SRC_HASH);
        }

        return RESOURCE;
    }
}

export default AbstractLoader;
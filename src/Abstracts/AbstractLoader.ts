import Ref from "@ludeschersoftware/ref";
import { CreateUniqHash, HashValue } from "@ludeschersoftware/utils";
import WrappedPromiseInterface from "../Interfaces/WrappedPromiseInterface";
import { retry } from "../Utils/RetryHelper";

abstract class AbstractLoader<T extends object> {
    private readonly m_cache: Map<number, WeakRef<T>>;
    private readonly m_strong_cache: Map<number, T>;
    private readonly m_load_counts: Map<number, Ref<number>>;

    public constructor() {
        this.m_cache = new Map();
        this.m_strong_cache = new Map();
        this.m_load_counts = new Map();
    }

    public Load(src: string, cache?: boolean): WrappedPromiseInterface<T> {
        return {
            id: CreateUniqHash(50),
            promise: this.loadInternal(src, cache),
        };
    }

    protected abstract fetchResource(src: string): Promise<T>;

    private async loadInternal(src: string, cache?: boolean): Promise<T> {
        const SRC_HASH: number = HashValue(src);

        // Strong cache first
        const STRONG_CACHE_HIT: T | undefined = this.m_strong_cache.get(SRC_HASH);

        if (STRONG_CACHE_HIT) {
            return STRONG_CACHE_HIT;
        }

        // Weak cache next
        const CACHE_HIT: WeakRef<T> | undefined = this.m_cache.get(SRC_HASH);
        const CACHED: T | undefined = CACHE_HIT?.deref();

        if (CACHED) {
            return CACHED;
        } else if (CACHE_HIT) { // cleaned by GC
            this.m_cache.delete(SRC_HASH);
        }

        // Fetch with retry & exponential backoff
        const RESOURCE: T = await retry(() => this.fetchResource(src), 3, 300);

        if (cache === true) {
            this.m_cache.set(SRC_HASH, new WeakRef(RESOURCE));

            return RESOURCE;
        }

        const REF: Ref<number> = this.m_load_counts.get(SRC_HASH) ?? new Ref(0);

        REF.value++;

        this.m_load_counts.set(SRC_HASH, REF);

        if (REF.value >= 4) { // Check if the resource got loaded multiple times => strong cache anyway!
            this.m_strong_cache.set(SRC_HASH, RESOURCE);
        } else if (REF.value >= 2) { // Check if the resource got loaded multiple times => "weak" cache anyway!
            this.m_cache.set(SRC_HASH, new WeakRef(RESOURCE));
        }

        return RESOURCE;
    }
}

export default AbstractLoader;
import { PromiseStatus, TrackedPromisePool } from "@ludeschersoftware/promise";
import ProgressInterface from "./ProgressInterface";
import TextureLoader from "./TextureLoader";
import AudioLoader from "./AudioLoader";
import JsonLoader from "./JsonLoader";
import AssetEntryInterface from "./AssetEntryInterface";
import AbstractResource from "./AbstractResource";
import ContentLoadType from "./ContentLoadType";

class AssetLoader {
    private readonly pool: TrackedPromisePool;
    private readonly tasks: Map<string, AssetEntryInterface<any, any>>;

    constructor() {
        this.pool = new TrackedPromisePool();
        this.tasks = new Map();
    }

    // 🔹 Generic loader
    public Load<TResource extends AbstractResource<TContent>, TContent>(
        id: string,
        promise: Promise<TContent>,
        resource: TResource
    ): void {
        const tracked = this.pool.Add(promise);
        this.tasks.set(id, { tracked, resource } as AssetEntryInterface<TResource, TContent>);
    }

    // 🔹 Specialized loaders
    public LoadTexture(src: string, type: ContentLoadType) {
        const { id, resource, promise } = TextureLoader.LoadTexture(src, type);
        this.Load(id, promise, resource);
        return resource;
    }

    public LoadAudio(src: string, type: ContentLoadType) {
        const { id, resource, promise } = AudioLoader.LoadAudio(src, type);
        this.Load(id, promise, resource);
        return resource;
    }

    public LoadJson<T = any>(src: string, type: ContentLoadType) {
        const { id, resource, promise } = JsonLoader.LoadJson<T>(src, type);
        this.Load(id, promise, resource);
        return resource;
    }

    // 🔹 Progress tracking
    public GetProgress(): ProgressInterface {
        let loaded = 0;
        let failed = 0;

        for (const { tracked } of this.tasks.values()) {
            if (tracked.Status === PromiseStatus.Fulfilled) loaded++;
            else if (tracked.Status === PromiseStatus.Rejected) failed++;
        }

        return { loaded, failed, total: this.tasks.size };
    }

    // 🔹 Get raw promise result (ImageBitmap, AudioBuffer, JSON, etc.)
    public GetResult<T>(id: string): T | undefined {
        const entry = this.tasks.get(id);
        return entry?.tracked.Status === PromiseStatus.Fulfilled ? entry.tracked.Result : undefined;
    }

    // 🔹 Get the resource object (Texture2D, AudioResource, JsonResource)
    public GetResource<T extends AbstractResource<any>>(id: string): T | undefined {
        return this.tasks.get(id)?.resource as T | undefined;
    }

    // 🔹 Get error from a rejected task
    public GetError(id: string): any {
        const entry = this.tasks.get(id);
        return entry?.tracked.Status === PromiseStatus.Rejected ? entry.tracked.Error : undefined;
    }

    // 🔹 Iterate over all resources
    public GetAllResources(): AbstractResource<any>[] {
        return Array.from(this.tasks.values()).map(entry => entry.resource);
    }

    // 🔹 Iterate over loaded resources only
    public GetLoadedResources(): AbstractResource<any>[] {
        return Array.from(this.tasks.values())
            .filter(entry => entry.tracked.Status === PromiseStatus.Fulfilled)
            .map(entry => entry.resource);
    }

    // 🔹 Check if all promises have resolved
    public IsReady(): boolean {
        return this.pool.Resolved;
    }

    // 🔹 Clear all tasks
    public Clear(): void {
        this.tasks.clear();
    }
}

export default AssetLoader;
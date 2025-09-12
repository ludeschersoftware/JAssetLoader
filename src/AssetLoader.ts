import { PromiseStatus, TrackedPromisePool } from "@ludeschersoftware/promise";
import AssetEntryInterface from "./Interfaces/AssetEntryInterface";
import AbstractResource from "./Abstracts/AbstractResource";
import ContentLoadType from "./Enums/ContentLoadType";
import TextureLoader from "./Loaders/TextureLoader";
import AudioLoader from "./Loaders/AudioLoader";
import JsonLoader from "./Loaders/JsonLoader";
import ProgressInterface from "./Interfaces/ProgressInterface";

class AssetLoader {
    private readonly pool: TrackedPromisePool;
    private readonly tasks: Map<string, AssetEntryInterface<any, any>>;

    constructor() {
        this.pool = new TrackedPromisePool();
        this.tasks = new Map();
    }

    public Load<TResource extends AbstractResource<TContent>, TContent>(
        id: string,
        promise: Promise<TContent>,
        resource: TResource
    ): void {
        const tracked = this.pool.Add(promise);
        this.tasks.set(id, { tracked, resource } as AssetEntryInterface<TResource, TContent>);
    }

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

    public GetProgress(): ProgressInterface {
        let loaded = 0;
        let failed = 0;

        for (const { tracked } of this.tasks.values()) {
            if (tracked.Status === PromiseStatus.Fulfilled) loaded++;
            else if (tracked.Status === PromiseStatus.Rejected) failed++;
        }

        return { loaded, failed, total: this.tasks.size };
    }

    public GetResult<TContent>(id: string): TContent | undefined {
        const entry = this.tasks.get(id);
        return entry?.tracked.Status === PromiseStatus.Fulfilled ? entry.tracked.Result : undefined;
    }

    public GetResource<TResource extends AbstractResource<any>>(id: string): TResource | undefined {
        return this.tasks.get(id)?.resource as TResource | undefined;
    }

    public GetError(id: string): any {
        const entry = this.tasks.get(id);
        return entry?.tracked.Status === PromiseStatus.Rejected ? entry.tracked.Error : undefined;
    }

    public GetAllResources(): AbstractResource<any>[] {
        return Array.from(this.tasks.values()).map(entry => entry.resource);
    }

    public GetLoadedResources(): AbstractResource<any>[] {
        return Array.from(this.tasks.values())
            .filter(entry => entry.tracked.Status === PromiseStatus.Fulfilled)
            .map(entry => entry.resource);
    }

    public IsReady(): boolean {
        return this.pool.Resolved;
    }

    public Clear(): void {
        this.tasks.clear();
    }
}

export default AssetLoader;
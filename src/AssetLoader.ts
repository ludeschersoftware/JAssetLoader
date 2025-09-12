import { PromiseStatus, TrackedPromise, TrackedPromisePool } from "@ludeschersoftware/promise";
import ProgressInterface from "./ProgressInterface";
import TextureLoader from "./TextureLoader";
import AudioLoader from "./AudioLoader";
import ContentLoadType from "./ContentLoadType";
import BaseResourceInterface from "./BaseResourceInterface";
import JsonLoader from "./JsonLoader";

class AssetLoader {
    private readonly pool: TrackedPromisePool;
    private readonly tasks: Map<string, { tracked: TrackedPromise<any>, resource?: BaseResourceInterface<any>; }>;

    constructor() {
        this.pool = new TrackedPromisePool();
        this.tasks = new Map();
    }

    // 🔹 generic load
    public Load<T>(key: string, promise: Promise<T>, resource?: BaseResourceInterface<T>): void {
        const tracked = this.pool.Add(promise);
        this.tasks.set(key, { tracked, resource });
    }

    // 🔹 texture-specific load
    public LoadTexture(src: string, type: ContentLoadType) {
        const { id, resource, promise } = TextureLoader.LoadTexture(src, type);
        this.Load(id, promise, resource);
        return resource;
    }

    // 🔹 audio-specific load
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

    // 🔹 progress tracking
    public GetProgress(): ProgressInterface {
        let loaded = 0;
        let failed = 0;

        for (const { tracked } of this.tasks.values()) {
            if (tracked.Status === PromiseStatus.Fulfilled) loaded++;
            else if (tracked.Status === PromiseStatus.Rejected) failed++;
        }

        return { loaded, failed, total: this.tasks.size };
    }

    // 🔹 get raw result (decoded AudioBuffer, ImageBitmap, etc.)
    public GetResult<T>(key: string): T | undefined {
        const task = this.tasks.get(key);
        return task?.tracked.Status === PromiseStatus.Fulfilled ? task.tracked.Result : undefined;
    }

    // 🔹 get resource object (Texture2D, AudioResource, etc.)
    public GetResource<T extends BaseResourceInterface<any>>(key: string): T | undefined {
        return this.tasks.get(key)?.resource as T | undefined;
    }

    // 🔹 get error
    public GetError(key: string): any {
        const task = this.tasks.get(key);
        return task?.tracked.Status === PromiseStatus.Rejected ? task.tracked.Error : undefined;
    }

    // 🔹 check readiness
    public IsReady(): boolean {
        return this.pool.Resolved;
    }

    // 🔹 clear tasks
    public Clear(): void {
        this.tasks.clear();
    }
}

export default AssetLoader;
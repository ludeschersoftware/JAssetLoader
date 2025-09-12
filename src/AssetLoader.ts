import { PromiseStatus, TrackedPromise, TrackedPromisePool } from "@ludeschersoftware/promise";
import ProgressInterface from "./ProgressInterface";
import TextureLoader from "./TextureLoader";
import ContentLoadType from "./ContentLoadType";

class AssetLoader {
    private readonly m_pool: TrackedPromisePool;
    private readonly m_tasks: Map<string, TrackedPromise<any>>;

    public constructor() {
        this.m_pool = new TrackedPromisePool();
        this.m_tasks = new Map();
    }

    public Load<T>(key: string, promise: Promise<T>): void {
        this.m_tasks.set(key, this.m_pool.Add(promise));
    }

    public LoadTexture(src: string, type: ContentLoadType): Texture2D {
        const { id, texture, promise } = TextureLoader.Load(src, type);

        this.Load(id, promise);

        return texture;
    }

    public GetProgress(): ProgressInterface {
        let loaded: number = 0;
        let failed: number = 0;

        for (const task of this.m_tasks.values()) {
            if (task.Status === PromiseStatus.Fulfilled) {
                loaded++;
            } else if (task.Status === PromiseStatus.Rejected) {
                failed++;
            }
        }

        return { loaded, failed, total: this.m_tasks.size };
    }

    public GetResult<T>(key: string): T | undefined {
        const TASK: TrackedPromise<any> | undefined = this.m_tasks.get(key);

        return TASK?.Status === PromiseStatus.Fulfilled ? TASK.Result : undefined;
    }

    public GetError(key: string): any {
        const TASK: TrackedPromise<any> | undefined = this.m_tasks.get(key);

        return TASK?.Status === PromiseStatus.Rejected ? TASK.Error : undefined;
    }

    public IsReady(): boolean {
        return this.m_pool.Resolved;
    }

    public Clear(): void {
        this.m_tasks.clear();
    }
}

export default AssetLoader;
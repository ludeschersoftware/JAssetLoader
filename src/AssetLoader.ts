import { PromiseStatus, TrackedPromise, TrackedPromisePool } from "@ludeschersoftware/promise";
import AbstractResource from "./Abstracts/AbstractResource";
import ContentLoadType from "./Enums/ContentLoadType";
import TextureLoader from "./Loaders/TextureLoader";
import AudioLoader from "./Loaders/AudioLoader";
import JsonLoader from "./Loaders/JsonLoader";
import ProgressInterface from "./Interfaces/ProgressInterface";
import LoaderLoadResultType from "./Types/LoaderLoadResultType";

class AssetLoader {
    private readonly m_pool: TrackedPromisePool;
    private readonly m_tasks: Map<string, TrackedPromise<AbstractResource<any>>>;

    public constructor() {
        this.m_pool = new TrackedPromisePool();
        this.m_tasks = new Map();
    }

    public Load(loadResult: LoaderLoadResultType<AbstractResource<any>>): string {
        this.m_tasks.set(loadResult[0], this.m_pool.Add(loadResult[1]));

        return loadResult[0];
    }

    public LoadTexture(src: string, type?: ContentLoadType): string {
        return this.Load(TextureLoader.LoadTexture(src, type));
    }

    public LoadAudio(src: string, type?: ContentLoadType): string {
        return this.Load(AudioLoader.LoadAudio(src, type));
    }

    public LoadJson<T = any>(src: string, type?: ContentLoadType): string {
        return this.Load(JsonLoader.LoadJson<T>(src, type));
    }

    public GetProgress(): ProgressInterface {
        let loaded: number = 0;
        let failed: number = 0;

        for (const tracked of this.m_tasks.values()) {
            if (tracked.Status === PromiseStatus.Fulfilled) {
                loaded++;
            } else if (tracked.Status === PromiseStatus.Rejected) {
                failed++;
            }
        }

        return { loaded, failed, total: this.m_tasks.size };
    }

    public GetResult(id: string): AbstractResource<any> | undefined {
        const TRACKED: TrackedPromise<AbstractResource<any>> | undefined = this.m_tasks.get(id);
        return TRACKED?.Status === PromiseStatus.Fulfilled ? TRACKED.Result : undefined;
    }

    public GetResource(id: string): AbstractResource<any> | undefined {
        return this.m_tasks.get(id)?.Result;
    }

    public GetError(id: string): any | undefined {
        const TRACKED: TrackedPromise<any> | undefined = this.m_tasks.get(id);
        return TRACKED?.Status === PromiseStatus.Rejected ? TRACKED.Error : undefined;
    }

    public GetErrors(): any[] {
        return Array.from(this.m_tasks.values())
            .filter(tracked => tracked.Status === PromiseStatus.Rejected ? tracked.Error : undefined);
    }

    public GetAllResources(): AbstractResource<any>[] {
        return Array.from(this.m_tasks.values())
            .map(entry => entry.Result)
            .filter(result => (result !== null && result !== undefined));
    }

    public GetLoadedResources(): AbstractResource<any>[] {
        return Array.from(this.m_tasks.values())
            .filter(tracked => tracked.Status === PromiseStatus.Fulfilled)
            .map(entry => entry.Result)
            .filter(result => (result !== null && result !== undefined));
    }

    public IsReady(): boolean {
        return this.m_pool.Resolved;
    }

    public Clear(): void {
        this.m_tasks.clear();
    }
}

export default AssetLoader;
import AssetLoader from "../src/AssetLoader";
import ContentLoadType from "../src/Enums/ContentLoadType";
import TextureResource from "../src/Resources/TextureResource";
import AudioResource from "../src/Resources/AudioResource";
import JsonResource from "../src/Resources/JsonResource";

// ---- MOCKS ---- //
global.Image = class {
    public onload: (() => void) | null = null;
    public onerror: (() => void) | null = null;
    set src(_v: string) {
        if (this.onload) this.onload();
    }
} as any;

(global as any).createImageBitmap = jest.fn(async () => ({}));

(global as any).fetch = jest.fn((url: string) => {
    if (url.endsWith(".json")) {
        return Promise.resolve({
            ok: true,
            json: async () => ({ foo: "bar" }),
        });
    } else if (url.endsWith(".ogg")) {
        return Promise.resolve({
            arrayBuffer: async () => new ArrayBuffer(8),
        });
    } else {
        return Promise.reject(new Error("not found"));
    }
});

class MockAudioContext {
    decodeAudioData = jest.fn((buffer) => Promise.resolve({ decoded: buffer }));
}
(global as any).AudioContext = MockAudioContext;

// ---- TESTS ---- //
describe("AssetLoader", () => {
    let loader: AssetLoader;

    beforeEach(() => {
        loader = new AssetLoader();
        jest.clearAllMocks();
    });

    test("loads a texture successfully", async () => {
        const id = loader.LoadTexture("sprite.png", ContentLoadType.Cache);
        await Promise.allSettled([loader.GetResult(id)]);
        const result = loader.GetResult<TextureResource>(id);
        expect(result).toBeInstanceOf(TextureResource);
    });

    test("loads audio successfully", async () => {
        const id = loader.LoadAudio("sound.ogg");
        await Promise.allSettled([loader.GetResult(id)]);
        const result = loader.GetResult<AudioResource>(id);
        expect(result).toBeInstanceOf(AudioResource);
    });

    test("loads json successfully", async () => {
        const id = loader.LoadJson("config.json");
        await Promise.allSettled([loader.GetResult(id)]);
        const result = loader.GetResult<JsonResource<any>>(id);
        expect(result).toBeInstanceOf(JsonResource);
        // @ts-ignore
        expect(result?.Data).toEqual({ foo: "bar" });
    });

    test("tracks progress correctly", async () => {
        const id1 = loader.LoadJson("config.json");
        const id2 = loader.LoadAudio("sound.ogg");
        await Promise.allSettled([
            loader.GetResult(id1),
            loader.GetResult(id2),
        ]);
        const progress = loader.GetProgress();
        expect(progress.loaded).toBe(2);
        expect(progress.failed).toBe(0);
        expect(progress.total).toBe(2);
    });

    test("GetError returns error for rejected promise", async () => {
        const id = loader.LoadJson("missing.json");
        await Promise.allSettled([loader.GetResult(id)]);
        const error = loader.GetError(id);
        expect(error).toBeInstanceOf(Error);
    });

    test("GetResource returns tracked resource", async () => {
        const id = loader.LoadJson("config.json");
        await Promise.allSettled([loader.GetResult(id)]);
        const resource = loader.GetResource<JsonResource<any>>(id);
        expect(resource).toBeDefined();
    });

    test("GetAllResources returns all results", async () => {
        const id = loader.LoadJson("config.json");
        await Promise.allSettled([loader.GetResult(id)]);
        const all = loader.GetAllResources();
        expect(all.length).toBeGreaterThan(0);
    });

    test("GetLoadedResources only returns fulfilled", async () => {
        loader.LoadJson("missing.json"); // will fail
        const id2 = loader.LoadJson("config.json");
        await Promise.allSettled([
            loader.GetResult(id2),
        ]);
        const loaded = loader.GetLoadedResources();
        expect(loaded.every(r => r instanceof JsonResource)).toBe(true);
    });

    test("IsReady returns true when all resolved", async () => {
        const id = loader.LoadJson("config.json");
        await Promise.allSettled([loader.GetResult(id)]);
        expect(loader.IsReady()).toBe(true);
    });

    test("Clear empties tasks", async () => {
        loader.LoadJson("config.json");
        loader.Clear();
        expect(loader.GetProgress().total).toBe(0);
    });

    test("caches resources when ContentLoadType.Cache", async () => {
        const id1 = loader.LoadTexture("sprite.png", ContentLoadType.Cache);
        await Promise.allSettled([loader.GetResult(id1)]);
        const id2 = loader.LoadTexture("sprite.png", ContentLoadType.Cache);
        await Promise.allSettled([loader.GetResult(id2)]);
        const res1 = loader.GetResult(id1);
        const res2 = loader.GetResult(id2);
        expect(res1).toBe(res2); // should reuse cached
    });

    test("promotes resource to cache after multiple loads", async () => {
        const ids: string[] = [];
        for (let i = 0; i < 6; i++) {
            ids.push(loader.LoadJson("config.json"));
        }
        await Promise.allSettled(ids.map(id => loader.GetResult(id)));
        const results = ids.map(id => loader.GetResult(id));
        expect(new Set(results).size).toBe(1); // same cached resource
    });
});

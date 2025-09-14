import AbstractLoader from "../Abstracts/AbstractLoader";
import WrappedPromiseInterface from "../Interfaces/WrappedPromiseInterface";
import AudioResource from "../Resources/AudioResource";

class AudioLoader extends AbstractLoader<AudioBuffer> {
    private static context: AudioContext | null = null;
    private static initialized = false;

    public LoadAudio(src: string, cache?: boolean): WrappedPromiseInterface<AudioResource> {
        const { id, promise } = this.Load(src, cache);
        const WRAPPED_PROMISE: Promise<AudioResource> = promise.then(buffer => {
            return new AudioResource(id, src, buffer);
        });

        return {
            id,
            promise: WRAPPED_PROMISE,
        };
    }

    /**
     * Lazily create AudioContext
     */
    private static getContext(): AudioContext {
        if (!this.context) {
            this.context = new AudioContext();
            this.autoResume(this.context);
        }
        return this.context;
    }

    /**
     * Attach global listeners to auto-resume context on first user gesture
     */
    private static autoResume(ctx: AudioContext): void {
        if (this.initialized) {
            return;
        }

        this.initialized = true;

        const RESUME = async () => {
            if (ctx.state === "suspended") {
                try {
                    await ctx.resume();
                } catch (err) {
                    console.warn("AudioContext resume failed:", err);
                }
            }

            window.removeEventListener("click", RESUME);
            window.removeEventListener("keydown", RESUME);
            window.removeEventListener("touchstart", RESUME);
        };

        window.addEventListener("click", RESUME);
        window.addEventListener("keydown", RESUME);
        window.addEventListener("touchstart", RESUME);
    }

    protected async fetchResource(src: string): Promise<AudioBuffer> {
        const RESPONSE: Response = await fetch(src);
        const ARRAY_BUFFER: ArrayBuffer = await RESPONSE.arrayBuffer();

        return await AudioLoader.getContext().decodeAudioData(ARRAY_BUFFER);
    }
}

export default new AudioLoader();
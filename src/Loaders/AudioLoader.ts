import AbstractLoader from "../Abstracts/AbstractLoader";
import ContentLoadType from "../Enums/ContentLoadType";
import AudioResource from "../Resources/AudioResource";
import LoaderLoadResultType from "../Types/LoaderLoadResultType";

class AudioLoader extends AbstractLoader<AudioBuffer> {
    private static context: AudioContext | null = null;
    private static initialized = false;

    /** Lazily create AudioContext */
    private static getContext(): AudioContext {
        if (!this.context) {
            this.context = new AudioContext();
            this.autoResume(this.context);
        }
        return this.context;
    }

    /** Attach global listeners to auto-resume context on first user gesture */
    private static autoResume(ctx: AudioContext) {
        if (this.initialized) return;
        this.initialized = true;

        const resume = async () => {
            if (ctx.state === "suspended") {
                try {
                    await ctx.resume();
                } catch (err) {
                    console.warn("AudioContext resume failed:", err);
                }
            }
            window.removeEventListener("click", resume);
            window.removeEventListener("keydown", resume);
            window.removeEventListener("touchstart", resume);
        };

        window.addEventListener("click", resume);
        window.addEventListener("keydown", resume);
        window.addEventListener("touchstart", resume);
    }

    protected async fetchResource(src: string): Promise<AudioBuffer> {
        const RESPONSE: Response = await fetch(src);
        const ARRAY_BUFFER: ArrayBuffer = await RESPONSE.arrayBuffer();

        return await AudioLoader.getContext().decodeAudioData(ARRAY_BUFFER);
    }

    public LoadAudio(src: string, type?: ContentLoadType): LoaderLoadResultType<AudioResource> {
        const { id, promise } = this.Load(src, type);
        const WRAPPED_PROMISE: Promise<AudioResource> = promise.then(buffer => {
            return new AudioResource(id, src, buffer);
        });

        return [id, WRAPPED_PROMISE];
    }
}

export default new AudioLoader();
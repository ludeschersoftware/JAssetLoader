import AbstractLoader from "../Abstracts/AbstractLoader";
import ContentLoadType from "../Enums/ContentLoadType";
import AudioResource from "../Resources/AudioResource";
import LoaderLoadResultType from "../Types/LoaderLoadResultType";

class AudioLoader extends AbstractLoader<AudioBuffer> {
    private static CONTEXT: AudioContext | null = null;

    private static getContext(): AudioContext {
        if (!this.CONTEXT) {
            this.CONTEXT = new AudioContext();
        }
        return this.CONTEXT;
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
import AbstractLoader from "./AbstractLoader";
import AudioResource from "./AudioResource";
import ContentLoadType from "./ContentLoadType";

class AudioLoader extends AbstractLoader<AudioBuffer> {
    private static CONTEXT = new AudioContext();

    protected async fetchResource(src: string): Promise<AudioBuffer> {
        const response = await fetch(src);
        const arrayBuffer = await response.arrayBuffer();
        return await AudioLoader.CONTEXT.decodeAudioData(arrayBuffer);
    }

    public LoadAudio(src: string, type: ContentLoadType) {
        const { id, promise } = this.Load(src, type);
        const audioRes = new AudioResource(id, src);

        const wrappedPromise = promise.then(buffer => {
            audioRes.ContentLoaded(buffer);
            return audioRes;
        });

        return { id, resource: audioRes, promise: wrappedPromise };
    }
}

export default new AudioLoader();
import AbstractResource from "../Abstracts/AbstractResource";

class AudioResource extends AbstractResource<AudioBuffer> {
    constructor(id: string, src: string, content: AudioBuffer) {
        super(id, src, content);
    }
}

export default AudioResource;

import AbstractResource from "../Abstracts/AbstractResource";

class AudioResource extends AbstractResource<AudioBuffer> {
    constructor(id: string, src: string) {
        super(id, src);
    }
}

export default AudioResource;

import AbstractLoader from "../Abstracts/AbstractLoader";
import WrappedPromiseInterface from "../Interfaces/WrappedPromiseInterface";
import JsonResource from "../Resources/JsonResource";

class JsonLoader extends AbstractLoader<any> {
    public LoadJson<T = any>(src: string, cache?: boolean): WrappedPromiseInterface<JsonResource<T>> {
        const { id, promise } = this.Load(src, cache);
        const WRAPPED_PROMISE: Promise<JsonResource<T>> = promise.then(json => {
            return new JsonResource<T>(id, src, json as T);
        });

        return {
            id,
            promise: WRAPPED_PROMISE,
        };
    }

    protected async fetchResource(src: string): Promise<any> {
        const RESPONSE: Response = await fetch(src);

        if (!RESPONSE.ok) {
            throw new Error(`Failed to fetch JSON: ${RESPONSE.status}`);
        }

        return await RESPONSE.json();
    }
}

export default new JsonLoader();
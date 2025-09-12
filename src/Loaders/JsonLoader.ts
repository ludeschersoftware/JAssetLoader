import AbstractLoader from "../Abstracts/AbstractLoader";
import ContentLoadType from "../Enums/ContentLoadType";
import JsonResource from "../Resources/JsonResource";
import LoaderLoadResultType from "../Types/LoaderLoadResultType";

class JsonLoader extends AbstractLoader<any> {
    protected async fetchResource(src: string): Promise<any> {
        const RESPONSE: Response = await fetch(src);

        if (!RESPONSE.ok) {
            throw new Error(`Failed to fetch JSON: ${RESPONSE.status}`);
        }

        return await RESPONSE.json();
    }

    public LoadJson<T = any>(src: string, type: ContentLoadType): LoaderLoadResultType<JsonResource<T>> {
        const { id, promise } = this.Load(src, type);
        const WRAPPED_PROMISE: Promise<JsonResource<T>> = promise.then(json => {
            return new JsonResource<T>(id, src, json as T);
        });

        return [id, WRAPPED_PROMISE];
    }
}

export default new JsonLoader();
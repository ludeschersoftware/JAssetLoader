import AbstractLoader from "./AbstractLoader";
import ContentLoadType from "./ContentLoadType";
import JsonResource from "./JsonResource";

class JsonLoader extends AbstractLoader<any> {
    protected async fetchResource(src: string): Promise<any> {
        const response = await fetch(src);

        if (!response.ok) {
            throw new Error(`Failed to fetch JSON: ${response.status}`);
        }

        return await response.json();
    }

    public LoadJson<T = any>(src: string, type: ContentLoadType) {
        const { id, promise } = this.Load(src, type);
        const resource = new JsonResource<T>(id, src);

        const wrappedPromise = promise.then(json => {
            resource.ContentLoaded(json as T);
            return resource;
        });

        return { id, resource, promise: wrappedPromise };
    }
}

export default new JsonLoader();
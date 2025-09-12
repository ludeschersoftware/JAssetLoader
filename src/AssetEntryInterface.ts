import { TrackedPromise } from "@ludeschersoftware/promise";
import AbstractResource from "./AbstractResource";

interface AssetEntryInterface<TResource extends AbstractResource<TContent>, TContent> {
    tracked: TrackedPromise<TContent>;
    resource: TResource;
};

export default AssetEntryInterface;
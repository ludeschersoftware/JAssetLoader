import { TrackedPromise } from "@ludeschersoftware/promise";
import AbstractResource from "../Abstracts/AbstractResource";

interface AssetEntryInterface<TResource extends AbstractResource<TContent>, TContent> {
    tracked: TrackedPromise<TContent>;
    resource: TResource;
};

export default AssetEntryInterface;
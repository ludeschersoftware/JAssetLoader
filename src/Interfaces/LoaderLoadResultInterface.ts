interface LoaderLoadResultInterface<TResource> {
    id: string;
    promise: Promise<TResource>;
}

export default LoaderLoadResultInterface;
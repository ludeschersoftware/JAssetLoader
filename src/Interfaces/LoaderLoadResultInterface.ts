interface LoaderLoadResultInterface<T> {
    id: string;
    promise: Promise<T>;
}

export default LoaderLoadResultInterface;
interface WrappedPromiseInterface<T> {
    id: string;
    promise: Promise<T>;
}

export default WrappedPromiseInterface;
import AbstractResource from "../Abstracts/AbstractResource";

type LoaderLoadResultType<T extends AbstractResource<any>> = [string, Promise<T>];

export default LoaderLoadResultType;
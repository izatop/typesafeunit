import {isFunction} from "@typesafeunit/util";
import {ResolvableValue} from "../interfaces";
import {Service} from "./Service";

export class ServiceFactory<T> extends Service<T> {
    protected readonly resolver: ResolvableValue<T>;

    constructor(resolver: ResolvableValue<T>) {
        super();
        this.resolver = resolver;
    }

    public static create<T>(resolver: ResolvableValue<T>) {
        return new ServiceFactory(resolver);
    }

    public async resolve(): Promise<T> {
        if (isFunction(this.resolver)) {
            return this.resolver();
        }

        return this.resolver;
    }
}

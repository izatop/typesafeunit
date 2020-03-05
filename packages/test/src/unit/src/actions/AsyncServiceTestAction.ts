import {Action, ActionHooks} from "@typesafeunit/unit";
import {assert, isString} from "@typesafeunit/util";
import {IResolveAsyncContext} from "../interfaces";

export class AsyncServiceTestAction extends Action<IResolveAsyncContext, { key: string }> {
    public static get hooks(): ActionHooks<AsyncServiceTestAction> {
        return {
            validate: (schema) => schema.add("key", (v) => assert(isString(v))),
        };
    }

    public async run() {
        const {key} = this.state;
        const {memoryDb, randomBytes} = this.context;
        const value = randomBytes.toString("hex");
        memoryDb.set(key, value);

        return value;
    }
}
import {Action, Context} from "@bunt/unit";
import {Promisify} from "@bunt/util";
import {HandlerReturn, HandlerState} from "./interfaces";
import {Message, MessagePayload} from "./Queue";

export abstract class Handler<C extends Context, M extends Message>
    extends Action<C, HandlerState<M>, HandlerReturn<M>> {
    protected get payload(): MessagePayload<M> {
        return this.state.payload;
    }

    public abstract run(): Promisify<HandlerReturn<M>>;
}

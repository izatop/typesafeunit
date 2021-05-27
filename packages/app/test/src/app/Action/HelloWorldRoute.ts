import {Bool, Fields, Int, Text, ToNumber} from "@bunt/input";
import {Action} from "@bunt/unit";
import {Resolver, RouteRule} from "../../../../src";
import {route} from "../../route";
import {BaseContext} from "../Context/BaseContext";

interface IHelloWorldActionState {
    id: number;
    payload: {
        name: string;
    };
    option?: boolean;
}

export class HelloWorldAction extends Action<BaseContext, IHelloWorldActionState> {
    public run(): string {
        const {payload} = this.state;
        return `Hello, ${payload.name}!`;
    }
}

export default route(
    HelloWorldAction,
    new RouteRule(
        "/u/:id",
        () => new Fields({
            id: new ToNumber(Int),
            payload: () => new Fields({name: Text}),
            option: Bool,
        }),
        new Resolver({
            id: ({args}) => args.get("id"),
            payload: ({request}) => request.toObject(),
            option: () => false,
        }),
    ),
);

import {ActionCtor} from "@typesafeunit/unit";
import {ILogable} from "@typesafeunit/util";
import {RouteAction} from "../interfaces";
import {IRoute, IRouteMatcher, RouteConfig, RouteConfigState, RouteConfigValidate} from "./interfaces";

export abstract class RouteAbstract<A extends RouteAction = RouteAction>
    implements IRoute, ILogable<{ route: string }> {
    public readonly action: ActionCtor<A>;
    public readonly route: string;
    public readonly validate?: RouteConfigValidate<A>;
    public readonly state?: RouteConfigState<A>;

    public abstract readonly matcher: IRouteMatcher;

    constructor(action: ActionCtor<A>, config: RouteConfig<A>) {
        this.action = action;
        this.route = config.route;
        this.validate = config.validate;
        if (RouteAbstract.hasState(config)) {
            this.state = config.state;
        }
    }

    private static hasState<A>(config: RouteConfig<A>): config is RouteConfig<A> & { state: RouteConfigState<A> } {
        return Reflect.has(config, "state");
    }

    public getLogValue(): { route: string } {
        return {route: this.route};
    }

    public test(route: string): boolean {
        return this.matcher.test(route);
    }

    public match(route: string): Record<string, string> {
        return this.matcher.match(route);
    }
}

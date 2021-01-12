import {Context, ContextArg, unit, Unit} from "@bunt/unit";
import {assert, isDefined, isInstanceOf, logger, Logger} from "@bunt/util";
import {IRequest, MatchRoute, RouteResponse} from "./interfaces";
import {IRoute, RouteNotFound} from "./Route";

export class Application<U extends Unit<C>, C> {
    @logger
    public logger!: Logger;

    protected readonly unit: U;
    protected readonly route: IRoute[] = [];

    constructor(u: U) {
        this.unit = u;
    }

    public get size(): number {
        return this.route.length;
    }

    public static async factory<C extends Context>(
        context: ContextArg<C>,
        routes: MatchRoute<C, IRoute>[] = []): Promise<Application<Unit<C>, C>> {
        const app = new this<Unit<C>, C>(await unit(context));
        if (routes.length > 0) {
            routes.forEach((route) => app.add(route));
        }

        return app;
    }

    public add<R extends IRoute>(route: MatchRoute<C, R>): this {
        this.logger.debug("add", route);
        assert(!this.unit.has(route.action), `This route was already added`);
        this.unit.add(route.action);
        this.route.push(route);
        return this;
    }

    public remove<R extends IRoute>(route: MatchRoute<C, R>): this {
        if (this.unit.has(route.action)) {
            this.logger.debug("remove", route);
            this.unit.remove(route.action);
            const index = this.route.findIndex((item) => item === route);
            this.route.splice(index, index + 1);
        }

        return this;
    }

    public async handle<R extends IRequest>(request: R): Promise<void> {
        const finish = this.logger.perf("handle", request);

        try {
            assert(request.validate(), "Invalid Request");
            await request.respond(await this.run(request));
        } catch (error) {
            if (!request.complete) {
                await request.respond(error);
            }

            if (isInstanceOf(error, Error)) {
                throw error;
            }
        } finally {
            finish();
        }
    }

    public async run<R extends IRequest>(request: R): Promise<RouteResponse> {
        for (const route of this.route) {
            if (route.test(request.route)) {
                this.logger.debug("match", route);

                const state: Record<string, any> = {};
                const context = await this.unit.getContext();
                const matches = route.match(request.route);
                const routeContext = {
                    request,
                    context,
                    args: new Map<string, string>(Object.entries(matches)),
                };

                if (isDefined(route.payload)) {
                    const {payload} = route;
                    Object.assign(state, await payload.validate(routeContext));
                }

                return this.unit.run(route.action, state);
            }
        }

        throw new RouteNotFound(request.route);
    }

    public getRoutes(): IRoute[] {
        return this.route;
    }
}

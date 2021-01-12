import {Context, Unit} from "@bunt/unit";
import {AsyncServiceTestAction} from "../../../test/src/actions/AsyncServiceTestAction";
import {MainContext} from "../../../test/src/context/MainContext";
import {MemoryDb} from "../../../test/src/context/services/MemoryDb";

test("Context", async () => {
    const state = {key: "key"};
    const asyncContext = new MainContext();
    const context = await Context.apply(asyncContext);
    const {memoryDb} = context;

    expect(memoryDb).toBeInstanceOf(MemoryDb);
    expect(context === await Context.apply(asyncContext)).toBe(true);
    expect(await asyncContext.memoryDb.resolve()).toBeInstanceOf(MemoryDb);
    expect(await context.getMemoryDb()).toBeInstanceOf(MemoryDb);
    expect(await context.getMemoryDb() === context.memoryDb).toBe(true);

    expect(context.parentDb).toBeInstanceOf(MemoryDb);
    expect(context.randomBytes).not.toStrictEqual(context.randomBytes);
    expect(context.randomBytes).toBeInstanceOf(Buffer);

    const unit = await Unit.factory(() => context, [AsyncServiceTestAction]);
    const res = await unit.run(AsyncServiceTestAction, state);
    expect(memoryDb.get(state.key)).toBe(res);
});

import {isBoolean} from "@bunt/util";
import {ScalarType} from "./ScalarType";

export const Bool = new ScalarType<boolean>({
    name: "Bool",
    validate(payload) {
        this.assert(isBoolean(payload), `Wrong payload: ${this.name} expected`, payload);
        return payload;
    },
});

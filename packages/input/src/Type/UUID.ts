import {isString} from "@bunt/util";
import {ScalarType} from "./ScalarType";

const RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89AB][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const UUID = new ScalarType<string>({
    name: "UUID",
    validate(payload) {
        this.assert(isString(payload) && RE.test(payload), `Wrong payload: ${this.name} expected`, payload);

        return payload;
    },
});

import type {
    StringSchema,
    NumberSchema,
    BooleanSchema,
    BigintSchema,
    OptionalSchema,
    SchemaWithFallback,
    BaseSchema,
} from "valibot"

type _IsSchema = {
    type: string
    kind: "schema"
    "~run": unknown
    "~standard": unknown
}

function _isSchema<$x>(t: $x): t is Extract<$x, _IsSchema> {
    return (
        typeof t === "object" &&
        t !== null &&
        "type" in t &&
        "kind" in t &&
        "~run" in t &&
        "~standard" in t &&
        t.kind === "schema"
    )
}

export function isString<$x>(x: $x): x is Extract<$x, StringSchema<any>> {
    return _isSchema(x) && x.type === "string"
}

export function isNumber<$x>(x: $x): x is Extract<$x, NumberSchema<any>> {
    return _isSchema(x) && x.type === "number"
}

export function isBoolean<$x>(x: $x): x is Extract<$x, BooleanSchema<any>> {
    return _isSchema(x) && x.type === "boolean"
}

export function isBigint<$x>(x: $x): x is Extract<$x, BigintSchema<any>> {
    return _isSchema(x) && x.type === "bigint"
}

export function isOptional<$x>(x: $x): x is Extract<$x, OptionalSchema<any, any>> {
    return _isSchema(x) && x.type === "optional"
}

export function isFallback<$x>(
    x: $x
): x is Extract<$x, SchemaWithFallback<BaseSchema<any, any, any>, any>> {
    return _isSchema(x) && "fallback" in x
}

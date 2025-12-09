import { isBigint, isBoolean, isFallback, isNumber, isOptional, isString } from "./is.ts"
import type { BaseSchema, BaseValidation, BaseMetadata, BaseTransformation } from "valibot"
import { optional, fallback, pipe, string, toNumber, transform, regex, unwrap } from "valibot"

type $item =
    | BaseSchema<any, any, any>
    | BaseValidation<any, any, any>
    | BaseTransformation<any, any, any>
    | BaseMetadata<any>

function createFallback<$items extends $item[], $default>(items: $items, _default?: $default): any {
    return fallback(optional(pipe(string(), ...items), _default as any), _default)
}

export function mod<$schema extends BaseSchema<unknown, unknown, any>>(schema: $schema): $schema {
    let _default: any

    if (isFallback(schema)) {
        _default = schema.fallback
    }

    if (isOptional(schema)) {
        _default = schema.default
        schema = unwrap(schema)
    }

    if (isString(schema)) {
        return createFallback([schema], _default)
    }

    if (isNumber(schema)) {
        return createFallback([toNumber(), schema], _default)
    }

    if (isBoolean(schema)) {
        return createFallback([transform((it) => it.toLowerCase() === "true"), schema], _default)
    }

    if (isBigint(schema)) {
        return createFallback(
            [
                regex(/^-?[0-9]*n?$/),
                transform((it) => it.replace(/n/, "")),
                transform((it) => BigInt(it)),
                schema,
            ],
            _default
        )
    }

    return createFallback([schema])
}

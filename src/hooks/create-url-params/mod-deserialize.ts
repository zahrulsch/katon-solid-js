import type {
    BaseSchema,
    ObjectSchema,
    ObjectEntries,
    OptionalSchema,
    SchemaWithFallback,
} from "valibot"
import { mod } from "./mod.ts"
import * as v from "valibot"

export function modDeserialize<$schema extends ObjectSchema<ObjectEntries, any>>(
    schema: $schema
): ModDeserialize<$schema> {
    const entries = Object.entries(schema.entries).reduce((prev, [key, value]) => {
        prev[key] = mod(value)
        return prev
    }, {} as ObjectEntries)

    return v.object(entries) as any
}

export type ModDeserialize<$schema extends ObjectSchema<ObjectEntries, any>> = ObjectSchema<
    {
        [K in keyof $schema["entries"]]: ModEntry<$schema["entries"][K]>
    },
    undefined
>

export type ModEntry<$schema extends BaseSchema<unknown, unknown, any>> =
    $schema extends OptionalSchema<any, any>
        ? $schema
        : $schema extends SchemaWithFallback<infer $innerSchema, infer $fallback>
        ? OptionalSchema<$innerSchema, $fallback>
        : OptionalSchema<$schema, undefined>

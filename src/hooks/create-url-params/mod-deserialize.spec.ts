import * as v from "valibot"
import { expect, it } from "vitest"
import { modDeserialize } from "./mod-deserialize.ts"

it("check getDefaults", () => {
    const schema = v.object({
        date: v.number(),
        age: v.fallback(v.number(), 1),
        order: v.fallback(v.optional(v.number(), 1), 1),
        name: v.optional(v.string(), ""),
    })

    const _defaults = v.getDefaults(modDeserialize(schema))

    expect(_defaults).toEqual({
        age: expect.any(Number),
        order: expect.any(Number),
        name: expect.any(String),
    })
})

it("check if input nullable must be error", () => {
    const schema = v.object({
        date: v.number(),
        age: v.fallback(v.number(), 1),
        order: v.fallback(v.optional(v.number(), 1), 1),
        name: v.optional(v.string(), ""),
    })

    const result0 = v.safeParse(modDeserialize(schema), null)
    expect(result0.issues).not.toBeUndefined()

    const result1 = v.safeParse(modDeserialize(schema), "")
    expect(result1.issues).not.toBeUndefined()

    const result2 = v.safeParse(modDeserialize(schema), undefined)
    expect(result2.issues).not.toBeUndefined()

    const result3 = v.safeParse(modDeserialize(schema), {})
    expect(result3.issues).toBeUndefined()
})

it("check real input", () => {
    const schema = v.object({
        date: v.number(),
        age: v.fallback(v.number(), 1),
        order: v.fallback(v.optional(v.number(), 1), 1),
        name: v.optional(v.string(), ""),
    })

    const parse = v.parser(modDeserialize(schema))

    expect(parse({})).toEqual({ age: 1, order: 1, name: "" })
    expect(parse({ age: "2" })).toEqual({ age: 2, order: 1, name: "" })
    expect(parse({ age: null })).toEqual({ age: 1, order: 1, name: "" })
    expect(parse({ order: "3" })).toEqual({ age: 1, order: 3, name: "" })
})

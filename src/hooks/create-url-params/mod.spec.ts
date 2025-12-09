import { expect, it } from "vitest"
import { mod } from "./mod.ts"
import * as v from "valibot"

const parse = v.parse

it("mod string", () => {
    const schema = mod(v.string())
    expect(parse(schema, null)).toBe(undefined)
    expect(parse(schema, "")).toBe("")
    expect(parse(schema, "content")).toBe("content")
})

it("mod number", () => {
    const schema = mod(v.number())
    expect(parse(schema, null)).toBe(undefined)
    expect(parse(schema, "sdcvdsc")).toBe(undefined)
    expect(parse(schema, "")).toBe(0)
    expect(parse(schema, "1")).toBe(1)
    expect(parse(schema, "-1")).toBe(-1)
})

it("mod boolean", () => {
    const schema = mod(v.boolean())
    expect(parse(schema, null)).toBe(undefined)
    expect(parse(schema, "")).toBe(false)
    expect(parse(schema, "1")).toBe(false)
    expect(parse(schema, "true")).toBe(true)
    expect(parse(schema, "TRUE")).toBe(true)
})

it("mod bigint", () => {
    const schema = mod(v.bigint())
    expect(parse(schema, null)).toBe(undefined)
    expect(parse(schema, "")).toBe(0n)
    expect(parse(schema, "1")).toBe(1n)
    expect(parse(schema, "-1")).toBe(-1n)
    expect(parse(schema, "1n")).toBe(1n)
    expect(parse(schema, "-1n")).toBe(-1n)
})

it("mod optional no default", () => {
    const schema = mod(v.optional(v.number()))
    expect(parse(schema, null)).toBe(undefined)
    expect(parse(schema, "")).toBe(0)
    expect(parse(schema, "1")).toBe(1)
})

it("mod optional with default", () => {
    const schema = mod(v.optional(v.number(), 10))
    expect(parse(schema, null)).toBe(10)
    expect(parse(schema, "")).toBe(0)
    expect(parse(schema, "hgh")).toBe(10)
    expect(parse(schema, "1")).toBe(1)
    expect(parse(schema, "-1")).toBe(-1)
})

it("mod pipe", () => {
    const schema = mod(v.pipe(v.number(), v.minValue(1)))
    expect(parse(schema, null)).toBe(undefined)
    expect(parse(schema, "")).toBe(undefined)
    expect(parse(schema, "hgh")).toBe(undefined)
    expect(parse(schema, "0")).toBe(undefined)
    expect(parse(schema, "10")).toBe(10)
    expect(parse(schema, "-1")).toBe(undefined)
})

it("mod fallback 0", () => {
    const schema = mod(v.fallback(v.pipe(v.number(), v.minValue(1)), 50))
    expect(parse(schema, null)).toBe(50)
    expect(parse(schema, "")).toBe(50)
    expect(parse(schema, "hgh")).toBe(50)
    expect(parse(schema, "0")).toBe(50)
    expect(parse(schema, "5")).toBe(5)
    expect(parse(schema, "-1")).toBe(50)
})

it("mod fallback 1", () => {
    const schema = mod(v.fallback(v.optional(v.number()), 10))
    expect(parse(schema, null)).toBe(undefined)
    expect(parse(schema, "")).toBe(0)
    expect(parse(schema, "hgh")).toBe(undefined)
    expect(parse(schema, "0")).toBe(0)
    expect(parse(schema, "5")).toBe(5)
    expect(parse(schema, "-1")).toBe(-1)
})

it("mod fallback 2", () => {
    const schema = mod(v.fallback(v.number(), 10))
    expect(parse(schema, null)).toBe(10)
    expect(parse(schema, "")).toBe(0)
    expect(parse(schema, "hgh")).toBe(10)
    expect(parse(schema, "0")).toBe(0)
    expect(parse(schema, "5")).toBe(5)
    expect(parse(schema, "-1")).toBe(-1)
})

it("check default", () => {
    expect(v.getDefault(mod(v.number()))).toBe(undefined)
    expect(v.getDefault(mod(v.fallback(v.number(), 1)))).toBe(1)
    expect(v.getDefault(mod(v.optional(v.number(), 1)))).toBe(1)
})

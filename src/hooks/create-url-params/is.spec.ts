import { expect, it } from "vitest"
import { isBigint, isBoolean, isFallback, isNumber, isOptional, isString } from "./is.ts"
import * as v from "valibot"

it("isString", () => {
    expect(isString(v.string())).toBe(true)
    expect(isString(v.number())).toBe(false)
    expect(isString(v.boolean())).toBe(false)
    expect(isString(v.object({}))).toBe(false)
})

it("isNumber", () => {
    expect(isNumber(v.string())).toBe(false)
    expect(isNumber(v.number())).toBe(true)
    expect(isNumber(v.boolean())).toBe(false)
    expect(isNumber(v.object({}))).toBe(false)
})

it("isBoolean", () => {
    expect(isBoolean(v.string())).toBe(false)
    expect(isBoolean(v.number())).toBe(false)
    expect(isBoolean(v.boolean())).toBe(true)
    expect(isBoolean(v.object({}))).toBe(false)
})

it("isBigint", () => {
    expect(isBigint(v.string())).toBe(false)
    expect(isBigint(v.number())).toBe(false)
    expect(isBigint(v.boolean())).toBe(false)
    expect(isBigint(v.object({}))).toBe(false)
    expect(isBigint(v.bigint())).toBe(true)
})

it("isOptional", () => {
    expect(isOptional(v.string())).toBe(false)
    expect(isOptional(v.number())).toBe(false)
    expect(isOptional(v.boolean())).toBe(false)
    expect(isOptional(v.object({}))).toBe(false)
    expect(isOptional(v.bigint())).toBe(false)
    expect(isOptional(v.optional(v.string()))).toBe(true)
})

it("isFallback", () => {
    expect(isFallback(v.string())).toBe(false)
    expect(isFallback(v.number())).toBe(false)
    expect(isFallback(v.boolean())).toBe(false)
    expect(isFallback(v.object({}))).toBe(false)
    expect(isFallback(v.bigint())).toBe(false)
    expect(isFallback(v.fallback(v.string(), ""))).toBe(true)
})

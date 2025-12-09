// advance only, jangan ubah jika kamu noob
// extends matchers

import { expect } from "vitest"
import { sleep } from "./utils"

function createUrlSearchParams(received: string | URLSearchParams) {
    return typeof received === "string" ? new URLSearchParams(received) : received
}

function convertStringValueOf(value: unknown): string | null {
    if (typeof value === "string" || value === null) return value
    return String(value)
}

function convertObject(object: unknown) {
    if (typeof object !== "object" || object === null)
        throw Error(`gagal konversi object ${JSON.stringify(object)}`)

    return Object.entries(object).reduce((prev, [key, value]) => {
        prev[key] = convertStringValueOf(value)
        return prev
    }, {} as any)
}

expect.extend({
    async toContainParams(received, expected, delayMs = 0) {
        await sleep(delayMs)

        if (typeof received === "function") received = received()

        const isString = typeof received === "string"
        const isUrlSearchParams = received instanceof URLSearchParams

        if (!isString && !isUrlSearchParams) {
            const message = () => `object tidak bisa dibandingkan "${JSON.stringify(received)}"`
            return { pass: false, message }
        }

        if (typeof expected !== "object" && expected === null) {
            const message = () => `ekspektasi tidak bisa dibandingkan "${JSON.stringify(expected)}"`
            return { pass: false, message }
        }

        const urlSearchParams = createUrlSearchParams(received)
        const paramObject = Object.fromEntries(urlSearchParams.entries())

        const pass = this.equals(paramObject, convertObject(expected))

        return {
            pass,
            message: () => `\n${this.utils.diff(convertObject(expected), paramObject)}`,
        }
    },
})

interface CustomMatcher {
    toContainParams: <E>(expected: E, delayMs?: number) => Promise<void>
}

declare module "vitest" {
    interface Matchers extends CustomMatcher {}
}

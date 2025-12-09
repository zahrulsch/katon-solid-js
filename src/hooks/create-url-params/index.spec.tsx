import { beforeEach, expect, it } from "vitest"
import { createUrlParams } from "./index"
import { renderHook } from "@solidjs/testing-library"
import * as v from "valibot"

beforeEach(async () => await navigate("/", 10))

it("check render createUrlParams with manual type checking", async () => {
    // @ts-ignore
    const { result } = renderHook(
        () =>
            createUrlParams(
                v.object({
                    page: v.number(),
                    query: v.optional(v.string(), "query"),
                }),
                {
                    transform(result) {
                        return { pagination: result, $type: "query" as const }
                    },
                }
            ),
        {
            wrapper,
        }
    )
})

it.each([
    { url: "/", query: { page: 1 } },
    { url: "/?page=2", query: { page: 2 } },
    { url: "/?page=nan", query: { page: 1 } },
    { url: "/?limit=10", query: { page: 1, limit: 10 } },
    { url: "/?limit=1&page=3&query=shell&limit=10", query: { page: 3, limit: 10, query: "shell" } },
])("state === query, initial render $url $query", async ({ url, query }) => {
    await navigate(url, 10)

    const { result } = renderHook(createUrlParams, {
        initialProps: [
            v.object({
                page: v.optional(v.number(), 1),
                limit: v.number(),
                query: v.string(),
            }),
        ],
        wrapper,
    })

    expect(result.query).toEqual(query)
    expect(result.state).toEqual(query)
})

it.each([
    { url: "/", query: { p: 1 } },
    { url: "/?page=2", query: { p: 2 } },
    { url: "/?page=nan", query: { p: 1 } },
    { url: "/?limit=10", query: { p: 1, l: 10 } },
    { url: "/?limit=1&page=3&query=shell&limit=10", query: { p: 3, l: 10, q: "shell" } },
])("state === query, with rename,initial render $url $query", async ({ url, query }) => {
    await navigate(url, 10)

    const { result } = renderHook(createUrlParams, {
        initialProps: [
            v.object({
                p: v.optional(v.number(), 1),
                l: v.number(),
                q: v.string(),
            }),
            {
                rename: {
                    p: "page",
                    l: "limit",
                    q: "query",
                },
            },
        ],
        wrapper,
    })

    expect(result.query).toEqual(query)
    expect(result.state).toEqual(query)
})

it("transform and rename, with reactive check", async () => {
    await navigate("/?")

    const schema = v.object({ l: v.number(), p: v.pipe(v.string(), v.nonEmpty()) })
    const { result } = renderHook(
        () =>
            createUrlParams(schema, {
                rename: { l: "limit", p: "point" },
                transform(result) {
                    return {
                        data: {
                            limit: result.l,
                            point: result.p,
                        },
                    }
                },
            }),
        { wrapper }
    )

    expect(result.state).toEqual({ l: undefined, p: undefined })
    expect(result.query).toEqual({ data: { limit: undefined, point: undefined } })

    await navigate("?limit=10&point=key")
    expect(result.state).toEqual({ l: 10, p: "key" })
    expect(result.query).toEqual({ data: { limit: 10, point: "key" } })

    await navigate("/?")
    expect(result.state).toEqual({ l: undefined, p: undefined })
    expect(result.query).toEqual({ data: { limit: undefined, point: undefined } })

    await navigate("?limit=&point=")
    expect(result.state).toEqual({ l: 0, p: undefined })
    expect(result.query).toEqual({ data: { limit: 0, point: undefined } })
})

it("check updateState function behavior", () => {
    const schema = v.object({
        limit: v.optional(v.number(), 10),
        query: v.pipe(v.string(), v.nonEmpty()),
    })

    const { result } = renderHook(() => createUrlParams(schema), { wrapper })

    result.updateState({ limit: 20 })
    expect(result.state).toEqual({ limit: 20 })
    expect(result.query).toEqual({ limit: 10 })

    result.updateState({ limit: null })
    expect(result.state).toEqual({ limit: 10 })
    expect(result.query).toEqual({ limit: 10 })

    result.updateState({ query: "" })
    expect(result.state).toEqual({ limit: 10 })
    expect(result.query).toEqual({ limit: 10 })

    result.updateState({})
    expect(result.state).toEqual({ limit: 10 })
    expect(result.query).toEqual({ limit: 10 })

    result.updateState({ query: "query" })
    expect(result.state).toEqual({ limit: 10, query: "query" })
    expect(result.query).toEqual({ limit: 10 })

    result.updateState({ query: "query", limit: 20 })
    expect(result.state).toEqual({ limit: 20, query: "query" })
    expect(result.query).toEqual({ limit: 10 })

    result.updateState({ query: null, limit: null })
    expect(result.state).toEqual({ limit: 10 })
    expect(result.query).toEqual({ limit: 10 })
})

// flush previous state change(merge if any update), and then navigate it
it("check navigateState function behavior", async ({ annotate }) => {
    await navigate("?limit=10")

    const schema = v.object({ page: v.pipe(v.number(), v.minValue(1)) })
    const { result } = renderHook(() => createUrlParams(schema), { wrapper })

    result.navigateState()
    await expect(() => location.search).toContainParams({ limit: 10 })

    result.navigateState({ page: 1 })
    await expect(() => location.search).toContainParams({ limit: 10, page: 1 })
    expect(result.state).toEqual({ page: 1 })
    expect(result.query).toEqual({ page: 1 })

    await annotate("harusnya tidak mau navigate karena tidak memenuhi constraint")

    result.navigateState({ page: -1 })
    await expect(() => location.search).toContainParams({ limit: 10, page: 1 })
    expect(result.state).toEqual({ page: 1 })
    expect(result.query).toEqual({ page: 1 })

    result.navigateState({ page: null })
    await expect(() => location.search).toContainParams({ limit: 10 })
    expect(result.state).toEqual({})
    expect(result.query).toEqual({})

    result.updateState({ page: 10 })
    expect(result.state).toEqual({ page: 10 })
    expect(result.query).toEqual({})
    await expect(() => location.search).toContainParams({ limit: 10 })

    result.navigateState()
    await expect(() => location.search).toContainParams({ limit: 10, page: 10 })
    expect(result.query).toEqual({ page: 10 })

    result.navigateState({ page: 2 })
    await expect(() => location.search).toContainParams({ limit: 10, page: 2 })
    expect(result.query).toEqual({ page: 2 })

    result.updateState({ page: null })
    await expect(() => location.search).toContainParams({ limit: 10, page: 2 })
    expect(result.state).toEqual({})
    expect(result.query).toEqual({ page: 2 })
    result.navigateState()
    await expect(() => location.search).toContainParams({ limit: 10 })
})

it("check updateState & navigateState with rename case", async () => {
    await navigate("?unknown=keyword")

    const schema = v.object({
        page: v.optional(v.number(), 1),
        limit: v.number(),
        query: v.string(),
    })

    const { result } = renderHook(
        () =>
            createUrlParams(schema, {
                rename: {
                    page: "_page",
                    limit: "_limit",
                },
            }),
        { wrapper }
    )

    expect(result.state).toEqual({ page: 1 })
    expect(result.query).toEqual({ page: 1 })

    result.updateState({ page: 1, limit: 10 })
    expect(result.state).toEqual({ page: 1, limit: 10 })
    expect(result.query).toEqual({ page: 1 })

    await expect(() => location.search).toContainParams({ unknown: "keyword" })

    result.navigateState()
    await expect(() => location.search).toContainParams({
        unknown: "keyword",
        // _page tidak ada karena bernilai sama dengan default
        _limit: 10,
    })
    expect(result.state).toEqual({ page: 1, limit: 10 })
    expect(result.query).toEqual({ page: 1, limit: 10 })

    result.updateState({ limit: null })
    expect(result.state).toEqual({ page: 1 })
    result.navigateState()

    await expect(() => location.search).toContainParams({ unknown: "keyword" })
    expect(result.state).toEqual({ page: 1 })
    expect(result.query).toEqual({ page: 1 })

    result.navigateState({ limit: 10 })
    await expect(() => location.search).toContainParams({ _limit: 10, unknown: "keyword" })
    result.navigateState({ limit: null, page: 1 })
    await expect(() => location.search).toContainParams({ unknown: "keyword" })
})

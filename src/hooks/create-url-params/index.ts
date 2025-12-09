import * as v from "valibot"
import { modDeserialize, type ModDeserialize } from "./mod-deserialize"
import { useLocation, useSearchParams } from "@solidjs/router"
import { createEffect, createMemo as memo, on } from "solid-js"
import { reconcile, createStore as store } from "solid-js/store"

type ValiObject = v.ObjectSchema<v.ObjectEntries, any>
type DeserializedOf<$schema extends ValiObject> = v.InferOutput<ModDeserialize<$schema>>

export type CreateUrlParamsOptions<
    $schema extends ValiObject,
    $transformFn extends TransformFn<ModDeserialize<$schema>>
> = {
    debug?: boolean
    rename?: Partial<Record<keyof $schema["entries"], string>>
    transform?: $transformFn
}

type TransformFn<$schema extends ValiObject> = (
    result: DeserializedOf<$schema>
) => Record<string, unknown>

type DefaultTransformFm<$schema extends ValiObject> = (
    result: DeserializedOf<ModDeserialize<$schema>>
) => DeserializedOf<ModDeserialize<$schema>>

type UpdateStateInput<
    $schema extends ValiObject,
    $schemaInput extends v.InferInput<$schema> = v.InferInput<$schema>
> = {
    [K in keyof $schemaInput]?: $schemaInput[K] | null | undefined
}

export function createUrlParams<
    $schema extends ValiObject,
    $transformFn extends TransformFn<ModDeserialize<$schema>> = DefaultTransformFm<$schema>
>(schema: $schema, options: CreateUrlParamsOptions<$schema, $transformFn> = {}) {
    const location = useLocation()
    const moddedSchema = modDeserialize(schema)
    const searchParams = memo(() => params(location.search, options.rename))

    const [, navigate] = useSearchParams()

    const [query, setQuery] = store(de(moddedSchema, searchParams(), options.transform))
    const [state, setState] = store(de(moddedSchema, searchParams()))

    createEffect(
        on(
            () => [searchParams(), options.transform] as const,
            ([searchParams, transform]) => {
                setQuery(reconcile(de(moddedSchema, searchParams, transform)))
                setState(reconcile(de(moddedSchema, searchParams)))
            },
            { defer: true }
        )
    )

    function _partialCompare(keys: string[], newState: any) {
        // partial check
        const _new = keys.reduce((prev, key) => {
            const value = newState[key]
            const keySchema = schema.entries[key]

            if (value === undefined || value === null) {
                const _default = v.getDefault(keySchema)
                prev[key] = _default || undefined
                return prev
            }

            const result = v.safeParse(keySchema, value)

            if (result.success) prev[key] = result.output

            // for debug
            if (options.debug && !result.success) console.error(result.issues)

            return prev
        }, {} as any)

        return _new
    }

    function updateState(newState: UpdateStateInput<$schema>) {
        if (newState === null && typeof newState !== "object") return

        const keys = Object.keys(newState)
        if (!keys.length) return

        const _new = _partialCompare(keys, newState)
        setState((state) => ({ ...state, ..._new }))
    }

    // handle with rename map, use this when navigating
    function _internalNavigate(arg: Parameters<typeof navigate>[0]): any {
        const entries = Object.entries(arg).map(([key, value]): [string, any] => [
            options.rename?.[key] ? options.rename[key] : key,
            value,
        ])

        navigate(Object.fromEntries(entries))
    }

    function _generateParamsObject<$object extends Record<string, unknown>>(object: $object) {
        const entries = Object.entries(object)
        const defaults = v.getDefaults(schema)

        if (!entries.length) {
            return Object.fromEntries(Object.keys(schema.entries).map((it) => [it, null] as const))
        }

        return Object.entries(defaults).reduce((prev, [key, _default]) => {
            const _value = object[key]
            prev[key] = _value === _default ? null : _value
            return prev
        }, {} as any)
    }

    function navigateState(newState: UpdateStateInput<$schema> = {}) {
        if (newState === null && typeof newState !== "object") {
            return _internalNavigate(_generateParamsObject(state))
        }

        const keys = Object.keys(newState)
        if (!keys.length) {
            return _internalNavigate(_generateParamsObject(state))
        }

        const _new = _partialCompare(keys, newState)
        _internalNavigate(_generateParamsObject({ ...state, ..._new }))
    }

    return { query, state, updateState, navigateState }
}

type De<
    $schema extends ValiObject,
    $transformFn extends TransformFn<$schema>
> = $transformFn extends (result: DeserializedOf<$schema>) => infer $transformed
    ? $transformed
    : DeserializedOf<$schema>

// deserialize proc
function de<
    $schema extends ValiObject,
    $transformFn extends TransformFn<$schema> = DefaultTransformFm<$schema>
>(
    moddedSchema: $schema,
    paramsObject: object,
    transformFn?: $transformFn
): De<$schema, $transformFn> {
    const parser = v.safeParser(moddedSchema)
    const result = parser(paramsObject)

    if (!result.success) {
        const _default = v.getDefaults(moddedSchema) as DeserializedOf<$schema>

        if (transformFn) return transformFn(_default) as any
        return _default as any
    }

    if (transformFn) return transformFn(result.output as DeserializedOf<$schema>) as any
    return result.output as any
}

function params<$rename extends Record<string, string | undefined>>(
    search: string,
    rename: $rename = {} as any
) {
    const reversedRename = reverseObject(rename)
    const instance = new URLSearchParams(search)
    const pairs = Array.from(instance.entries()).map(([key, value]): [string, string] => {
        if (reversedRename[key]) return [reversedRename[key], value]
        return [key, value]
    })

    return Object.fromEntries(pairs)
}

function reverseObject<$object extends Record<string, string | undefined>>(objectTarget: $object) {
    return Object.fromEntries(Object.entries(objectTarget).map(([key, value]) => [value, key]))
}

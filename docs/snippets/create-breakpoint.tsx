// @ts-nocheck

// #region snippet
import { createBreakpoint } from "katon-solid-js/hooks"
import { Show } from "solid-js/web"

export default function Component() {
    // use tailwind as default breakpoint
    const breakpoint = createBreakpoint()
    return (
        <div>
            <Show when={breakpoint.smaller("sm")}>
                {/* the component will be displayed when the screen size 
                is smaller than `sm` */}
            </Show>
            {/* .... */}
        </div>
    )
}
// #endregion snippet

// #region snippetBulma
import { createBreakpoint, bulmaBreakpoint } from "katon-solid-js/hooks"
import { Show } from "solid-js/web"

export default function Component() {
    const breakpoint = createBreakpoint(bulmaBreakpoint)
    return (
        <div>
            <Show when={breakpoint.smaller("sm")}>
                {/* the component will be displayed when the screen size 
                is smaller than `sm` */}
            </Show>
            {/* .... */}
        </div>
    )
}
// #endregion snippetBulma

// #region snippetCustom
import { createBreakpoint, bulmaBreakpoint } from "katon-solid-js/hooks"
import { Show } from "solid-js/web"

const customBreakpoint = {
    mobile: 0,
    tablet: 768,
    desktop: 1024,
}

const createCustomBreakpoint = () => createBreakpoint(customBreakpoint)

export default function Component() {
    const breakpoint = createCustomBreakpoint()
    return (
        <div>
            <Show when={breakpoint.smaller("desktop")}>
                {/* the component will be displayed when the screen size 
                is smaller than `desktop` */}
            </Show>
            {/* .... */}
        </div>
    )
}
// #endregion snippetCustom

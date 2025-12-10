// @ts-nocheck

// #region snippet
import { AnimatePresence } from "katon-solid-js/components"

export type ComponentProps = {
    show?: boolean
}

export default function Component(props: ComponentProps) {
    return (
        <AnimatePresence
            as="p" // default is `div`
            show={props.show}
            class="p-2 data-[show]:animate-something-in data-[closed]:animate-something-out"
        >
            {/* content here */}
        </AnimatePresence>
    )
}
// #endregion snippet

// #region snippet0
import { AnimatePresence } from "katon-solid-js/components"

export type ComponentProps = {
    show?: boolean
}

export default function Component(props: ComponentProps) {
    return (
        <AnimatePresence
            as="p" // default is `div`
            show={props.show}
            class={{
                default: "p-2",
                // animation will run when props.show is `true`
                show: "animate-something-in",
                // animation will run when props.show is `false`,
                // then the component will unmount
                closed: "animate-something-out",
            }}
        >
            {/* content here */}
        </AnimatePresence>
    )
}
// #endregion snippet0

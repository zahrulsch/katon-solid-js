import type { JSX } from "solid-js"
import { Router, Route } from "@solidjs/router"
import { fireEvent } from "@solidjs/testing-library"

function _wrapper(props: { children?: JSX.Element }) {
    return (
        <Router>
            <Route path="*" component={() => <>{props.children}</>} />
        </Router>
    )
}

function _navigate(to: string, delayMs = 0) {
    window.history.pushState({}, "", to)
    fireEvent.popState(window)
    return new Promise((resolve) => setTimeout(resolve, delayMs))
}

// make all globals
declare global {
    var wrapper: typeof _wrapper
    var navigate: typeof _navigate
}

globalThis.wrapper = _wrapper
globalThis.navigate = _navigate

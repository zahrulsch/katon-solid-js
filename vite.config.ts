/// <reference types="vitest/config" />
import { dirname, resolve as res } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import solid from "vite-plugin-solid"
import dts from "vite-plugin-dts"

const _dn = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    plugins: [
        solid(),
        dts({
            tsconfigPath: "./tsconfig.app.json",
            exclude: ["__tests__", "**/*.{spec,test}.{ts,tsx}"],
            // rollupTypes: true,
            include: ["./src/hooks/**/*.ts", "./src/components/**/*.ts", "./src/*.ts"],
        }),
    ],
    define: { "import.meta.vitest": "undefined" },
    build: {
        lib: {
            entry: {
                index: res(_dn, "src/index.ts"),
                // hooks
                "hooks/index": res(_dn, "src/hooks/index.ts"),
                "hooks/create-url-params/index": res(_dn, "src/hooks/create-url-params/index.ts"),
                "hooks/create-hover/index": res(_dn, "src/hooks/create-hover/index.ts"),
                // components
                "components/index": res(_dn, "src/components/index.ts"),
            },
            formats: ["es"],
        },
        rollupOptions: {
            external: ["solid-js", "@solidjs/router", "solid-js/store"],
        },
        minify: false,
    },
    test: {
        setupFiles: [
            "./node_modules/@testing-library/jest-dom/vitest.js",
            "./__tests__/setup.tsx",
            "./__tests__/to-contain-params.ts",
        ],
        includeSource: ["src/**/*.{ts,tsx}"],
        environment: "jsdom",
        globals: true,
        server: {
            deps: {
                inline: true,
            },
        },
    },
})

import { defineConfig } from "vitepress"
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons"

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Katon SolidJS",
    description: "Simple SolidJS Utilities",
    base: "/katon-solid-js/",
    themeConfig: {
        search: {
            provider: "local",
        },
        // https://vitepress.dev/reference/default-theme-config
        nav: [{ text: "Memulai", link: "/getting-started" }],

        sidebar: [
            {
                text: "Introduction",
                collapsed: !true,
                items: [
                    {
                        text: "Getting Started",
                        link: "/getting-started",
                    },
                    {
                        text: "Features",
                        link: "/features",
                    },
                ],
            },
            {
                text: "Hooks",
                collapsed: !true,
                items: [
                    {
                        text: "createUrlParams",
                        link: "/hooks/create-url-params",
                    },
                    {
                        text: "createHover",
                        link: "/hooks/create-hover",
                    },
                    {
                        text: "createBreakpoint",
                        link: "/hooks/create-breakpoint",
                    },
                ],
            },
            {
                text: "Component",
                collapsed: !true,
                items: [
                    {
                        text: "ListView",
                        link: "/components/list-view",
                    },
                    {
                        text: "AnimatePresence",
                        link: "/components/animate-presence",
                    },
                ],
            },
        ],

        socialLinks: [
            { icon: "github", link: "https://github.com/vuejs/vitepress" },
            { icon: "x", link: "https://github.com/vuejs/vitepress" },
        ],
    },
    markdown: {
        config(md) {
            md.use(groupIconMdPlugin, {
                titleBar: { includeSnippet: true },
            })
        },
    },
    vite: {
        plugins: [groupIconVitePlugin()],
    },
})

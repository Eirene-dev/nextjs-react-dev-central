// middleware.ts 파일
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const redirects = {
    '/blog/eslint-with-prettier': '/blog/dev-env/eslint-with-prettier',
    '/blog/selecting-ide-for-nextjs': '/blog/dev-env/selecting-ide-for-nextjs',
    '/blog/hot-code-reloading-and-fast-refresh': '/blog/dev-env/hot-code-reloading-and-fast-refresh',
    '/blog/10-web-apis': '/blog/javascript/10-web-apis',
    '/blog/arrow-and-regular-functions-in-javascript': '/blog/javascript/arrow-and-regular-functions-in-javascript',
    '/blog/garbage-collection-in-javascript': '/blog/javascript/garbage-collection-in-javascript',
    '/blog/tree-shaking': '/blog/javascript/tree-shaking',
    '/blog/code-structure-and-maintenance-strategies-for-nextjs': '/blog/nextjs/code-structure-and-maintenance-strategies-for-nextjs',
    '/blog/environment-variables-in-nextjs': '/blog/nextjs/environment-variables-in-nextjs',
    '/blog/performance-nextjs-script-optimization': '/blog/nextjs/performance-nextjs-script-optimization',
    '/blog/performance-optimization-using-nextjs': '/blog/nextjs/performance-optimization-using-nextjs',
    '/blog/project-organization': '/blog/nextjs/project-organization',
    '/blog/route-group': '/blog/nextjs/route-group',
    '/blog/understanding-isr-in-nextjs': '/blog/nextjs/understanding-isr-in-nextjs',
    '/blog/8-things-you-shold-konw-about-nextjs-13': '/blog/nextjs-overivew/8-things-you-shold-konw-about-nextjs-13',
    '/blog/comparing-nextjs-nuxt-sveltekit': '/blog/nextjs-overivew/comparing-nextjs-nuxt-sveltekit',
    '/blog/nextjs-challenges': '/blog/nextjs-overivew/nextjs-challenges',
    '/blog/nextjs-evolution': '/blog/nextjs-overivew/nextjs-evolution',
    '/blog/nextjs-success-story': '/blog/nextjs-overivew/nextjs-success-story',
    '/blog/what-is-nextjs': '/blog/nextjs-overivew/what-is-nextjs',
    '/blog/conditional-rendering': '/blog/react/conditional-rendering',
    '/blog/functional-component-with-typescript': '/blog/react/functional-component-with-typescript',
    '/blog/functional-programming': '/blog/react/functional-programming',
    '/blog/goodbye-create-react-app': '/blog/react/goodbye-create-react-app',
    '/blog/hook-in-functional-component': '/blog/react/hook-in-functional-component',
    '/blog/interaction-with-ui': '/blog/react/interaction-with-ui',
    '/blog/memo-callback-hook': '/blog/react/memo-callback-hook',
    '/blog/ref-hook': '/blog/react/ref-hook',
    '/blog/state-context-reducer': '/blog/react/state-context-reducer',
    '/blog/responsive-desing-in-nextjs': '/blog/web-design/responsive-desing-in-nextjs',
    '/blog/styling-in-nextjs': '/blog/web-design/styling-in-nextjs',
    '/blog/web-layouts': '/blog/web-design/web-layouts',
    '/blog/developer-experience-in-web': '/blog/web-dev/developer-experience-in-web',
    '/blog/frontend-web-developer-roadmap': '/blog/web-dev/frontend-web-developer-roadmap',
    '/blog/good-website-design': '/blog/web-dev/good-website-design',
    '/blog/user-experience-in-web': '/blog/web-dev/user-experience-in-web',
    '/blog/web-address-understanding': '/blog/web-dev/web-address-understanding',
    '/blog/web-rendering-understanding': '/blog/web-dev/web-rendering-understanding',
};

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (redirects[pathname]) {
        const newUrl = request.nextUrl.clone()
        newUrl.pathname = redirects[pathname]
        return NextResponse.redirect(newUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: Object.keys(redirects).map(path => path),
}

import { NextResponse } from "next/server";

export { default } from 'next-auth/middleware';
import { getToken } from "next-auth/jwt";

export async function middleware(request) {

    const token = await getToken({ req: request })
    const url = request.nexturl

    if ( token && (url.pathname.startwith('/pages/auth')) ) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    if ( !token && (url.pathname.startwith('/')) ) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.redirect(new URL('/', request.url))
}

export const config = {
    matcher: [
        '/pages/auth',
        '/pages/snippets',
        '/pages/submit',
        '/pages/favorites',
        '/pages/profile',
        '/'
    ]
}
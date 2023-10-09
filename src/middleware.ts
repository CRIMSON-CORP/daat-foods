import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { appCookieName } from './config/app-config';

export function middleware(request: NextRequest): NextResponse {
    const cookie = request.cookies.get(appCookieName);
    if (cookie?.value) {
        return NextResponse.next();
    } else {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }
}

export const config = {
    matcher: ['/api/admin/:path*'],
};

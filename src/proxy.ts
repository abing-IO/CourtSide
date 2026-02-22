import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    // Only apply authentication to the /control route
    if (req.nextUrl.pathname.startsWith('/control')) {
        const adminPasscode = process.env.ADMIN_PASSCODE;

        // If an ADMIN_PASSCODE is set in .env.local, require it
        if (adminPasscode) {
            const basicAuth = req.headers.get('authorization');

            // The browser will base64 encode "username:password"
            // We accept any username (like 'admin'), as long as the password matches ADMIN_PASSCODE
            if (basicAuth) {
                const authValue = basicAuth.split(' ')[1];
                const [user, pwd] = atob(authValue).split(':');

                if (pwd === adminPasscode) {
                    return NextResponse.next();
                }
            }

            // If missing or incorrect, trigger the browser's native password prompt
            return new NextResponse('Authentication required', {
                status: 401,
                headers: {
                    'WWW-Authenticate': 'Basic realm="Courtside Pro Control Panel"',
                },
            });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/control/:path*'],
};

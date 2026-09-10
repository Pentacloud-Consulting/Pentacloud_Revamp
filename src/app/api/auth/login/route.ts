import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const response = NextResponse.json({ success: true });

    // Check for default admin or SEO demo credentials fallback (.me)
    const cleanEmail = email?.trim().toLowerCase();
    if (
      (cleanEmail === 'arshad@adminpentacloud.me' && password === 'Arshad@khan') ||
      (cleanEmail === 'seo@teamworkpentacloud.me' && password === 'Seo@Team')
    ) {
      // Set the cookie the proxy middleware actually checks
      response.cookies.set('dashboard_mock_auth', '1', { path: '/', httpOnly: false, maxAge: 60 * 60 * 24 });
      return response;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ success: false, error: "Supabase environment variables are missing." }, { status: 401 });
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return request.headers.get('cookie')?.match(new RegExp(`(^| )${name}=([^;]+)`))?.[2];
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({ name, value: '', ...options });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "An internal error occurred." }, { status: 500 });
  }
}

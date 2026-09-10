'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

// Roles configuration
const ROLES = {
  ADMIN: {
    title: 'ADMIN SIGN IN',
    desc: 'Full operations, settings, and team management',
    email: 'Arshad@AdminPentacloud.me',
    pass: 'Arshad@khan',
    theme: 'border-blue-500 text-blue-500'
  },
  SEO: {
    title: 'SEO SIGN IN',
    desc: 'Access to SEO manager, blogs, and analytics',
    email: 'Seo@TeamWorkPentacloud.me',
    pass: 'Seo@Team',
    theme: 'border-blue-500 text-blue-500'
  }
};

type Role = 'ADMIN' | 'SEO';

export function Login() {
  const [activeRole, setActiveRole] = useState<Role>('ADMIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Auto-fill when role changes for mock mode convenience
  useEffect(() => {
    setEmail(ROLES[activeRole].email);
    setPassword(ROLES[activeRole].pass);
    setError(null);
  }, [activeRole]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Use our Next.js API route to bypass browser DNS/CORS blocks
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch (parseErr) {
        throw new Error(`Server returned status ${res.status}`);
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid login credentials.");
      }

      // Determine role based on email
      const determinedRole = email.toLowerCase().includes('seo') ? 'seo' : 'admin';
      localStorage.setItem('user_role', determinedRole);

      // Redirect to the correct dashboard
      if (determinedRole === 'seo') {
        window.location.href = '/dashboard/seo';
      } else {
        window.location.href = '/dashboard';
      }

    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
      setLoading(false);
    }
  };

  const activeTheme = ROLES[activeRole].theme.split(' ')[0]; // Gets the border color
  const textColor = ROLES[activeRole].theme.split(' ')[1]; // Gets the text color

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-inter text-gray-800">
      <div className="w-full max-w-md flex flex-col items-center">
        
        {/* Header */}
        <h1 className={`text-sm tracking-widest font-bold mb-2 uppercase ${textColor}`}>
          {ROLES[activeRole].title}
        </h1>
        <p className="text-gray-500 text-sm mb-8 text-center">
          {ROLES[activeRole].desc}
        </p>

        {/* Role Selector */}
        <div className="w-full mb-6">
          <p className={`text-xs font-bold mb-3 uppercase tracking-wider ${textColor}`}>
            Select Role
          </p>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveRole('ADMIN')}
              className={`flex-1 py-3 text-xs font-bold tracking-widest transition-all border rounded-md ${
                activeRole === 'ADMIN' 
                  ? 'border-blue-500 text-blue-600 bg-blue-50' 
                  : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'
              }`}
            >
              ADMIN
            </button>
            <button
              onClick={() => setActiveRole('SEO')}
              className={`flex-1 py-3 text-xs font-bold tracking-widest transition-all border rounded-md ${
                activeRole === 'SEO' 
                  ? 'border-blue-500 text-blue-600 bg-blue-50' 
                  : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'
              }`}
            >
              SEO
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Account: <span className="text-gray-900 font-medium">{ROLES[activeRole].email}</span>
          </p>
        </div>

        {/* Login Box */}
        <div className="w-full bg-white border border-gray-200 rounded-xl shadow-xl p-8 pt-10 relative">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Credentials</h2>
          <p className="text-sm text-gray-500 mb-8">
            Sign in with your staff email and password
          </p>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-md p-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Outlined Input - Email */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 px-1 bg-white text-xs font-medium text-gray-500 z-10">
                Email ID
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-transparent border border-gray-300 rounded-md text-gray-900 px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all relative z-0`}
              />
            </div>

            {/* Outlined Input - Password */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 px-1 bg-white text-xs font-medium text-gray-500 z-10">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-transparent border border-gray-300 rounded-md text-gray-900 px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all relative z-0`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 mt-4 text-sm font-bold tracking-widest text-white rounded-md transition-all disabled:opacity-70 uppercase shadow-md bg-blue-600 hover:bg-blue-700`}
            >
              {loading ? 'Authenticating...' : `Sign in as ${activeRole}`}
            </button>
          </form>
        </div>

        {/* Info Footer */}
        <div className="mt-8 text-center text-xs text-gray-500 space-y-1">
          <p>This login is now connected to live Supabase Authentication.</p>
          <p>Please use your real credentials to access the dashboard.</p>
        </div>
        
      </div>
    </div>
  );
}

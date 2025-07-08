'use client';

import {Eye, EyeClosed} from 'lucide-react';
import {useEffect, useState} from 'react';
import axios from '@/utils/axiosInstance';
import OAuthSignInButton from "@/components/OAuthSignInButton";
import {useUser} from "@/providers/UserContext";
import Loader from "@/components/Loader";
import {Session} from "@/types";

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
    // Use the User context to refresh user data after login
  const [loading, setLoading] = useState(false);
  const {refreshUser} = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { email, password };

    try {
      setLoading(true);
      const res = await axios.post('/api/v1/auth/login', payload);
      const data = await res.data;

      if (res.status === 200) {
        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('refreshToken', data.refresh_token);
        await refreshUser(); // Refresh user context after login
        window.location.replace('/');
      } else {
        console.error('Login failed:', data.message);
        alert(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
        try {
            const res = await fetch('/api/auth/session');
            if (!res.ok) {
              setSession(null);
              return;
            }
            const sessionData = await res.json();
            setSession(sessionData as Session);
        } catch (err) {
            console.error('Error fetching session:', err);
        }
    }
    fetchSession();
  }, [])

    useEffect(() => {
        if (session?.user) {
        // If user is already logged in, redirect to home
          console.log(session)

          // window.location.replace('/');
        }
    }, [session]);

    if (loading) {
      return <Loader subtitle={'Logging in...'} />;
    }

  return (
      <form
          onSubmit={handleSubmit}
          className="w-full max-w-md mx-auto mt-20 p-8 bg-gray-900/70 backdrop-blur-md shadow-xl rounded-2xl space-y-6 text-white border border-white/10"
      >
        <h2 className="text-3xl font-bold text-center">Login</h2>

        {/* --- OAuth Buttons --- */}
        <div className="flex gap-4 justify-center">
          <OAuthSignInButton provider="google" />
          <OAuthSignInButton provider="github" />
        </div>

        <div className="border-t border-white/10 pt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80">Email</label>
            <input
                type="email"
                className="mt-1 block w-full rounded-md bg-white/10 border border-white/20 placeholder-white/40 text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 p-2"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80">Password</label>
            <div className="relative">
              <input
                  type={showPassword ? 'text' : 'password'}
                  className="mt-1 block w-full rounded-md bg-white/10 border border-white/20 placeholder-white/40 text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 p-2 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
              <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-md font-semibold transition"
          >
            Login
          </button>

          <p className="text-center text-sm text-white/80">
            Don&apos;t have an account?{' '}
            <a href="/register" className="text-violet-400 hover:underline">
              Register here
            </a>
          </p>
        </div>
      </form>

  );
}

'use client';

import { Eye, EyeClosed } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from "@/utils/axiosInstance";

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      email,
      password,
    };

    const token = localStorage.getItem('token');
    if (token) {
        
    }


    try {
      const res = await axios.post('/api/v1/auth/login', {
        ...payload,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.data;
      console.log('Server response:', data);

      if(res.status === 200) {
        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('refreshToken', data.refresh_token);
        router.push('/');
      } else {
            console.error('Login failed:', data.message);
            alert(data.message || 'Login failed. Please try again.');
        }

    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-6 bg-gray-100 shadow-md rounded-lg space-y-4 text-black relative"
    >
      <h2 className="text-2xl font-bold text-center">Login</h2>

      <div className={'relative'}>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          className="relative mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-1 px-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className="mt-1 block p-1 px-2 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-600"
          >
            {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
      >
        <span className='font-semibold'>
            Login
        </span>
      </button>

      <p>
        Don&apos;t have an account? <a href="/register" className="text-blue-600 hover:underline">Register here</a>
      </p>
    </form>
  );
}

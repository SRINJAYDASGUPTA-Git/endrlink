'use client';

import {Eye, EyeClosed} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import axios from "@/utils/axiosInstance";
import OAuthSignInButton from "@/components/OAuthSignInButton";

export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [session, setSession] = useState<any>(null);

    const router = useRouter();


    useEffect(() => {
        const fetchSession = async () => {
            const curr_session = await fetch('/api/auth/session');
            if (curr_session.ok) {
                const sessionData = await curr_session.json();
                setSession(sessionData);
            } else {
                console.log('No session found');
            }
        };
        fetchSession();
    }, []);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log({
            email,
            name,
            password,
            confirmPassword
        })
        const payload = {
            email,
            password,
            name,
        };

        try {
            const res = await axios.post('/api/v1/auth/register', {
                ...payload,
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
            });

            const data = await res.data;

            console.log('Server response:', data);
            if (res.status === 201) {
                router.push('/activate');
            } else {
                console.error('Registration failed:', data.message);
            }
        } catch (err) {
            console.error('Error during registration:', err);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-md mx-auto mt-20 p-8 bg-gray-900/70 backdrop-blur-md shadow-xl rounded-2xl space-y-6 text-white border border-white/10"
        >
            <h2 className="text-3xl font-bold text-center">Register</h2>

            {/* OAuth buttons */}
            <div className="flex gap-4 justify-center flex-col md:flex-row">
                <OAuthSignInButton session={session} provider="google" />
                <OAuthSignInButton session={session} provider="github" />
            </div>

            <div>
                <label className="block text-sm font-medium text-white/80">Name</label>
                <input
                    type="text"
                    className="p-2 mt-1 block w-full rounded-md bg-white/10 border border-white/20 placeholder-white/40 text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-white/80">Email</label>
                <input
                    type="email"
                    className="p-2 mt-1 block w-full rounded-md bg-white/10 border border-white/20 placeholder-white/40 text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
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
                        className="p-2 mt-1 block w-full rounded-md bg-white/10 border border-white/20 placeholder-white/40 text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-sm text-white/50 hover:text-white"
                    >
                        {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-white/80">Confirm Password</label>
                <div className="relative">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="p-2 mt-1 block w-full rounded-md bg-white/10 border border-white/20 placeholder-white/40 text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 pr-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-sm text-white/50 hover:text-white"
                    >
                        {showConfirmPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-md font-semibold transition"
            >
                Register
            </button>

            <p className="text-center text-sm text-white/80">
                Already have an account?{' '}
                <a href="/login" className="text-violet-400 hover:underline">
                    Login here
                </a>
            </p>
        </form>
    );
}
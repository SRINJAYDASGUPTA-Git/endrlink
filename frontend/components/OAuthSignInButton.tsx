// components/OAuthSignInButton.tsx
'use client';

import { useEffect } from 'react';
import axios from '@/utils/axiosInstance';
import { toast } from 'sonner';
import { signIn } from "next-auth/react"
import { Button } from './ui/button';
import Image from "next/image";
const OAuthSignInButton = ({ session, provider }: { session: any, provider:string }) => {
    useEffect(() => {
        const authenticate = async () => {
            if (!session?.user) return;
            console.log('Session user:', session.user);
            try {
                const response = await axios.post('/api/v1/auth/oauth2/login', {
                    ...session.user,
                });

                console.log('Server response:', response.data);
                // if (response.status === 201) {
                //     window.location.href = '/activate';
                // } else if (response.status === 200) {
                //     window.location.href = '/';
                // }
            } catch (err) {
                console.error('Error during authentication:', err);
                toast.error('Authentication failed. Please try again.');
            }
        };

        authenticate();
    }, [session]);

    return (
        <Button
            type="button"
            onClick={() => signIn(provider)}
            className="p-0 bg-transparent rounded-full overflow-hidden w-[200px] h-[50px] cursor-pointer hover:shadow-purple-500 shadow-md transition-all duration-300"
        >
            {
                provider === 'google' ? (
                    <Image
                        src="/google_button_dark.svg"
                        alt="Google Sign-In"
                        width={200}
                        height={50}
                        className="w-full h-full object-contain "
                    />
                ):(
                    <Image
                        src="/github_dark_button.svg"
                        alt="GitHub Sign-In"
                        width={200}
                        height={50}
                        className="w-full h-full object-contain "
                    />
                )
            }

        </Button>

    );
};

export default OAuthSignInButton;

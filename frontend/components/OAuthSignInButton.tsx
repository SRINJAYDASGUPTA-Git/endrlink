'use client';

import {signIn} from "next-auth/react"
import {Button} from './ui/button';
import Image from "next/image";

const OAuthSignInButton = ({ provider }: { provider:string }) => {
    // const router = useRouter();
    // useEffect(() => {
    //     const authenticate = async () => {
    //         if (!session?.user) return;
    //         // console.log('Session user:', session.user);
    //         try {
    //             const response = await axios.post('/api/v1/auth/oauth2/login', {
    //                 ...session.user,
    //             });
    //
    //             // console.log('Server response:', response.data);
    //             if (response.status === 201) {
    //                 router.push('/activate');
    //             } else if (response.status === 200) {
    //                 toast.success('Authentication successful!');
    //                 localStorage.setItem('accessToken', response.data.access_token);
    //                 localStorage.setItem('refreshToken', response.data.refresh_token);
    //                 router.push('/');
    //             }
    //         } catch (err) {
    //             console.error('Error during authentication:', err);
    //             toast.error('Authentication failed. Please try again.');
    //         }
    //     };
    //
    //     authenticate();
    // }, [router, session]);

    return (
        <Button
            type="button"
            onClick={() => signIn(provider, {redirectTo: '/oauth-callback'})}
            className="p-0 bg-transparent rounded-full overflow-hidden w-[200px] h-[50px] cursor-pointer transition-all duration-300"
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

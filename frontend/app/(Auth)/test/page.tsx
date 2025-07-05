import { auth } from "@/utils/auth";
import OAuthSignInButton from "@/components/OAuthSignInButton";

const TestAuthPage = async () => {
    const session = await auth();
    return(
        <div className="flex flex-col items-center justify-center h-screen">
            <OAuthSignInButton session={session} provider={'google'} />
            <OAuthSignInButton session={session} provider={'github'} />
        </div>

    );
};

export default TestAuthPage;
import { auth } from "@/utils/auth";
import OAuthSignInButton from "@/components/OAuthSignInButton";

const TestAuthPage = async () => {
    const session = await auth();
    return <OAuthSignInButton session={session} provider={'google'} />;
};

export default TestAuthPage;
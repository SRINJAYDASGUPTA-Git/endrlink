import { signOut } from "@/utils/auth";
export async function GET() {
  try {
    await signOut();
    return new Response(JSON.stringify({ message: "Successfully signed out" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to sign out" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
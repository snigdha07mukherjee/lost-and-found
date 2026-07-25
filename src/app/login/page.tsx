import { signIn } from "@/lib/auth";

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/" });
        }}
      >
        <button className="rounded-lg bg-black px-6 py-3 text-white">
          Sign in with Google
        </button>
      </form>
    </div>
  );
}
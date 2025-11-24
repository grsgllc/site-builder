import { redirect } from "next/navigation";
import { signIn, auth, providerMap } from "@/lib/auth";
import { AuthError } from "next-auth";
import config from "@/config";
import Image from "next/image";

const SIGNIN_ERROR_URL = "/signin/error";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{
    redirectUrl: string | undefined;
  }>;
}) {
  const [session, params] = await Promise.all([auth(), searchParams]);
  const callbackUrl = params.redirectUrl;
  if (session?.user) {
    if (callbackUrl) {
      return redirect(callbackUrl);
    }
    return redirect(`/${config.defaultPage}`);
  }

  const providers = Object.values(providerMap);

  return (
    <div className="flex items-center justify-center">
      <div className="p-8 rounded-2xl shadow-sm w-full max-w-md bg-base-200">
        <div className="space-y-4">
          {providers.map((provider, index) => (
            <>
              <form
                key={index}
                className="w-full"
                action={async (formData) => {
                  "use server";
                  console.log("Form data:", formData);
                  const options = {
                    redirectTo: callbackUrl,
                    email: formData?.get("email"),
                  };
                  try {
                    await signIn(provider.id, options);
                  } catch (error) {
                    if (error instanceof AuthError) {
                      return redirect(
                        `${SIGNIN_ERROR_URL}?error=${error.cause}`
                      );
                    }
                    throw error;
                  }
                }}
              >
                {provider.name === "Forward Email" && (
                  <div className="mb-4">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="w-full px-4 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                )}
                <button
                  type="submit"
                  className={`w-full py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                    provider.name === "Google"
                      ? "border border-neutral hover:bg-gray-50 hover:text-black"
                      : "bg-primary text-primary-content hover:bg-primary-content hover:text-primary"
                  }`}
                >
                  {provider.name === "Google" && (
                    <Image
                      src="/google-icon.png"
                      alt="Google"
                      width={20}
                      height={20}
                    />
                  )}
                  <span>
                    Sign in with{" "}
                    {provider.name === "Forward Email"
                      ? "Email"
                      : provider.name}
                  </span>
                </button>
              </form>

              {index < providers.length - 1 && (
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

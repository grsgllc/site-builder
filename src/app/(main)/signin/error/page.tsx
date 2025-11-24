import SignInError from "@/components/SignInError";
import { redirect } from "next/navigation";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const error = (await searchParams).error;
  if (error === "Verification") return redirect("/charts");

  return <SignInError />;
}

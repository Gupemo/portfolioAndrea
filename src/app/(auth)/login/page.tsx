import LoginForm from "@/components/Auth/LoginForm";
import { getSession } from "@/lib/require-session";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  if (await getSession()) redirect("/dashboard");

  return <LoginForm />;
}

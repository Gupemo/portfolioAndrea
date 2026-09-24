import DashboardLayout from "@/components/Dashboard/DashboardLayout/DashboardLayout"
import { getSession } from "@/lib/require-session";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await getSession())) redirect("/login");
  return <DashboardLayout>{children}</DashboardLayout>;
}

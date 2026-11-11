import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";
import AdminClientLayout from "./components/AdminClientLayout";

export const metadata = {
  title: "Admin Portal | Amanu Properties",
  description: "Administrator management portal for Amanu Properties",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Execute server-side authorization check safely in Server Component
  const session = await requireAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return <AdminClientLayout user={session.user}>{children}</AdminClientLayout>;
}

// /src/app/admin/layout.tsx  （新規）
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const ok = session?.user?.email?.endsWith("nagaokaut.ac.jp");
  if (!ok) {
    redirect(`/api/auth/signin?callbackUrl=/admin`);
  }
  return <>{children}</>;
}

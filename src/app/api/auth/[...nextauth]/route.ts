// /src/app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";
export const dynamic = "force-dynamic"; // Vercelでのキャッシュ無効化の保険;

export const { GET, POST } = handlers;

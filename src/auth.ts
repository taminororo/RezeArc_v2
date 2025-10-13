// /src/auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// 「@nagaokaut.ac.jp」だけ通すフィルタ
function isAllowedEmail(email?: string | null) {
  if (!email) return false;
  return email.endsWith("nagaokaut.ac.jp"); // 例: foo@st.nagaokaut.ac.jp もOKにしたいなら .endsWith(".nagaokaut.ac.jp") || === "nagaokaut.ac.jp"
}

export const {
  handlers,   // { GET, POST }
  auth,       // サーバーでsession取得
  signIn,     // Client用
  signOut,    // Client用
} = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // 任意: Googleの"hd"ヒント（強制力は弱いがUX向上）
      authorization: { params: { hd: "nagaokaut.ac.jp", prompt: "select_account" } },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      // サインイン直後にドメインを厳格チェック
      return isAllowedEmail(profile?.email);
    },
    async session({ session }) {
      // （必要ならここで session.user.role などを付与）
      return session;
    },
  },
});

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Monitoramento de Crianças",
  description: "Painel de monitoramento para técnicos em campo",
};

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "chave-secreta-padrao-para-mvp-apenas"
    );
    const { payload } = await jwtVerify(token, secret);
    return payload.preferred_username as string;
  } catch (e) {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const username = await getUser();

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-slate-50 dark:bg-slate-900 min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {username && (
            <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold" aria-hidden="true">
                    M
                  </div>
                  <h1 className="text-lg font-bold text-slate-900 dark:text-white hidden sm:block">
                    Monitoramento
                  </h1>
                </div>
                <div className="flex items-center gap-4">
                  <ThemeToggle />
                  <span aria-label={`Técnico logado: ${username}`} className="text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-full flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" aria-hidden="true"></span>
                    {username}
                  </span>
                </div>
              </div>
            </header>
          )}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

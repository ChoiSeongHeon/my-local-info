import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "성남시 생활 정보",
  description: "우리 동네 행사, 축제 및 유용한 혜택 정보를 한눈에 확인하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${notoSansKR.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[var(--font-noto-sans-kr)]">
        <nav className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-5 h-16 flex items-center justify-between">
            <Link href="/" className="text-lg font-black text-gray-900 hover:text-sky-600 transition-colors">
              우리 동네 소식통 📢
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm font-bold text-gray-600 hover:text-sky-600 transition-colors">홈</Link>
              <Link href="/blog" className="text-sm font-bold text-gray-600 hover:text-sky-600 transition-colors">블로그</Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}

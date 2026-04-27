import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "오키나와 여행 · 2026.05.21–05.24",
  description: "4일 3박 오키나와 여행 일정 및 비용 플래너",
  icons: {
    icon: "/portfolio.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <head>
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

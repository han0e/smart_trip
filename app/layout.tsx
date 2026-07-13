import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "코나미디어 감사골프 행사 가이드",
  description: "코나미디어 감사골프 행사 플래너",
  icons: {
    icon: "/golfico.png?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

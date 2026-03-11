import "./globals.css";

export const metadata = {
  title: "Self Mirror",
  description: "你選的每一個選項，都在說一件你自己可能沒注意到的事。",
  openGraph: {
    title: "Self Mirror",
    description: "你選的每一個選項，都在說一件你自己可能沒注意到的事。",
    url: "https://self-mirror-quiz.vercel.app",
    siteName: "Self Mirror",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
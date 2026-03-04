export const metadata = {
  title: "Self Mirror — 你以為的自己和真實的你",
  description: "8 道情境題，幫你看見你說的和你做的之間，那個有趣的距離。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
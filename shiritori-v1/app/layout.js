// app/layout.js
import { Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";

const zenMaru = Zen_Maru_Gothic({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "しりとり for two",
  description: "Two-player shiritori word chain",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={zenMaru.className}>{children}</body>
    </html>
  );
}

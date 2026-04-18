import './globals.css';
import type { Metadata } from 'next';
import { IBM_Plex_Mono, Silkscreen } from 'next/font/google';

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

const pixel = Silkscreen({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pixel',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PromptPilot - AI 提示词管理平台',
  description: '一个结构化的工作空间，用于管理和优化编码与学习场景的提示词。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={`${mono.variable} ${pixel.variable}`}>
        {children}
      </body>
    </html>
  );
}

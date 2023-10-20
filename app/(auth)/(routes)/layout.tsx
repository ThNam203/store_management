export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

import { Open_Sans } from 'next/font/google'
const font = Open_Sans({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  )
}
import type { Metadata } from 'next'
import './globals.css'
import { QueryProvider } from '@/shared/providers/QueryProvider'

export const metadata: Metadata = {
  title: {
    default: 'DevFeed',
    template: '%s | DevFeed',
  },
  description: '개발자를 위한 개인화 콘텐츠 큐레이션 플랫폼',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}

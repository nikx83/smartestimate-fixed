/**
 * Файл: /app/layout.tsx
 * Назначение: Корневой layout для Next.js 15 - обязательный файл для всех страниц приложения
 */

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SmartEstimate - Система расчёта смет',
  description: 'Автоматизированная система расчёта смет по инженерным изысканиям РК',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        {children}
      </body>
    </html>
  )
}

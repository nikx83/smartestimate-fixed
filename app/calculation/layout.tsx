/**
 * Путь: /app/calculation/layout.tsx
 * Назначение: Общий layout для всех страниц модуля расчётов
 * Описание: Header с навигацией, breadcrumbs, обёртка для контента
 */

import { ReactNode } from 'react';
import Link from 'next/link';

export default function CalculationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                SmartEstimate
              </Link>
              <span className="ml-4 text-sm text-gray-500">
                СЦИ РК 8.03-04-2025
              </span>
            </div>
            
            {/* Navigation */}
            <nav className="flex space-x-4">
              <Link
                href="/calculation"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Все модули
              </Link>
              <Link
                href="/projects"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Проекты
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            SmartEstimate © 2025 • Расчёты по СЦИ РК 8.03-04-2025
          </p>
        </div>
      </footer>
    </div>
  );
}

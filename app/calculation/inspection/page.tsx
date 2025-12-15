/**
 * Путь: /app/calculation/inspection/page.tsx
 * Назначение: Страница выбора типа здания (промышленное/жилое)
 * Описание: Навигационная страница с карточками для выбора типа обследуемого объекта
 */

'use client';

import Link from 'next/link';
import { ArrowLeft, Building2, Home } from 'lucide-react';

export default function InspectionPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/calculation"
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Все модули
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Обследования зданий и сооружений
        </h1>
        <p className="mt-2 text-gray-600">
          Раздел 4 СЦИ РК 8.03-04-2025
        </p>
      </div>

      {/* Выбор типа здания */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/calculation/inspection/industrial"
          className="group p-8 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all"
        >
          <Building2 className="w-12 h-12 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Промышленные здания
          </h3>
          <p className="text-gray-600">
            Обследование производственных, складских и других промышленных объектов
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Таблицы: 1604-0301 до 1604-0306
          </div>
        </Link>

        <div className="p-8 bg-white border-2 border-gray-200 rounded-lg opacity-50 cursor-not-allowed">
          <Home className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Жилые и общественные здания
          </h3>
          <p className="text-gray-600">
            Обследование жилых домов, административных и общественных зданий
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Таблицы: 1604-0401 до 1604-0406
          </div>
          <div className="mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              В разработке
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

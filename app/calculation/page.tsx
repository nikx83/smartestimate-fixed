/**
 * Путь: /app/calculation/page.tsx
 * Назначение: Главная страница выбора модуля расчётов
 * Описание: 4 карточки модулей (обследования, геодезия, геология, гидрография)
 */

import Link from 'next/link';
import { 
  Building2, 
  Map, 
  Mountain, 
  Waves 
} from 'lucide-react';

const modules = [
  {
    id: 'inspection',
    name: 'Обследования зданий',
    description: 'Раздел 4. Обмерные работы и обследования зданий и сооружений',
    icon: Building2,
    href: '/calculation/inspection',
    color: 'bg-blue-500',
    available: true,
  },
  {
    id: 'geodetic',
    name: 'Геодезия',
    description: 'Раздел 1. Инженерно-геодезические изыскания',
    icon: Map,
    href: '/calculation/geodetic',
    color: 'bg-green-500',
    available: false,
  },
  {
    id: 'geological',
    name: 'Геология',
    description: 'Раздел 2. Инженерно-геологические изыскания',
    icon: Mountain,
    href: '/calculation/geological',
    color: 'bg-orange-500',
    available: false,
  },
  {
    id: 'hydrographic',
    name: 'Гидрография',
    description: 'Раздел 3. Инженерно-гидрографические работы',
    icon: Waves,
    href: '/calculation/hydrographic',
    color: 'bg-cyan-500',
    available: false,
  },
];

export default function CalculationPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Расчёт смет по изысканиям
        </h1>
        <p className="mt-2 text-gray-600">
          Выберите модуль для расчёта стоимости работ
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module) => {
          const Icon = module.icon;
          
          return (
            <Link
              key={module.id}
              href={module.available ? module.href : '#'}
              className={`
                relative block p-6 bg-white border border-gray-200 rounded-lg
                ${module.available 
                  ? 'hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed'
                }
              `}
            >
              {!module.available && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Скоро
                  </span>
                </div>
              )}
              
              <div className="flex items-start">
                <div className={`${module.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {module.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {module.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Информационный блок */}
      <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          О системе расчётов
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Расчёты выполняются по СЦИ РК 8.03-04-2025</li>
          <li>• Автоматическое применение всех коэффициентов</li>
          <li>• Экспорт в PDF, DOCX, XLSX</li>
          <li>• Сохранение проектов и история расчётов</li>
        </ul>
      </div>
    </div>
  );
}

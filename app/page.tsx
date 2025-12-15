/**
 * Файл: /app/page.tsx
 * Назначение: Главная страница приложения с навигацией по всем модулям
 */

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Заголовок */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            SmartEstimate
          </h1>
          <p className="text-xl text-gray-600">
            Автоматизированная система расчёта смет и генерации технических заданий
          </p>
          <p className="text-sm text-gray-500 mt-2">
            По нормативам Республики Казахстан
          </p>
        </div>

        {/* Модули */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* БЛОК 1: ТЕХНИЧЕСКИЕ ЗАДАНИЯ */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-green-200">
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-3">📋</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Технические задания
                </h2>
                <p className="text-sm text-green-600 font-medium">
                  Автоматическая генерация ТЗ
                </p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Генерация технических заданий на основе нормативов РК с применением Rules Engine
            </p>
            
            <div className="space-y-3">
              <Link 
                href="/geological"
                className="block w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-center transition-colors"
              >
                🪨 Геологические изыскания
              </Link>
              
              <div className="block w-full px-6 py-4 bg-gray-300 text-gray-500 rounded-lg font-medium text-center cursor-not-allowed">
                📐 Геодезические изыскания (скоро)
              </div>
              
              <div className="block w-full px-6 py-4 bg-gray-300 text-gray-500 rounded-lg font-medium text-center cursor-not-allowed">
                🌊 Гидрографические работы (скоро)
              </div>
            </div>
          </div>

          {/* БЛОК 2: РАСЧЁТ СМЕТ */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-blue-200">
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-3">💰</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Расчёт смет
                </h2>
                <p className="text-sm text-blue-600 font-medium">
                  По СЦИ РК 8.03-04-2025
                </p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Точный расчёт стоимости работ с применением коэффициентов и учётом всех нормативов
            </p>
            
            <div className="space-y-3">
              <Link 
                href="/calculation/inspection"
                className="block w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-center transition-colors"
              >
                🏢 Обследования зданий
              </Link>
              
              <Link 
                href="/calculation/geodetic"
                className="block w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-center transition-colors"
              >
                📐 Геодезия
              </Link>
              
              <Link 
                href="/calculation/geological"
                className="block w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-center transition-colors"
              >
                🪨 Геология
              </Link>
              
              <Link 
                href="/calculation/hydrographic"
                className="block w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-center transition-colors"
              >
                🌊 Гидрография
              </Link>
            </div>
          </div>

        </div>

        {/* Статистика */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 bg-white rounded-lg shadow-md px-8 py-4">
            <div>
              <div className="text-3xl font-bold text-blue-600">4</div>
              <div className="text-sm text-gray-600">Модуля расчёта</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div>
              <div className="text-3xl font-bold text-green-600">1</div>
              <div className="text-sm text-gray-600">Модуль ТЗ готов</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div>
              <div className="text-3xl font-bold text-purple-600">73</div>
              <div className="text-sm text-gray-600">Блока инструкции</div>
            </div>
          </div>
        </div>

        {/* Информация */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Версия: 1.0.0 • Нормативы: СЦИ РК 8.03-04-2025 • Республика Казахстан</p>
        </div>
      </div>
    </div>
  )
}

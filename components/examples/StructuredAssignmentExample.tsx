/**
 * Демонстрационный компонент структурированного ТЗ
 * Адаптирован для веб-системы SmartEstimate
 */

import React from 'react';
import TechnicalAssignmentDisplay from '@/components/technical-assignment/TechnicalAssignmentDisplay';

// ============================================================================
// ПРИМЕР ИСПОЛЬЗОВАНИЯ
// ============================================================================

export function StructuredAssignmentExample() {
  // Пример данных технического задания
  const exampleAssignment = {
    allWorks: [
      {
        workId: 'drilling-1',
        name: 'Бурение разведочных скважин',
        quantity: 25,
        unit: 'шт',
        category: 'mandatory' as const,
        normativeBase: 'СП РК 1.02-105-2014, Таблица 1',
        description: 'Колонковое бурение с отбором монолитов',
        module: 'geological',
        tags: ['Раздел 5', 'бурение']
      },
      {
        workId: 'drilling-2',
        name: 'Бурение гидрогеологических скважин',
        quantity: 3,
        unit: 'шт',
        category: 'mandatory' as const,
        normativeBase: 'СП РК 1.02-105-2014, п. 10.5',
        description: 'Для наблюдения за режимом подземных вод',
        module: 'hydrogeology',
        tags: ['Раздел 10']
      },
      {
        workId: 'lab-1',
        name: 'Лабораторные испытания грунтов',
        quantity: 150,
        unit: 'проб',
        category: 'mandatory' as const,
        normativeBase: 'СП РК 1.02-105-2014, п. 9.2',
        description: 'Определение физико-механических свойств',
        module: 'laboratory',
        tags: ['Раздел 9']
      },
      {
        workId: 'field-1',
        name: 'Статическое зондирование',
        quantity: 25,
        unit: 'точек',
        category: 'recommended' as const,
        normativeBase: 'СП РК 1.02-105-2014, п. 11.3',
        description: 'Определение сопротивления грунтов',
        module: 'field',
        tags: ['Раздел 11']
      },
      {
        workId: 'geo-1',
        name: 'Электроразведка',
        quantity: 5,
        unit: 'профилей',
        category: 'optional' as const,
        normativeBase: 'СП РК 1.02-105-2014, п. 14.2',
        description: 'Выявление локальных неоднородностей',
        module: 'geophysics',
        tags: ['Раздел 14']
      }
    ],
    metadata: {
      totalWorks: 5,
      highestPriority: 'ВЫСШИЙ',
      generatedAt: new Date(),
      projectName: 'Жилой комплекс "Астана Парк"'
    }
  };

  return (
    <div className="structured-assignment-example p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Пример структурированного технического задания
      </h1>
      
      {/* Сравнение: Было vs Стало */}
      <div className="comparison grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Старый формат - простой список */}
        <div className="old-format">
          <h3 className="text-xl font-semibold mb-3 text-red-600">
            ❌ Было: Простой список работ
          </h3>
          <div className="bg-red-50 p-4 rounded border border-red-200">
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Бурение скважин - 25 шт</li>
              <li>Статическое зондирование - 25 точек</li>
              <li>Лабораторные испытания - 150 проб</li>
              <li>Откачки из скважин - 3 шт</li>
              <li>Отбор проб воды - 3 пробы</li>
            </ul>
            <p className="mt-3 text-sm text-gray-600">
              ⚠️ Нет обоснований, нет структуры, непонятны требования
            </p>
          </div>
        </div>
        
        {/* Новый формат - структурированное ТЗ */}
        <div className="new-format">
          <h3 className="text-xl font-semibold mb-3 text-green-600">
            ✅ Стало: Структурированное ТЗ
          </h3>
          <div className="bg-green-50 p-4 rounded border border-green-200">
            <div className="space-y-2 text-sm">
              <div className="font-semibold">Раздел 5: Буровые работы</div>
              <div className="pl-4">
                <div>📋 Блок 5.1: Расстояния между скважинами</div>
                <div className="pl-4 text-gray-700 text-xs">
                  • Норматив: СП РК 1.02-105-2014, Таблица 1<br/>
                  • Условие: Геотехн. кат. II, Ответств. I<br/>
                  • Расчет: 25 скважин (сетка 40×40 м)<br/>
                  • Формула: N = S / (L × L)
                </div>
              </div>
              <div className="pl-4 mt-2">
                <div>📋 Блок 5.2: Глубина бурения</div>
                <div className="pl-4 text-gray-700 text-xs">
                  • Норматив: СП РК 1.02-105-2014, п. 4.8<br/>
                  • Формула: H = L_сваи + 5 м = 25 м
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Полное структурированное ТЗ */}
      <div className="full-assignment mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Полное техническое задание с детализацией
        </h2>
        
        <TechnicalAssignmentDisplay
          assignment={exampleAssignment}
          onExport={(format) => console.log(`Экспорт в ${format}`)}
          showDetails={true}
        />
      </div>
      
      {/* Ключевые преимущества */}
      <div className="advantages mt-8 bg-blue-50 p-6 rounded border border-blue-200">
        <h3 className="text-xl font-semibold mb-4">
          🎯 Преимущества структурированного подхода:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Для заказчика:</h4>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center">✅ Понятно, что и зачем выполняется</li>
              <li className="flex items-center">✅ Видны нормативные обоснования</li>
              <li className="flex items-center">✅ Прозрачные расчеты объемов</li>
              <li className="flex items-center">✅ Можно проверить соответствие нормам</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Для исполнителя:</h4>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center">✅ Четкая программа работ</li>
              <li className="flex items-center">✅ Технические требования к каждой работе</li>
              <li className="flex items-center">✅ Последовательность выполнения</li>
              <li className="flex items-center">✅ Защита от необоснованных претензий</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ДЕМО-КОМПОНЕНТ ДЛЯ СРАВНЕНИЯ
// ============================================================================

export function ComparisonDemo() {
  return (
    <div className="comparison-demo p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">
        Решение проблемы отображения технического задания
      </h1>
      <p className="text-gray-600 mb-8">
        Переход от простого списка работ к структурированной спецификации с обоснованиями
      </p>
      
      {/* Проблема */}
      <div className="problem mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-red-600">
          ❌ Проблема: Плоский список без контекста
        </h2>
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <div className="font-mono text-sm mb-4 bg-white p-4 rounded">
            {`[
  { name: "Бурение скважин", quantity: 25, unit: "шт" },
  { name: "Лабораторные испытания", quantity: 150, unit: "проб" },
  { name: "Статическое зондирование", quantity: 25, unit: "точек" }
]`}
          </div>
          <div className="text-red-700">
            <p className="font-semibold mb-2">Недостатки:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Нет структуры и группировки</li>
              <li>Отсутствуют нормативные ссылки</li>
              <li>Непонятно происхождение объемов</li>
              <li>Нет технических требований</li>
              <li>Невозможно проверить правильность</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Решение */}
      <div className="solution">
        <h2 className="text-2xl font-semibold mb-4 text-green-600">
          ✅ Решение: Иерархическая структура с полной детализацией
        </h2>
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
          <div className="space-y-4">
            {/* Уровень 1: Раздел */}
            <div className="level-1">
              <div className="flex items-center gap-2 font-semibold p-3 bg-green-100 rounded">
                <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">Раздел</span>
                <span>5. Буровые работы</span>
                <span className="text-sm text-gray-600">(СП РК 1.02-105-2014)</span>
              </div>
              
              {/* Уровень 2: Блок */}
              <div className="level-2 ml-4 mt-3">
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">Блок</span>
                  <span>5.1 Расстояния между выработками</span>
                </div>
                <div className="ml-4 mt-2 text-sm text-gray-700 bg-white p-3 rounded">
                  <p className="font-medium">Условие: Геотехн. категория II + Ответственность I</p>
                  <p className="mt-1">Рекомендация: Расстояние 30-50 м, минимум 4 скважины</p>
                  
                  {/* Уровень 3: Работа */}
                  <div className="level-3 mt-3 p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-orange-600 text-white px-2 py-1 rounded text-sm">Работа</span>
                      <span className="font-medium">Бурение разведочных скважин</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Объем:</strong> 25 скважин</p>
                        <p><strong>Расчет:</strong> N = (220×100) / (40×40) = 25</p>
                        <p><strong>Глубина:</strong> 25 м (L_сваи + 5м)</p>
                      </div>
                      <div>
                        <p><strong>Норматив:</strong> СП РК 1.02-105-2014, Табл. 1</p>
                        <p><strong>Приоритет:</strong> ОБЯЗАТЕЛЬНЫЙ</p>
                        <p><strong>Методика:</strong> Колонковое бурение</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-green-700">
            <p className="font-semibold mb-2">Преимущества:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Четкая иерархическая структура</li>
              <li>Полное нормативное обоснование каждой работы</li>
              <li>Прозрачные формулы и расчеты объемов</li>
              <li>Технические требования и методики</li>
              <li>Возможность проверки и аудита</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StructuredAssignmentExample;

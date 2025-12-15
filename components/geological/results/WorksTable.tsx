/**
 * Файл: /components/geological/results/WorksTable.tsx
 * Назначение: Таблица работ с фильтрами и выбором для экспорта в смету
 */
/**
 * Улучшенная таблица работ с интеграцией структурированного отображения
 * Полная версия с переключением режимов
 */

'use client';

import { useGeologicalStore } from '@/store/geologicalStore';
import { useState } from 'react';
import TechnicalAssignmentDisplay from '@/components/technical-assignment/TechnicalAssignmentDisplay';

export function WorksTable() {
  const { 
    technicalAssignment, 
    selectedWorks, 
    toggleWorkSelection, 
    selectAllWorks, 
    deselectAllWorks 
  } = useGeologicalStore();
  
  const [viewMode, setViewMode] = useState<'table' | 'structured'>('table');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterModule, setFilterModule] = useState<string>('all');
  
  if (!technicalAssignment) {
    return (
      <div className="bg-white border rounded-lg p-8 text-center">
        <div className="text-gray-500 mb-4">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-lg font-medium">Техническое задание не сгенерировано</p>
        </div>
        <p className="text-gray-600 text-sm">
          Заполните все шаги мастера для генерации технического задания
        </p>
      </div>
    );
  }
  
  // Фильтрация работ
  let works = technicalAssignment.allWorks || [];
  if (filterCategory !== 'all') {
    works = works.filter(w => w.category === filterCategory);
  }
  if (filterModule !== 'all') {
    works = works.filter(w => w.module === filterModule);
  }
  
  const allSelected = works.length > 0 && works.every(w => 
    selectedWorks.some(sw => sw.workId === w.workId)
  );

  return (
    <div className="space-y-6">
      {/* Панель управления */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Переключатель режимов просмотра */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded w-fit">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                viewMode === 'table' 
                  ? 'bg-white shadow text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📊 Табличный вид
            </button>
            <button
              onClick={() => setViewMode('structured')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                viewMode === 'structured' 
                  ? 'bg-white shadow text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🏗️ Структурированный вид
            </button>
          </div>
          
          {/* Фильтры (только для табличного вида) */}
          {viewMode === 'table' && (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600 whitespace-nowrap">Категория:</label>
                <select 
                  value={filterCategory} 
                  onChange={e => setFilterCategory(e.target.value)} 
                  className="px-3 py-1 border rounded text-sm"
                >
                  <option value="all">Все категории</option>
                  <option value="mandatory">Обязательные</option>
                  <option value="recommended">Рекомендуемые</option>
                  <option value="optional">Опциональные</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600 whitespace-nowrap">Модуль:</label>
                <select 
                  value={filterModule} 
                  onChange={e => setFilterModule(e.target.value)} 
                  className="px-3 py-1 border rounded text-sm"
                >
                  <option value="all">Все модули</option>
                  <option value="geological">Геология</option>
                  <option value="geodetic">Геодезия</option>
                  <option value="laboratory">Лаборатория</option>
                </select>
              </div>
            </div>
          )}
          
          {/* Управление выбором (только для табличного вида) */}
          {viewMode === 'table' && (
            <div className="flex items-center space-x-3 text-sm">
              <span className="text-gray-600">
                Выбрано: <strong>{selectedWorks.length}</strong> из <strong>{technicalAssignment.allWorks?.length || 0}</strong> работ
              </span>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={selectAllWorks} 
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Выбрать все
                </button>
                <span className="text-gray-400">|</span>
                <button 
                  onClick={deselectAllWorks} 
                  className="text-gray-600 hover:text-gray-700"
                >
                  Снять все
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Отображение контента */}
      {viewMode === 'structured' ? (
        /* Структурированный вид */
        <TechnicalAssignmentDisplay 
          assignment={technicalAssignment}
          onExport={(format) => {
            console.log('Экспорт в', format);
            // Здесь будет логика экспорта
          }}
          showDetails={true}
        />
      ) : (
        /* Табличный вид */
        <div className="bg-white border rounded-lg overflow-hidden">
          {/* Таблица */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left w-12">
                    <input 
                      type="checkbox" 
                      checked={allSelected} 
                      onChange={e => e.target.checked ? selectAllWorks() : deselectAllWorks()} 
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Наименование работ</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Количество</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Ед. изм</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Категория</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Норматив</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {works.length > 0 ? (
                  works.map(work => {
                    const isSelected = selectedWorks.some(sw => sw.workId === work.workId);
                    return (
                      <tr 
                        key={work.workId} 
                        className={`hover:bg-gray-50 transition-colors ${
                          isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input 
                            type="checkbox" 
                            checked={isSelected} 
                            onChange={() => toggleWorkSelection(work.workId)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-gray-900">{work.name}</div>
                            {work.description && (
                              <div className="text-xs text-gray-500 mt-1">{work.description}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">{work.quantity}</td>
                        <td className="px-4 py-3 text-gray-600">{work.unit}</td>
                        <td className="px-4 py-3">
                          <CategoryBadge category={work.category} />
                        </td>
                        <td className="px-4 py-3">
                          {work.normativeBase ? (
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              {work.normativeBase}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="text-4xl mb-2">🔍</div>
                        <p>Нет работ для отображения</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Попробуйте изменить параметры фильтрации
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Статусная строка */}
          <div className="p-4 bg-gray-50 border-t text-sm text-gray-600 flex justify-between items-center">
            <span>
              Показано: <strong>{works.length}</strong> из <strong>{technicalAssignment.allWorks?.length || 0}</strong> работ
            </span>
            <span>
              Выбрано: <strong>{selectedWorks.length}</strong> работ
            </span>
          </div>
        </div>
      )}
      
      {/* Панель действий после выбора */}
      {selectedWorks.length > 0 && viewMode === 'table' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-blue-900">
                Готово к расчету сметы
              </h3>
              <p className="text-blue-700 text-sm">
                Выбрано {selectedWorks.length} работ для включения в смету
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => console.log('Расчет сметы для выбранных работ')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                📊 Рассчитать смету
              </button>
              <button
                onClick={() => console.log('Экспорт выбранных работ')}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                📤 Экспорт
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Компонент бейджа категории
const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  const colors = {
    'mandatory': 'bg-red-100 text-red-700 border-red-200',
    'recommended': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'optional': 'bg-green-100 text-green-700 border-green-200'
  };

  const labels = {
    'mandatory': 'Обязательно',
    'recommended': 'Рекомендуется',
    'optional': 'Опционально'
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${colors[category] || 'bg-gray-100 text-gray-700'}`}>
      {labels[category as keyof typeof labels] || category}
    </span>
  );
};

export default WorksTable;

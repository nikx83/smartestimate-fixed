/**
 * Файл: /components/geological/results/WorksTable.tsx
 * Назначение: Таблица работ с фильтрами и выбором для экспорта в смету
 */

'use client';

import { useGeologicalStore } from '@/store/geologicalStore';
import { useState } from 'react';

export function WorksTable() {
  const { technicalAssignment, selectedWorks, toggleWorkSelection, selectAllWorks, deselectAllWorks } = useGeologicalStore();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterModule, setFilterModule] = useState<string>('all');
  
  if (!technicalAssignment) return null;
  
  // ИСПРАВЛЕНИЕ: используем allWorks вместо works
  let works = technicalAssignment.allWorks || [];
  if (filterCategory !== 'all') works = works.filter(w => w.category === filterCategory);
  if (filterModule !== 'all') works = works.filter(w => w.module === filterModule);
  
  // ДОБАВЛЕНО: проверка на пустой массив
  const allSelected = works.length > 0 && works.every(w => 
    selectedWorks.some(sw => sw.workId === w.workId)
  );
  
  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      {/* Фильтры */}
      <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="px-3 py-1 border rounded">
            <option value="all">Все категории</option>
            <option value="mandatory">Обязательные</option>
            <option value="recommended">Рекомендуемые</option>
            <option value="optional">Опциональные</option>
          </select>
          
          <select value={filterModule} onChange={e => setFilterModule(e.target.value)} className="px-3 py-1 border rounded">
            <option value="all">Все модули</option>
            <option value="geological">Геология</option>
            <option value="geodetic">Геодезия</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <button onClick={selectAllWorks} className="text-sm text-blue-600 hover:text-blue-700">Выбрать все</button>
          <span className="text-gray-400">|</span>
          <button onClick={deselectAllWorks} className="text-sm text-gray-600 hover:text-gray-700">Снять все</button>
        </div>
      </div>
      
      {/* Таблица */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-2 text-left">
                <input 
                  type="checkbox" 
                  checked={allSelected} 
                  onChange={e => e.target.checked ? selectAllWorks() : deselectAllWorks()} 
                />
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium">Наименование работ</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Количество</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Ед.изм</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Категория</th>
            </tr>
          </thead>
          <tbody>
            {works.length > 0 ? (
              works.map(work => {
                const isSelected = selectedWorks.some(sw => sw.workId === work.workId);
                return (
                  <tr key={work.workId} className={`border-b hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={isSelected} onChange={() => toggleWorkSelection(work.workId)} />
                    </td>
                    <td className="px-4 py-3 text-sm">{work.name}</td>
                    <td className="px-4 py-3 text-sm">{work.quantity}</td>
                    <td className="px-4 py-3 text-sm">{work.unit}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded ${
                        work.category === 'mandatory' ? 'bg-red-100 text-red-700' :
                        work.category === 'recommended' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {work.category === 'mandatory' ? 'Обязательно' : work.category === 'recommended' ? 'Рекомендуется' : 'Опционально'}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Нет работ для отображения
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-gray-50 border-t text-sm text-gray-600">
        Выбрано: {selectedWorks.length} из {technicalAssignment.allWorks?.length || 0} работ
      </div>
    </div>
  );
}

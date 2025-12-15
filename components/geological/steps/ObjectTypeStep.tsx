/**
 * Файл: /components/geological/steps/ObjectTypeStep.tsx
 * Назначение: Шаг 2 - Выбор типа объекта (площадной или линейный)
 */

'use client';

import { useGeologicalStore } from '@/store/geologicalStore';

export function ObjectTypeStep() {
  const { input, updateInputField } = useGeologicalStore();

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Тип объекта *
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => updateInputField('objectType', 'площадной')}
            className={`p-6 border-2 rounded-lg text-left transition-colors ${
              input.objectType === 'площадной'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="text-4xl mb-2">🏢</div>
            <div className="font-medium text-lg mb-1">Площадной</div>
            <div className="text-sm text-gray-600">
              Здания, сооружения, площадки
            </div>
          </button>

          <button
            onClick={() => updateInputField('objectType', 'линейный')}
            className={`p-6 border-2 rounded-lg text-left transition-colors ${
              input.objectType === 'линейный'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="text-4xl mb-2">🛤️</div>
            <div className="font-medium text-lg mb-1">Линейный</div>
            <div className="text-sm text-gray-600">
              Дороги, трубопроводы, ЛЭП
            </div>
          </button>
        </div>
      </div>

      {input.objectType === 'площадной' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Назначение здания *
            </label>
            <select
              value={input.buildingPurpose || ''}
              onChange={(e) => updateInputField('buildingPurpose', e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Выберите назначение</option>
              <option value="жилое">Жилое</option>
              <option value="общественное">Общественное</option>
              <option value="промышленное">Промышленное</option>
              <option value="складское">Складское</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Этажность *
            </label>
            <input
              type="number"
              value={input.floors || ''}
              onChange={(e) => updateInputField('floors', parseInt(e.target.value) || undefined)}
              min="1"
              placeholder="Например: 12"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Площадь застройки, м²
            </label>
            <input
              type="number"
              value={input.area || ''}
              onChange={(e) => updateInputField('area', parseFloat(e.target.value) || undefined)}
              placeholder="Например: 5000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </>
      )}

      {input.objectType === 'линейный' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип линейного объекта *
            </label>
            <select
              value={input.linearType || ''}
              onChange={(e) => updateInputField('linearType', e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Выберите тип</option>
              <option value="автодорога">Автомобильная дорога</option>
              <option value="железная дорога">Железная дорога</option>
              <option value="трубопровод">Трубопровод</option>
              <option value="ЛЭП">ЛЭП</option>
              <option value="канал">Канал</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Протяжённость, км *
            </label>
            <input
              type="number"
              value={input.length || ''}
              onChange={(e) => updateInputField('length', parseFloat(e.target.value) || undefined)}
              step="0.1"
              placeholder="Например: 15.5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {input.linearType === 'трубопровод' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Диаметр трубопровода, мм
              </label>
              <input
                type="number"
                value={input.diameter || ''}
                onChange={(e) => updateInputField('diameter', parseFloat(e.target.value) || undefined)}
                placeholder="Например: 1220"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

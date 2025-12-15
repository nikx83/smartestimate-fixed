/**
 * Файл: /components/geological/steps/FoundationStep.tsx
 * Назначение: Шаг 4 - Параметры фундаментов
 */

'use client';

import { useGeologicalStore } from '@/store/geologicalStore';

export function FoundationStep() {
  const { input, updateInputField } = useGeologicalStore();

  if (input.objectType === 'линейный') {
    return (
      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-gray-700">
          ℹ️ Для линейных объектов параметры фундаментов обычно не требуются
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Тип фундамента
        </label>
        <select
          value={input.foundationType || ''}
          onChange={(e) => updateInputField('foundationType', e.target.value as any)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Выберите тип</option>
          <option value="свайный">Свайный</option>
          <option value="свайно-плитный">Свайно-плитный</option>
          <option value="ленточный">Ленточный</option>
          <option value="плитный">Плитный</option>
          <option value="столбчатый">Столбчатый</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Глубина заложения, м
        </label>
        <input
          type="number"
          value={input.foundationDepth || ''}
          onChange={(e) => updateInputField('foundationDepth', parseFloat(e.target.value) || undefined)}
          step="0.1"
          placeholder="Например: 2.5"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {(input.foundationType === 'свайный' || input.foundationType === 'свайно-плитный') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Длина свай, м
          </label>
          <input
            type="number"
            value={input.pileLength || ''}
            onChange={(e) => updateInputField('pileLength', parseFloat(e.target.value) || undefined)}
            step="0.5"
            placeholder="Например: 15"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      )}
    </div>
  );
}

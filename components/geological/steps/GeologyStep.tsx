/**
 * Файл: /components/geological/steps/GeologyStep.tsx
 * Назначение: Шаг 5 - Геологические условия
 */

'use client';

import { useGeologicalStore } from '@/store/geologicalStore';

const SPECIAL_SOILS = [
  'просадочные',
  'набухающие',
  'засоленные',
  'заторфованные',
  'насыпные',
  'мерзлые',
  'слабые',
  'элювиальные'
];

const HAZARDS = [
  'карст',
  'оползни',
  'подтопление',
  'эрозия',
  'сейсмика',
  'пучение'
];

export function GeologyStep() {
  const { input, updateInputField } = useGeologicalStore();

  const toggleSoil = (soil: string) => {
    const current = input.specialSoils || [];
    const updated = current.includes(soil)
      ? current.filter(s => s !== soil)
      : [...current, soil];
    updateInputField('specialSoils', updated);
  };

  const toggleHazard = (hazard: string) => {
    const current = input.hazards || [];
    const updated = current.includes(hazard)
      ? current.filter(h => h !== hazard)
      : [...current, hazard];
    updateInputField('hazards', updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Специфические грунты (отметьте при наличии)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {SPECIAL_SOILS.map(soil => (
            <button
              key={soil}
              onClick={() => toggleSoil(soil)}
              className={`p-2 border-2 rounded-lg text-sm transition-colors ${
                input.specialSoils?.includes(soil)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {input.specialSoils?.includes(soil) ? '✓ ' : ''}{soil}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Опасные геологические процессы
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {HAZARDS.map(hazard => (
            <button
              key={hazard}
              onClick={() => toggleHazard(hazard)}
              className={`p-2 border-2 rounded-lg text-sm transition-colors ${
                input.hazards?.includes(hazard)
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {input.hazards?.includes(hazard) ? '⚠️ ' : ''}{hazard}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Сейсмичность района, баллы
          </label>
          <select
            value={input.seismicity || ''}
            onChange={(e) => updateInputField('seismicity', parseInt(e.target.value) || undefined)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Не указана</option>
            <option value="6">6 баллов</option>
            <option value="7">7 баллов</option>
            <option value="8">8 баллов</option>
            <option value="9">9 баллов</option>
            <option value="10">10 баллов</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Наличие подземных вод
          </label>
          <div className="flex items-center space-x-4 pt-2">
            <button
              onClick={() => updateInputField('groundwater', true)}
              className={`px-6 py-2 border-2 rounded-lg ${
                input.groundwater === true
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              Да
            </button>
            <button
              onClick={() => updateInputField('groundwater', false)}
              className={`px-6 py-2 border-2 rounded-lg ${
                input.groundwater === false
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              Нет
            </button>
          </div>
        </div>
      </div>

      {input.groundwater && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Уровень грунтовых вод, м
          </label>
          <input
            type="number"
            value={input.gwLevel || ''}
            onChange={(e) => updateInputField('gwLevel', parseFloat(e.target.value) || undefined)}
            step="0.1"
            placeholder="Например: 3.5"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      )}
    </div>
  );
}

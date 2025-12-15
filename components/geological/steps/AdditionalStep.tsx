/**
 * Файл: /components/geological/steps/AdditionalStep.tsx
 * Назначение: Шаг 6 - Дополнительные параметры
 */

'use client';

import { useGeologicalStore } from '@/store/geologicalStore';

const GEOPHYSICS_METHODS = [
  'Электроразведка (ВЭЗ)',
  'Сейсморазведка',
  'Георадиолокация',
  'Магнитометрия',
  'Гравиметрия'
];

export function AdditionalStep() {
  const { input, updateInputField } = useGeologicalStore();

  const toggleMethod = (method: string) => {
    const current = input.geophysicsMethods || [];
    const updated = current.includes(method)
      ? current.filter(m => m !== method)
      : [...current, method];
    updateInputField('geophysicsMethods', updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Геофизические методы (при необходимости)
        </label>
        <div className="space-y-2">
          {GEOPHYSICS_METHODS.map(method => (
            <button
              key={method}
              onClick={() => toggleMethod(method)}
              className={`w-full p-3 border-2 rounded-lg text-left transition-colors ${
                input.geophysicsMethods?.includes(method)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {input.geophysicsMethods?.includes(method) ? '✓ ' : '○ '}{method}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Климатическая зона
        </label>
        <select
          value={input.climateZone || ''}
          onChange={(e) => updateInputField('climateZone', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Не указана</option>
          <option value="умеренная">Умеренная</option>
          <option value="резко континентальная">Резко континентальная</option>
          <option value="аридная">Аридная (засушливая)</option>
          <option value="горная">Горная</option>
        </select>
      </div>

      <div className="space-y-3">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={input.excavationDocumentation || false}
            onChange={(e) => updateInputField('excavationDocumentation', e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">Требуется документация выемок</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={input.emergencySituation || false}
            onChange={(e) => updateInputField('emergencySituation', e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">Аварийная ситуация</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={input.structuralDeformations || false}
            onChange={(e) => updateInputField('structuralDeformations', e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">Наличие деформаций сооружений</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Дополнительные требования
        </label>
        <textarea
          value={input.additionalRequirements || ''}
          onChange={(e) => updateInputField('additionalRequirements', e.target.value)}
          rows={4}
          placeholder="Укажите особые требования заказчика..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
    </div>
  );
}

/**
 * Файл: /components/geological/steps/ProjectInfoStep.tsx
 * Назначение: Шаг 1 - Основная информация о проекте
 */

'use client';

import { useGeologicalStore } from '@/store/geologicalStore';

export function ProjectInfoStep() {
  const { input, updateInputField } = useGeologicalStore();

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Наименование проекта *
        </label>
        <input
          type="text"
          value={input.projectName || ''}
          onChange={(e) => updateInputField('projectName', e.target.value)}
          placeholder="Например: ЖК 'Алатау'"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Заказчик
        </label>
        <input
          type="text"
          value={input.client || ''}
          onChange={(e) => updateInputField('client', e.target.value)}
          placeholder="Название организации"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Местоположение объекта *
        </label>
        <input
          type="text"
          value={input.location || ''}
          onChange={(e) => updateInputField('location', e.target.value)}
          placeholder="Город, район, адрес"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Стадия проектирования *
        </label>
        <select
          value={input.designStage || ''}
          onChange={(e) => updateInputField('designStage', e.target.value as any)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Выберите стадию</option>
          <option value="ПД">Проектная документация (ПД)</option>
          <option value="РД">Рабочая документация (РД)</option>
          <option value="ПД+РД">ПД + РД</option>
        </select>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Совет:</strong> Заполните все обязательные поля (отмечены *) для перехода к следующему шагу
        </p>
      </div>
    </div>
  );
}

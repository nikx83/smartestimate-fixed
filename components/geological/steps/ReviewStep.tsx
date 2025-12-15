/**
 * Файл: /components/geological/steps/ReviewStep.tsx
 * Назначение: Шаг 7 - Проверка данных и генерация ТЗ
 */

'use client';

import { useGeologicalStore } from '@/store/geologicalStore';
import { useGeologicalEngine } from '@/hooks/useGeologicalEngine';

export function ReviewStep() {
  const { input, technicalAssignment } = useGeologicalStore();
  const { generationStatus, generationError, getStatistics } = useGeologicalEngine();

  const stats = getStatistics();

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="font-medium text-blue-900 mb-2">📋 Проверка данных перед генерацией</div>
        <div className="text-sm text-blue-700">
          Убедитесь что все данные указаны верно. После проверки нажмите "Сгенерировать ТЗ" внизу страницы.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white border rounded-lg">
          <div className="font-medium mb-2">Основная информация</div>
          <div className="space-y-1 text-sm">
            <div><span className="text-gray-600">Проект:</span> {input.projectName || 'Не указан'}</div>
            <div><span className="text-gray-600">Тип объекта:</span> {input.objectType || 'Не указан'}</div>
            <div><span className="text-gray-600">Стадия:</span> {input.designStage || 'Не указана'}</div>
          </div>
        </div>

        <div className="p-4 bg-white border rounded-lg">
          <div className="font-medium mb-2">Категории</div>
          <div className="space-y-1 text-sm">
            <div><span className="text-gray-600">Геотехническая:</span> {input.geotechnicalCategory || 'Не указана'}</div>
            <div><span className="text-gray-600">Ответственность:</span> {input.responsibilityLevel || 'Не указан'}</div>
          </div>
        </div>

        {input.objectType === 'площадной' && (
          <div className="p-4 bg-white border rounded-lg">
            <div className="font-medium mb-2">Конструкция</div>
            <div className="space-y-1 text-sm">
              <div><span className="text-gray-600">Этажность:</span> {input.floors || 'Не указана'}</div>
              <div><span className="text-gray-600">Фундамент:</span> {input.foundationType || 'Не указан'}</div>
            </div>
          </div>
        )}

        {input.objectType === 'линейный' && (
          <div className="p-4 bg-white border rounded-lg">
            <div className="font-medium mb-2">Линейный объект</div>
            <div className="space-y-1 text-sm">
              <div><span className="text-gray-600">Тип:</span> {input.linearType || 'Не указан'}</div>
              <div><span className="text-gray-600">Длина:</span> {input.length ? `${input.length} км` : 'Не указана'}</div>
            </div>
          </div>
        )}
      </div>

      {technicalAssignment && stats && (
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <span className="text-3xl">✅</span>
            <div className="flex-1">
              <div className="font-medium text-green-900 mb-2">Техническое задание сгенерировано</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Применено блоков</div>
                  <div className="text-2xl font-bold text-green-700">{stats.appliedBlocks}</div>
                </div>
                <div>
                  <div className="text-gray-600">Всего работ</div>
                  <div className="text-2xl font-bold text-green-700">{stats.totalWorks}</div>
                </div>
                <div>
                  <div className="text-gray-600">Обязательных</div>
                  <div className="text-2xl font-bold text-blue-700">{stats.mandatoryWorks}</div>
                </div>
                <div>
                  <div className="text-gray-600">Рекомендуемых</div>
                  <div className="text-2xl font-bold text-yellow-700">{stats.recommendedWorks}</div>
                </div>
              </div>

              {stats.recommendations > 0 && (
                <div className="mt-3 text-sm text-green-700">
                  📝 Рекомендаций: {stats.recommendations}
                </div>
              )}

              {stats.warnings > 0 && (
                <div className="mt-2 text-sm text-yellow-700">
                  ⚠️ Предупреждений: {stats.warnings}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {generationStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="font-medium text-red-900">❌ Ошибка генерации</div>
          <div className="text-sm text-red-700 mt-1">{generationError}</div>
        </div>
      )}
    </div>
  );
}

/**
 * Путь: /components/technical-assignment/EstimateIntegration.tsx
 * Название: EstimateIntegration
 * Назначение: Кнопки интеграции с модулем смет
 * 
 * Функции:
 * - "Создать смету" - автозаполнение из ТЗ
 * - "Редактировать смету" - ручная корректировка
 * - "Экспорт сметы" - выгрузка в Excel/PDF
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calculator, FileSpreadsheet, Edit3, ArrowRight,
  Check, AlertCircle, Info 
} from 'lucide-react';
import { convertAssignmentToEstimate } from '@/lib/integration/assignmentToEstimate';
import type { TechnicalAssignment } from '@/types/technical-assignment';
import type { CalculationResultDisplay } from '@/types/calculation';

interface EstimateIntegrationProps {
  assignment: TechnicalAssignment;
  onEstimateCreated?: (estimate: CalculationResultDisplay) => void;
}

export function EstimateIntegration({
  assignment,
  onEstimateCreated,
}: EstimateIntegrationProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Подсчёт выбранных работ
  const selectedWorksCount = 
    assignment.works.fieldWorks.filter(w => w.isSelected).length +
    assignment.works.labWorks.filter(w => w.isSelected).length +
    assignment.works.officeWorks.filter(w => w.isSelected).length;

  // Примерная стоимость
  const estimatedCost = assignment.statistics.totalCost || 0;

  /**
   * Создать смету автоматически
   */
  const handleCreateEstimate = async (mode: 'auto' | 'manual') => {
    setIsGenerating(true);

    try {
      // Преобразуем ТЗ в смету
      const estimate = convertAssignmentToEstimate(assignment);

      if (mode === 'auto') {
        // Автоматический режим - сразу сохраняем
        onEstimateCreated?.(estimate);

        // Сохраняем в localStorage для передачи на страницу сметы
        localStorage.setItem('draft_estimate', JSON.stringify({
          estimate,
          assignmentId: assignment.metadata.id,
          projectName: assignment.generalInfo.projectName,
          createdAt: new Date().toISOString(),
          mode: 'auto',
        }));

        // Переходим на страницу сметы
        router.push('/calculation?from=assignment&mode=auto');
      } else {
        // Ручной режим - даём возможность редактировать
        localStorage.setItem('draft_estimate', JSON.stringify({
          estimate,
          assignmentId: assignment.metadata.id,
          projectName: assignment.generalInfo.projectName,
          createdAt: new Date().toISOString(),
          mode: 'manual',
        }));

        // Переходим на страницу редактирования сметы
        router.push('/calculation?from=assignment&mode=manual');
      }
    } catch (error) {
      console.error('Ошибка создания сметы:', error);
      alert('Не удалось создать смету. Попробуйте ещё раз.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6">
      {/* Заголовок */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
          <Calculator className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Составить смету работ
          </h3>
          <p className="text-sm text-gray-600">
            Автоматически создайте детальную смету на основе выбранных работ из технического задания
          </p>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <div className="text-sm text-gray-600 mb-1">Выбрано работ</div>
          <div className="text-2xl font-bold text-blue-600">
            {selectedWorksCount}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <div className="text-sm text-gray-600 mb-1">Примерная стоимость</div>
          <div className="text-2xl font-bold text-green-600">
            {estimatedCost > 0 
              ? `${Math.round(estimatedCost / 1000)}K ₸` 
              : 'Расчёт...'
            }
          </div>
        </div>
      </div>

      {/* Предупреждение если мало работ */}
      {selectedWorksCount === 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-900 mb-1">
                Работы не выбраны
              </h4>
              <p className="text-sm text-amber-700">
                Вернитесь к разделу "Состав работ" и выберите необходимые работы для включения в смету.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Основные кнопки */}
      {!showOptions ? (
        <button
          onClick={() => setShowOptions(true)}
          disabled={selectedWorksCount === 0 || isGenerating}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Calculator className="w-5 h-5" />
          Создать смету
          <ArrowRight className="w-5 h-5" />
        </button>
      ) : (
        <div className="space-y-3">
          {/* Автоматический режим */}
          <button
            onClick={() => handleCreateEstimate('auto')}
            disabled={isGenerating}
            className="w-full flex items-start gap-4 p-4 bg-white rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 mb-1">
                Автоматическая смета
              </div>
              <div className="text-sm text-gray-600">
                Система автоматически рассчитает стоимость всех выбранных работ с учётом коэффициентов. Быстро и без ввода данных.
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-blue-600">
                <Check className="w-4 h-4" />
                Рекомендуется для типовых проектов
              </div>
            </div>
          </button>

          {/* Ручной режим */}
          <button
            onClick={() => handleCreateEstimate('manual')}
            disabled={isGenerating}
            className="w-full flex items-start gap-4 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all text-left disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Edit3 className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 mb-1">
                Редактирование сметы
              </div>
              <div className="text-sm text-gray-600">
                Перейти к редактору сметы с возможностью ручной корректировки цен, количества работ и добавления позиций ресурсным методом.
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                <Info className="w-4 h-4" />
                Для сложных проектов с особыми условиями
              </div>
            </div>
          </button>

          {/* Кнопка "Назад" */}
          <button
            onClick={() => setShowOptions(false)}
            className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
          >
            ← Назад
          </button>
        </div>
      )}

      {/* Подсказка */}
      <div className="mt-4 p-3 bg-blue-100 rounded-lg">
        <p className="text-xs text-blue-800 leading-relaxed">
          💡 <strong>Совет:</strong> После создания сметы вы сможете экспортировать её в Excel, 
          добавить накладные расходы, прибыль подрядчика и НДС для получения полной сметной стоимости.
        </p>
      </div>
    </div>
  );
}

/**
 * Компактная версия кнопки для встраивания
 */
export function EstimateQuickAction({ assignment }: { assignment: TechnicalAssignment }) {
  const router = useRouter();

  const handleQuickEstimate = () => {
    const estimate = convertAssignmentToEstimate(assignment);
    
    localStorage.setItem('draft_estimate', JSON.stringify({
      estimate,
      assignmentId: assignment.metadata.id,
      projectName: assignment.generalInfo.projectName,
      createdAt: new Date().toISOString(),
      mode: 'auto',
    }));

    router.push('/calculation?from=assignment&mode=auto');
  };

  return (
    <button
      onClick={handleQuickEstimate}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
    >
      <FileSpreadsheet className="w-4 h-4" />
      Смета
    </button>
  );
}

/**
 * Путь: /components/technical-assignment/AssignmentStats.tsx
 * Название: AssignmentStats
 * Назначение: Дашборд со статистикой и метриками технического задания
 * 
 * Особенности:
 * - Ключевые метрики (работы, объёмы, стоимость)
 * - Графики распределения работ
 * - Индикаторы прогресса
 * - Экспорт в различные форматы
 */

'use client';

import { 
  FileText, Calendar, DollarSign, CheckCircle, 
  AlertCircle, TrendingUp, Download, Share2 
} from 'lucide-react';
import type { AssignmentStatistics } from '@/types/technical-assignment';

interface AssignmentStatsProps {
  statistics: AssignmentStatistics;
  projectName: string;
  deadline?: Date;
  estimatedCost?: number;
  onExport?: (format: 'pdf' | 'docx' | 'excel') => void;
  onShare?: () => void;
}

export function AssignmentStats({
  statistics,
  projectName,
  deadline,
  estimatedCost,
  onExport,
  onShare,
}: AssignmentStatsProps) {
  // Процент выбранных работ
  const selectedPercentage = Math.round(
    (statistics.selectedWorks / statistics.totalWorks) * 100
  );

  return (
    <div className="space-y-6">
      {/* Заголовок дашборда */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{projectName}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Техническое задание на инженерно-геологические изыскания
          </p>
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center gap-2">
          {onExport && (
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Экспорт
              </button>

              {/* Выпадающее меню форматов */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button
                  onClick={() => onExport('pdf')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                >
                  📄 Экспорт в PDF
                </button>
                <button
                  onClick={() => onExport('docx')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  📝 Экспорт в DOCX
                </button>
                <button
                  onClick={() => onExport('excel')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg"
                >
                  📊 Экспорт в Excel
                </button>
              </div>
            </div>
          )}

          {onShare && (
            <button
              type="button"
              onClick={onShare}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Поделиться
            </button>
          )}
        </div>
      </div>

      {/* Сетка метрик */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Метрика: Работы */}
        <StatCard
          icon={<FileText className="w-5 h-5" />}
          label="Всего работ"
          value={statistics.totalWorks}
          sublabel={`${statistics.selectedWorks} выбрано (${selectedPercentage}%)`}
          color="blue"
        />

        {/* Метрика: Заполненность */}
        <StatCard
          icon={<CheckCircle className="w-5 h-5" />}
          label="Заполненность"
          value={`${statistics.completeness}%`}
          sublabel={
            statistics.completeness === 100
              ? 'Готово к экспорту'
              : `${100 - statistics.completeness}% осталось`
          }
          color="green"
          progress={statistics.completeness}
        />

        {/* Метрика: Срок */}
        {deadline && (
          <StatCard
            icon={<Calendar className="w-5 h-5" />}
            label="Срок сдачи"
            value={formatDate(deadline)}
            sublabel={getDaysUntil(deadline)}
            color="orange"
          />
        )}

        {/* Метрика: Стоимость */}
        {estimatedCost !== undefined && (
          <StatCard
            icon={<DollarSign className="w-5 h-5" />}
            label="Ориентировочная стоимость"
            value={formatCurrency(estimatedCost)}
            sublabel="Без учёта НДС"
            color="purple"
          />
        )}
      </div>

      {/* Детальная статистика работ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Категории работ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Распределение по категориям
          </h3>

          <div className="space-y-4">
            <CategoryBar
              label="Обязательные"
              value={statistics.mandatoryWorks}
              total={statistics.totalWorks}
              color="red"
            />
            <CategoryBar
              label="Рекомендуемые"
              value={statistics.recommendedWorks}
              total={statistics.totalWorks}
              color="yellow"
            />
            <CategoryBar
              label="Опциональные"
              value={statistics.optionalWorks}
              total={statistics.totalWorks}
              color="gray"
            />
          </div>
        </div>

        {/* Объёмы работ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Объёмы работ
          </h3>

          <div className="space-y-4">
            {statistics.totalVolume.drilling > 0 && (
              <VolumeItem
                icon="🔨"
                label="Буровые работы"
                value={statistics.totalVolume.drilling}
                unit="п.м."
              />
            )}
            
            {statistics.totalVolume.samples > 0 && (
              <VolumeItem
                icon="🧪"
                label="Отбор проб"
                value={statistics.totalVolume.samples}
                unit="шт"
              />
            )}
            
            {statistics.totalVolume.tests > 0 && (
              <VolumeItem
                icon="⚗️"
                label="Лабораторные испытания"
                value={statistics.totalVolume.tests}
                unit="опр."
              />
            )}

            {statistics.normativeReferences > 0 && (
              <VolumeItem
                icon="📚"
                label="Нормативные ссылки"
                value={statistics.normativeReferences}
                unit="док."
              />
            )}
          </div>
        </div>
      </div>

      {/* Предупреждения и рекомендации */}
      {statistics.completeness < 100 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-900 mb-1">
                Заполните оставшиеся разделы
              </h4>
              <p className="text-sm text-amber-700">
                Для экспорта полноценного технического задания рекомендуется заполнить 
                все обязательные разделы и добавить уточнения там, где это необходимо.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ
// ============================================================================

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sublabel: string;
  color: 'blue' | 'green' | 'orange' | 'purple';
  progress?: number;
}

function StatCard({ icon, label, value, sublabel, color, progress }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    orange: 'bg-orange-100 text-orange-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>
      <div className="text-xs text-gray-500">{sublabel}</div>

      {progress !== undefined && (
        <div className="mt-3 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

interface CategoryBarProps {
  label: string;
  value: number;
  total: number;
  color: 'red' | 'yellow' | 'gray';
}

function CategoryBar({ label, value, total, color }: CategoryBarProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  const colorClasses = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    gray: 'bg-gray-400',
  };

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">
          {value} ({percentage}%)
        </span>
      </div>
      
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface VolumeItemProps {
  icon: string;
  label: string;
  value: number;
  unit: string;
}

function VolumeItem({ icon, label, value, unit }: VolumeItemProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <div className="text-sm font-semibold text-gray-900">
        {value} {unit}
      </div>
    </div>
  );
}

// ============================================================================
// УТИЛИТЫ
// ============================================================================

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function getDaysUntil(date: Date): string {
  const now = new Date();
  const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diff < 0) {
    return '⚠️ Срок истёк';
  } else if (diff === 0) {
    return '🔥 Сегодня!';
  } else if (diff <= 7) {
    return `⏰ Осталось ${diff} дн.`;
  } else {
    return `📅 Через ${diff} дн.`;
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'KZT',
    minimumFractionDigits: 0,
  }).format(amount);
}

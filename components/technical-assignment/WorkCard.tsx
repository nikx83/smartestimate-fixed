/**
 * Файл: /components/technical-assignment/WorkCard.tsx
 * Назначение: Интерактивная карточка работы с возможностью выбора
 * 
 * Описание:
 * Красивая, эргономичная карточка для отображения работы в техническом задании.
 * Включает чекбокс выбора, раскрывающиеся детали, цитаты из нормативов,
 * экономическое обоснование и поле для примечаний пользователя.
 * Дизайн теплый, приятный, не перегруженный.
 */

'use client';

import { useState } from 'react';
import type { InteractiveWorkItem } from '@/types/technical-assignment';
import { getCategoryIcon, getCategoryColor, getModuleIcon } from '@/lib/technical-assignment/utils';

interface WorkCardProps {
  work: InteractiveWorkItem;
  isSelected: boolean;
  onToggle: (workId: string) => void;
  onUpdateNotes: (workId: string, notes: string) => void;
  showDetails?: boolean;
}

export function WorkCard({
  work,
  isSelected,
  onToggle,
  onUpdateNotes,
  showDetails = false,
}: WorkCardProps) {
  const [isExpanded, setIsExpanded] = useState(showDetails);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [localNotes, setLocalNotes] = useState(work.userNotes || '');

  const handleSaveNotes = () => {
    onUpdateNotes(work.id, localNotes);
    setIsEditingNotes(false);
  };

  const categoryColor = getCategoryColor(work.category);
  const categoryIcon = getCategoryIcon(work.category);
  const moduleIcon = getModuleIcon(work.module);

  const priorityLabels: Record<string, string> = {
    'mandatory': 'ОБЯЗАТЕЛЬНО',
    'recommended': 'РЕКОМЕНДУЕТСЯ',
    'optional': 'ОПЦИОНАЛЬНО',
    'reference': 'СПРАВОЧНО',
  };

  return (
    <div
      className={`
        group relative rounded-xl border-2 transition-all duration-200
        ${isSelected 
          ? 'border-blue-400 bg-blue-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
        }
      `}
    >
      {/* Основная часть карточки */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Чекбокс */}
          <div className="flex-shrink-0 pt-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggle(work.id)}
              disabled={!work.canBeExcluded}
              className={`
                w-5 h-5 rounded border-2 cursor-pointer
                focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                transition-colors
                ${!work.canBeExcluded ? 'opacity-50 cursor-not-allowed' : ''}
                ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}
              `}
            />
          </div>

          {/* Содержимое */}
          <div className="flex-1 min-w-0">
            {/* Заголовок */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-semibold text-gray-900 text-base leading-tight">
                {moduleIcon} {work.name}
              </h3>
              
              {/* Бейдж приоритета */}
              <span
                className={`
                  flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium
                  ${categoryColor}
                `}
              >
                {categoryIcon} {priorityLabels[work.category]}
              </span>
            </div>

            {/* Краткое описание */}
            {work.description && (
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                {work.description}
              </p>
            )}

            {/* Параметры работы */}
            <div className="flex flex-wrap gap-4 text-sm mb-3">
              {work.quantity && work.unit && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500">📊 Объём:</span>
                  <span className="font-medium text-gray-900">
                    {work.quantity} {work.unit}
                  </span>
                </div>
              )}

              {work.module && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500">🏷️ Модуль:</span>
                  <span className="font-medium text-gray-700">{work.module}</span>
                </div>
              )}
            </div>

            {/* Предупреждения */}
            {work.warnings && work.warnings.length > 0 && (
              <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs font-medium text-amber-800 mb-1">⚠️ Внимание:</p>
                <ul className="text-xs text-amber-700 space-y-0.5">
                  {work.warnings.map((warning, idx) => (
                    <li key={idx}>• {warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Кнопка "Подробнее" */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="
                text-sm text-blue-600 hover:text-blue-700 font-medium
                flex items-center gap-1 transition-colors
              "
            >
              {isExpanded ? '▼ Скрыть детали' : '▶ Подробнее'}
            </button>
          </div>
        </div>

        {/* Раскрывающаяся детальная информация */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            {/* Нормативное обоснование */}
            {work.normativeQuotes && work.normativeQuotes.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  📖 Нормативное обоснование
                </h4>
                <div className="space-y-3">
                  {work.normativeQuotes.map((quote, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded">
                          {quote.document}
                        </span>
                        <span className="text-xs text-gray-600">{quote.section}</span>
                      </div>
                      
                      <blockquote className="text-sm text-gray-700 italic leading-relaxed mb-2 pl-3 border-l-2 border-blue-300">
                        "{quote.quote}"
                      </blockquote>
                      
                      {quote.relevance && (
                        <p className="text-xs text-gray-600 bg-white px-2 py-1 rounded">
                          💡 {quote.relevance}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Экономическое обоснование */}
            {work.economicJustification && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  💰 Экономическое обоснование
                </h4>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
                  <div>
                    <p className="text-xs font-medium text-green-800 mb-1">Необходимость:</p>
                    <p className="text-sm text-green-700">
                      {work.economicJustification.necessity}
                    </p>
                  </div>

                  {work.economicJustification.benefits.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-green-800 mb-1">Получаемые данные:</p>
                      <ul className="text-sm text-green-700 space-y-0.5">
                        {work.economicJustification.benefits.map((benefit, idx) => (
                          <li key={idx}>✓ {benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {work.economicJustification.risks.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-red-800 mb-1">Риски при невыполнении:</p>
                      <ul className="text-sm text-red-700 space-y-0.5">
                        {work.economicJustification.risks.map((risk, idx) => (
                          <li key={idx}>⚠️ {risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Примечания пользователя */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                📝 Примечания заказчика
              </h4>
              
              {isEditingNotes ? (
                <div className="space-y-2">
                  <textarea
                    value={localNotes}
                    onChange={(e) => setLocalNotes(e.target.value)}
                    placeholder="Добавьте свои комментарии или особые требования к этой работе..."
                    className="
                      w-full px-3 py-2 border border-gray-300 rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      resize-none text-sm
                    "
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveNotes}
                      className="
                        px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg
                        hover:bg-blue-700 transition-colors
                      "
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={() => {
                        setLocalNotes(work.userNotes || '');
                        setIsEditingNotes(false);
                      }}
                      className="
                        px-3 py-1.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg
                        hover:bg-gray-300 transition-colors
                      "
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {work.userNotes ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {work.userNotes}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic mb-2">
                      Примечания отсутствуют
                    </p>
                  )}
                  <button
                    onClick={() => setIsEditingNotes(true)}
                    className="
                      text-sm text-blue-600 hover:text-blue-700 font-medium
                      transition-colors
                    "
                  >
                    {work.userNotes ? '✏️ Редактировать' : '➕ Добавить примечание'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Индикатор обязательности */}
      {!work.canBeExcluded && (
        <div className="absolute top-2 right-2">
          <div
            className="
              w-2 h-2 rounded-full bg-red-500
              animate-pulse
            "
            title="Обязательная работа, не может быть исключена"
          />
        </div>
      )}
    </div>
  );
}

export default WorkCard;

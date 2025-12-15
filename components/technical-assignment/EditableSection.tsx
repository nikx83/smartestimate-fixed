/**
 * Файл: /components/technical-assignment/EditableSection.tsx
 * Назначение: Секция ТЗ с редактируемым пользовательским текстом
 * 
 * Описание:
 * Компонент для отображения секции технического задания с возможностью
 * добавления пользовательских примечаний. Включает стандартный текст из норм
 * и поле для дополнений заказчика. Дизайн минималистичный, удобный.
 */

'use client';

import { useState } from 'react';

interface EditableSectionProps {
  title: string;
  icon?: string;
  standardContent?: string | string[];
  userNotes?: string;
  onUpdateNotes?: (notes: string) => void;
  placeholder?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export function EditableSection({
  title,
  icon = '📄',
  standardContent,
  userNotes = '',
  onUpdateNotes,
  placeholder = 'Добавьте дополнительные требования или пояснения...',
  collapsible = true,
  defaultExpanded = true,
}: EditableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [localNotes, setLocalNotes] = useState(userNotes);

  const handleSaveNotes = () => {
    if (onUpdateNotes) {
      onUpdateNotes(localNotes);
    }
    setIsEditingNotes(false);
  };

  const handleCancelEdit = () => {
    setLocalNotes(userNotes);
    setIsEditingNotes(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Заголовок секции */}
      <div
        className={`
          flex items-center justify-between px-5 py-4 bg-gradient-to-r from-gray-50 to-white
          ${collapsible ? 'cursor-pointer hover:bg-gray-100' : ''}
          transition-colors
        `}
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          {title}
        </h2>

        {collapsible && (
          <button
            className="text-gray-500 hover:text-gray-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Содержимое секции */}
      {isExpanded && (
        <div className="px-5 py-4 space-y-4">
          {/* Стандартный контент */}
          {standardContent && (
            <div className="prose prose-sm max-w-none">
              {Array.isArray(standardContent) ? (
                <ul className="space-y-2">
                  {standardContent.map((item, idx) => (
                    <li key={idx} className="text-gray-700">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {standardContent}
                </div>
              )}
            </div>
          )}

          {/* Разделитель */}
          {standardContent && onUpdateNotes && (
            <div className="border-t border-gray-200 pt-4" />
          )}

          {/* Примечания заказчика */}
          {onUpdateNotes && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                ✏️ Дополнительные требования заказчика
              </h3>

              {isEditingNotes ? (
                <div className="space-y-3">
                  <textarea
                    value={localNotes}
                    onChange={(e) => setLocalNotes(e.target.value)}
                    placeholder={placeholder}
                    className="
                      w-full px-4 py-3 border-2 border-gray-300 rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      resize-none text-sm leading-relaxed
                      transition-all
                    "
                    rows={6}
                    autoFocus
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveNotes}
                      className="
                        px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg
                        hover:bg-blue-700 active:bg-blue-800
                        transition-colors shadow-sm
                      "
                    >
                      💾 Сохранить
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="
                        px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg
                        hover:bg-gray-300 active:bg-gray-400
                        transition-colors
                      "
                    >
                      ✕ Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {localNotes ? (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-3">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {localNotes}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 mb-3">
                      <p className="text-sm text-gray-500 italic text-center">
                        Дополнительные требования не указаны
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => setIsEditingNotes(true)}
                    className="
                      text-sm text-blue-600 hover:text-blue-700 font-medium
                      flex items-center gap-1 transition-colors
                    "
                  >
                    {localNotes ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Редактировать
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Добавить требования
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EditableSection;

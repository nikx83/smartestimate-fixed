/**
 * Путь: /components/technical-assignment/CompactAssignmentDisplay.tsx
 * Название: CompactAssignmentDisplay (Компактный вид)
 * Назначение: Отображение технического задания с аккордеоном и боковой панелью навигации
 */

'use client';

import { useState } from 'react';
import { 
  ChevronDown, ChevronRight, FileText, CheckCircle2, 
  AlertCircle, Download, Printer, Share2, Edit3
} from 'lucide-react';
import type { TechnicalAssignment } from '@/types/technical-assignment';

interface CompactAssignmentDisplayProps {
  assignment: TechnicalAssignment | null; // ← исправлено
  onUpdate?: (updated: TechnicalAssignment) => void;
  onExport?: (format: 'pdf' | 'docx' | 'excel') => void;
}

interface Section {
  id: string;
  number: string;
  title: string;
  content: React.ReactNode;
  completeness: number;
  isEmpty?: boolean;
}

export function CompactAssignmentDisplay({
  assignment,
  onUpdate,
  onExport,
}: CompactAssignmentDisplayProps) {
  // Проверка на null/undefined
  if (!assignment) {
    return (
      <div className="bg-white rounded-xl border-2 border-gray-300 shadow-lg p-8">
        <div className="text-center py-12">
          <div className="text-3xl mb-4">📄</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Техническое задание не сгенерировано
          </h3>
          <p className="text-gray-500">
            Заполните все параметры проекта и нажмите "Сформировать ТЗ"
          </p>
        </div>
      </div>
    );
  }

  // Состояния раскрытия секций
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['1']));
  const [viewMode, setViewMode] = useState<'compact' | 'full'>('compact');

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const expandAll = () => {
    const allIds = sections.map((s) => s.id);
    setExpandedSections(new Set(allIds));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  const renderSectionContent = (content: any): React.ReactNode => {
    if (!content) return <p className="text-gray-400 italic">Не указано</p>;

    if (typeof content === 'string') {
      return <p className="text-gray-800 leading-relaxed">{content}</p>;
    }

    if (typeof content === 'object') {
      return (
        <div className="space-y-3">
          {Object.entries(content).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return null;
            
            return (
              <div key={key} className="flex gap-3">
                <span className="font-medium text-gray-600 min-w-[200px]">
                  {formatFieldName(key)}:
                </span>
                <span className="text-gray-800 flex-1">
                  {Array.isArray(value) ? value.join(', ') : String(value)}
                </span>
              </div>
            );
          })}
        </div>
      );
    }

    return null;
  };

  const formatFieldName = (key: string): string => {
    const names: Record<string, string> = {
      projectName: 'Название проекта',
      customerName: 'Заказчик',
      location: 'Местоположение',
      workDeadline: 'Срок выполнения',
      objectType: 'Тип объекта',
      buildingType: 'Тип здания',
      floors: 'Этажность',
      foundationType: 'Тип фундамента',
      depth: 'Глубина',
      seismicity: 'Сейсмичность',
      soilType: 'Тип грунта',
    };
    return names[key] || key;
  };

  const calculateCompleteness = (data: any): number => {
    if (!data) return 0;
    const fields = Object.values(data).filter((v) => v !== null && v !== undefined && v !== '');
    const total = Object.keys(data).length;
    return total > 0 ? Math.round((fields.length / total) * 100) : 0;
  };

  // Формирование секций (ИСПРАВЛЕНЫ ВСЕ ОБРАЩЕНИЯ К assignment)
  const sections: Section[] = [
    {
      id: '1',
      number: '1',
      title: 'Общие сведения о проекте',
      content: renderSectionContent(assignment?.generalInfo),
      completeness: calculateCompleteness(assignment?.generalInfo),
    },
    {
      id: '2',
      number: '2',
      title: 'Характеристика объекта строительства',
      content: renderSectionContent(assignment?.objectCharacteristics),
      completeness: calculateCompleteness(assignment?.objectCharacteristics),
    },
    {
      id: '3',
      number: '3',
      title: 'Природные условия площадки',
      content: renderSectionContent(assignment?.naturalConditions),
      completeness: calculateCompleteness(assignment?.naturalConditions),
    },
    {
      id: '4',
      number: '4',
      title: 'Цель и задачи изысканий',
      content: renderSectionContent(assignment?.surveyPurpose),
      completeness: calculateCompleteness(assignment?.surveyPurpose),
    },
    {
      id: '5',
      number: '5',
      title: 'Состав и объёмы работ',
      content: (
        <div className="space-y-4">
          {/* Полевые работы */}
          {assignment?.fieldWorks && assignment.fieldWorks.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Полевые работы:</h4>
              <div className="space-y-2">
                {assignment.fieldWorks.map((work, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-gray-800">{work.name}</span>
                    <span className="font-medium text-blue-700">
                      {work.quantity} {work.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Лабораторные работы */}
          {assignment?.labWorks && assignment.labWorks.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Лабораторные испытания:</h4>
              <div className="space-y-2">
                {assignment.labWorks.map((work, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-gray-800">{work.name}</span>
                    <span className="font-medium text-green-700">
                      {work.quantity} {work.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Камеральные работы */}
          {assignment?.officeWorks && assignment.officeWorks.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Камеральные работы:</h4>
              <div className="space-y-2">
                {assignment.officeWorks.map((work, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <span className="text-gray-800">{work.name}</span>
                    <span className="font-medium text-amber-700">
                      {work.quantity} {work.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
      completeness: 100,
    },
    {
      id: '6',
      number: '6',
      title: 'Нормативные документы',
      content: (
        <div className="space-y-2">
          {assignment?.normativeBase && assignment.normativeBase.length > 0 ? (
            assignment.normativeBase.map((norm, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-gray-500">•</span>
                <span className="text-gray-800">{norm}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-400 italic">Нормативы не указаны</p>
          )}
        </div>
      ),
      completeness: 100,
    },
    {
      id: '7',
      number: '7',
      title: 'Исходные данные',
      content: renderSectionContent(assignment?.initialData),
      completeness: calculateCompleteness(assignment?.initialData),
    },
    {
      id: '8',
      number: '8',
      title: 'Требования к производству работ',
      content: renderSectionContent(assignment?.productionRequirements),
      completeness: calculateCompleteness(assignment?.productionRequirements),
    },
    {
      id: '9',
      number: '9',
      title: 'Техника безопасности и охрана труда',
      content: renderSectionContent(assignment?.safetyRequirements),
      completeness: 100,
    },
    {
      id: '10',
      number: '10',
      title: 'Охрана окружающей среды',
      content: renderSectionContent(assignment?.environmentalProtection),
      completeness: 100,
    },
    {
      id: '11',
      number: '11',
      title: 'Инженерная защита территории',
      content: renderSectionContent(assignment?.engineeringProtection),
      completeness: calculateCompleteness(assignment?.engineeringProtection),
    },
    {
      id: '12',
      number: '12',
      title: 'Прогноз изменений природных условий',
      content: renderSectionContent(assignment?.forecast),
      completeness: calculateCompleteness(assignment?.forecast),
    },
    {
      id: '13',
      number: '13',
      title: 'Состав и форма отчётной документации',
      content: renderSectionContent(assignment?.reportingRequirements),
      completeness: 100,
    },
    {
      id: '14',
      number: '14',
      title: 'Прочие условия',
      content: renderSectionContent(assignment?.otherConditions),
      completeness: assignment?.otherConditions ? 100 : 0,
      isEmpty: !assignment?.otherConditions,
    },
    {
      id: '15',
      number: '15',
      title: 'Заказчик',
      content: renderSectionContent(assignment?.customer),
      completeness: calculateCompleteness(assignment?.customer),
    },
  ].filter((s) => !s.isEmpty);

  return (
    <div className="bg-white rounded-xl border-2 border-gray-300 shadow-lg overflow-hidden">
      {/* ШАПКА */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-300 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  ТЕХНИЧЕСКОЕ ЗАДАНИЕ
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  на инженерно-геологические изыскания
                </p>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Проект:</span>
                <p className="font-semibold text-gray-900">
                  {assignment?.generalInfo?.projectName || 'Не указано'}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Заказчик:</span>
                <p className="font-semibold text-gray-900">
                  {assignment?.customer?.name || 'Не указан'}
                </p>
              </div>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex gap-2">
            <button
              onClick={() => onExport?.('pdf')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Экспорт в PDF"
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Печать"
            >
              <Printer className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => alert('Функция "Поделиться" в разработке')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Поделиться"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Управление раскрытием */}
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={expandAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Раскрыть всё
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={collapseAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Свернуть всё
          </button>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Вид:</span>
            <button
              onClick={() => setViewMode('compact')}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'compact'
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Компактный
            </button>
            <button
              onClick={() => setViewMode('full')}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'full'
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Полный
            </button>
          </div>
        </div>
      </div>

      {/* ОГЛАВЛЕНИЕ */}
      <div className="flex">
        {/* Боковая панель */}
        <div className="w-80 border-r-2 border-gray-200 bg-gray-50 overflow-y-auto max-h-[800px]">
          <div className="p-4 border-b-2 border-gray-200 bg-white">
            <h3 className="font-semibold text-gray-900">Содержание</h3>
            <p className="text-xs text-gray-500 mt-1">
              {sections.length} разделов
            </p>
          </div>
          
          <div className="py-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => toggleSection(section.id)}
                className={`
                  w-full text-left px-4 py-3 flex items-center gap-3
                  transition-colors border-l-4
                  ${expandedSections.has(section.id)
                    ? 'bg-blue-50 border-blue-500 text-blue-900'
                    : 'border-transparent hover:bg-gray-100 text-gray-700'
                  }
                `}
              >
                {expandedSections.has(section.id) ? (
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {section.number}.
                    </span>
                    <span className="text-sm truncate">
                      {section.title}
                    </span>
                  </div>
                  
                  {/* Индикатор полноты */}
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          section.completeness === 100
                            ? 'bg-green-500'
                            : section.completeness > 50
                            ? 'bg-blue-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${section.completeness}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {section.completeness}%
                    </span>
                  </div>
                </div>

                {section.completeness === 100 && (
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Основной контент */}
        <div className="flex-1 overflow-y-auto max-h-[800px] bg-white">
          <div className="p-8 max-w-4xl mx-auto">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`mb-6 ${
                  expandedSections.has(section.id) ? '' : 'opacity-40'
                }`}
              >
                {/* Заголовок секции */}
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <span className="text-blue-600">{section.number}.</span>
                    {section.title}
                  </h2>
                  <div className="mt-2 h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />
                </div>

                {/* Содержимое */}
                {expandedSections.has(section.id) && (
                  <div className="pl-8">
                    {section.content}
                  </div>
                )}

                {!expandedSections.has(section.id) && (
                  <div className="pl-8 text-sm text-gray-400 italic">
                    Нажмите на раздел в меню слева, чтобы раскрыть...
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ФУТЕР */}
      <div className="border-t-2 border-gray-200 bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Всего разделов: <strong>{sections.length}</strong></span>
            <span className="text-gray-300">|</span>
            <span>
              Заполнено: <strong>
                {sections.filter((s) => s.completeness === 100).length}
              </strong>
            </span>
            <span className="text-gray-300">|</span>
            <span>
              Работ: <strong>
                {(assignment?.fieldWorks?.length || 0) +
                  (assignment?.labWorks?.length || 0) +
                  (assignment?.officeWorks?.length || 0)}
              </strong>
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onExport?.('pdf')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Скачать PDF
            </button>
            <button
              onClick={() => onExport?.('docx')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Скачать DOCX
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Компонент для структурированного отображения технического задания
 * Полная версия с тремя режимами просмотра
 * components/technical-assignment/TechnicalAssignmentDisplay.tsx
 */

import React, { useState } from 'react';

// Типы данных
interface WorkItem {
  workId: string;
  name: string;
  quantity: number;
  unit: string;
  category: 'mandatory' | 'recommended' | 'optional';
  normativeBase?: string;
  description?: string;
  module?: string;
  tags?: string[];
}

interface TechnicalAssignmentResult {
  allWorks: WorkItem[];
  metadata?: {
    totalWorks?: number;
    highestPriority?: string;
    generatedAt?: Date;
    projectName?: string;
  };
}

interface TechnicalAssignmentDisplayProps {
  assignment: TechnicalAssignmentResult;
  onExport?: (format: 'pdf' | 'docx' | 'xlsx') => void;
  showDetails?: boolean;
}

export const TechnicalAssignmentDisplay: React.FC<TechnicalAssignmentDisplayProps> = ({
  assignment,
  onExport,
  showDetails = true
}) => {
  const [selectedView, setSelectedView] = useState<'structured' | 'flat' | 'normative'>('structured');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['mandatory', 'recommended'])
  );

  // Защитные проверки и значения по умолчанию
  const metadata = assignment.metadata || {};
  const works = assignment.allWorks || [];
  const projectName = metadata.projectName || 'Не указано';
  const generatedAt = metadata.generatedAt || new Date();
  const totalWorks = metadata.totalWorks || works.length;
  const highestPriority = metadata.highestPriority || 'НЕ ОПРЕДЕЛЕН';

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  return (
    <div className="technical-assignment-display bg-white rounded-lg border">
      {/* Заголовок и панель управления */}
      <div className="header p-6 border-b">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Техническое задание на инженерно-геологические изыскания
            </h2>
            <p className="text-gray-600 mt-1">
              {projectName} • {generatedAt.toLocaleDateString('ru-RU')}
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => onExport?.('pdf')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium flex items-center gap-2"
            >
              <span>📄</span>
              PDF
            </button>
            <button
              onClick={() => onExport?.('docx')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
            >
              <span>📝</span>
              DOCX
            </button>
            <button
              onClick={() => onExport?.('xlsx')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center gap-2"
            >
              <span>📊</span>
              Excel
            </button>
          </div>
        </div>

        {/* Переключатель вида */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setSelectedView('structured')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 ${
              selectedView === 'structured' 
                ? 'bg-white shadow text-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            🏗️ Структурированный
          </button>
          <button
            onClick={() => setSelectedView('flat')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 ${
              selectedView === 'flat' 
                ? 'bg-white shadow text-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📋 Простой список
          </button>
          <button
            onClick={() => setSelectedView('normative')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 ${
              selectedView === 'normative' 
                ? 'bg-white shadow text-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📚 По нормативам
          </button>
        </div>

        {/* Сводная информация */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{works.length}</div>
            <div className="text-sm text-gray-600">Видов работ</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {works.filter(w => w.category === 'mandatory').length}
            </div>
            <div className="text-sm text-gray-600">Обязательных</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {countUniqueNormatives(assignment)}
            </div>
            <div className="text-sm text-gray-600">Нормативов</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {highestPriority}
            </div>
            <div className="text-sm text-gray-600">Приоритет</div>
          </div>
        </div>
      </div>

      {/* Основное содержимое */}
      <div className="content p-6">
        {works.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Нет данных для отображения</h3>
            <p className="text-gray-600">Техническое задание не содержит работ</p>
          </div>
        ) : (
          <>
            {selectedView === 'structured' && (
              <StructuredView 
                works={works}
                expandedCategories={expandedCategories}
                onToggleCategory={toggleCategory}
                showDetails={showDetails}
              />
            )}
            
            {selectedView === 'flat' && (
              <FlatListView works={works} />
            )}
            
            {selectedView === 'normative' && (
              <NormativeView works={works} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// СТРУКТУРИРОВАННЫЙ ВИД
// ============================================================================

interface StructuredViewProps {
  works: WorkItem[];
  expandedCategories: Set<string>;
  onToggleCategory: (category: string) => void;
  showDetails: boolean;
}

const StructuredView: React.FC<StructuredViewProps> = ({
  works,
  expandedCategories,
  onToggleCategory,
  showDetails
}) => {
  const worksByCategory = works.reduce((acc, work) => {
    if (!acc[work.category]) acc[work.category] = [];
    acc[work.category].push(work);
    return acc;
  }, {} as Record<string, WorkItem[]>);

  const categoryConfig = {
    mandatory: {
      name: 'Обязательные работы',
      description: 'Работы, обязательные для выполнения согласно нормативным требованиям',
      icon: '🔴',
      color: 'red'
    },
    recommended: {
      name: 'Рекомендуемые работы',
      description: 'Работы, рекомендуемые для получения дополнительной информации',
      icon: '🟡',
      color: 'yellow'
    },
    optional: {
      name: 'Опциональные работы',
      description: 'Дополнительные работы по согласованию с заказчиком',
      icon: '🟢',
      color: 'green'
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(worksByCategory).map(([category, categoryWorks]) => {
        const config = categoryConfig[category as keyof typeof categoryConfig];
        const isExpanded = expandedCategories.has(category);
        
        if (!config) return null;

        return (
          <div key={category} className="border rounded-lg overflow-hidden">
            {/* Заголовок категории */}
            <div
              className={`p-4 cursor-pointer transition-colors ${
                isExpanded ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
              } border-b`}
              onClick={() => onToggleCategory(category)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{config.icon}</div>
                  <div>
                    <h3 className="font-semibold text-lg">{config.name}</h3>
                    <p className="text-sm text-gray-600">{config.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    {categoryWorks.length} работ
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    {isExpanded ? '▼' : '►'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Работы категории */}
            {isExpanded && (
              <div className="p-4 space-y-3">
                {categoryWorks.map(work => (
                  <WorkItemDisplay key={work.workId} work={work} showDetails={showDetails} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ============================================================================
// ОТОБРАЖЕНИЕ РАБОТЫ
// ============================================================================

interface WorkItemDisplayProps {
  work: WorkItem;
  showDetails: boolean;
}

const WorkItemDisplay: React.FC<WorkItemDisplayProps> = ({ work, showDetails }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="flex items-start gap-3 p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow">
      <div className={`w-3 h-3 rounded-full mt-2 ${
        work.category === 'mandatory' ? 'bg-red-500' :
        work.category === 'recommended' ? 'bg-yellow-500' :
        'bg-green-500'
      }`} />
      
      <div className="flex-1">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2 mb-2">
          <div>
            <h4 className="font-semibold text-gray-900">{work.name}</h4>
            {work.description && showDetails && (
              <p className="text-sm text-gray-600 mt-1">{work.description}</p>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="text-right">
              <div className="font-semibold text-gray-900">{work.quantity} {work.unit}</div>
              <CategoryBadge category={work.category} />
            </div>
          </div>
        </div>

        {/* Дополнительная информация */}
        {showDetails && (
          <div className="mt-3">
            <button
              onClick={() => setShowMore(!showMore)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {showMore ? 'Скрыть детали' : 'Показать детали'}
            </button>
            
            {showMore && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-2">
                {work.normativeBase && (
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">📚</span>
                    <div>
                      <div className="text-sm font-medium">Нормативная база:</div>
                      <div className="text-sm text-gray-700">{work.normativeBase}</div>
                    </div>
                  </div>
                )}
                
                {work.module && (
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">🔧</span>
                    <div>
                      <div className="text-sm font-medium">Модуль:</div>
                      <div className="text-sm text-gray-700 capitalize">{work.module}</div>
                    </div>
                  </div>
                )}
                
                {work.tags && work.tags.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="text-purple-600">🏷️</span>
                    <div>
                      <div className="text-sm font-medium">Теги:</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {work.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-white border rounded text-xs text-gray-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// ПРОСТОЙ ВИД (ТАБЛИЦА)
// ============================================================================

interface FlatListViewProps {
  works: WorkItem[];
}

const FlatListView: React.FC<FlatListViewProps> = ({ works }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="px-4 py-3 text-left font-semibold text-gray-900">№</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-900">Наименование работ</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-900">Объем</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-900">Ед. изм.</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-900">Нормативная база</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-900">Категория</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {works.map((work, index) => (
            <tr key={work.workId} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{work.name}</div>
                {work.description && (
                  <div className="text-sm text-gray-500 mt-1">{work.description}</div>
                )}
              </td>
              <td className="px-4 py-3 font-medium text-gray-900">{work.quantity}</td>
              <td className="px-4 py-3 text-gray-600">{work.unit}</td>
              <td className="px-4 py-3">
                {work.normativeBase ? (
                  <span className="text-sm text-blue-600">{work.normativeBase}</span>
                ) : (
                  <span className="text-sm text-gray-400">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                <CategoryBadge category={work.category} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============================================================================
// ВИД ПО НОРМАТИВАМ
// ============================================================================

interface NormativeViewProps {
  works: WorkItem[];
}

const NormativeView: React.FC<NormativeViewProps> = ({ works }) => {
  const worksWithNormatives = works.filter(w => w.normativeBase);
  
  const normativeGroups = worksWithNormatives.reduce((acc, work) => {
    if (work.normativeBase) {
      const normativeKey = work.normativeBase.split(',')[0].trim();
      if (!acc[normativeKey]) acc[normativeKey] = [];
      acc[normativeKey].push(work);
    }
    return acc;
  }, {} as Record<string, WorkItem[]>);

  return (
    <div className="space-y-6">
      {Object.entries(normativeGroups).map(([normative, normativeWorks]) => (
        <div key={normative} className="border rounded-lg overflow-hidden">
          <div className="bg-blue-50 p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📚</div>
              <div>
                <div className="font-bold text-blue-900">{normative}</div>
                <div className="text-sm text-blue-700">
                  {normativeWorks.length} видов работ
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            {normativeWorks.map(work => (
              <div key={work.workId} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    work.category === 'mandatory' ? 'bg-red-500' :
                    work.category === 'recommended' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`} />
                  <div>
                    <div className="font-medium text-gray-900">{work.name}</div>
                    <div className="text-sm text-gray-500">{work.description}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {work.quantity} {work.unit}
                  </div>
                  <CategoryBadge category={work.category} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {/* Работы без нормативов */}
      {works.filter(w => !w.normativeBase).length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="text-2xl">❓</div>
              <div>
                <div className="font-bold text-gray-900">Работы без указания нормативов</div>
                <div className="text-sm text-gray-700">
                  {works.filter(w => !w.normativeBase).length} видов работ
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            {works.filter(w => !w.normativeBase).map(work => (
              <div key={work.workId} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                <div className="font-medium text-gray-900">{work.name}</div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">{work.quantity} {work.unit}</span>
                  <CategoryBadge category={work.category} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ
// ============================================================================

const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  const colors = {
    'mandatory': 'bg-red-100 text-red-800 border-red-200',
    'recommended': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'optional': 'bg-green-100 text-green-800 border-green-200'
  };

  const labels = {
    'mandatory': 'Обязательно',
    'recommended': 'Рекомендуется',
    'optional': 'Опционально'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[category] || 'bg-gray-100 text-gray-800'}`}>
      {labels[category as keyof typeof labels] || category}
    </span>
  );
};

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================================

function countUniqueNormatives(assignment: TechnicalAssignmentResult): number {
  const normatives = new Set<string>();
  const works = assignment.allWorks || [];
  
  works.forEach(work => {
    if (work.normativeBase) {
      const docs = work.normativeBase.split(',');
      docs.forEach(doc => normatives.add(doc.trim()));
    }
  });
  
  return normatives.size;
}

export default TechnicalAssignmentDisplay;

/**
 * Путь: /components/technical-assignment/WorksFilter.tsx
 * Название: WorksFilter
 * Назначение: Панель фильтрации и поиска работ в составе ТЗ
 * 
 * Особенности:
 * - Поиск по названию работ
 * - Фильтр по категориям (обязательные/рекомендуемые/опциональные)
 * - Фильтр по модулям (буровые/лабораторные/камеральные)
 * - Фильтр по статусу (выбранные/не выбранные)
 * - Быстрые пресеты
 */

'use client';

import { useState } from 'react';
import { Search, Filter, X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorksFilterProps {
  onSearchChange: (search: string) => void;
  onCategoryFilter: (categories: WorkCategory[]) => void;
  onModuleFilter: (modules: string[]) => void;
  onStatusFilter: (status: 'all' | 'selected' | 'unselected') => void;
  totalWorks: number;
  filteredCount: number;
  selectedCount: number;
}

type WorkCategory = 'mandatory' | 'recommended' | 'optional';

export function WorksFilter({
  onSearchChange,
  onCategoryFilter,
  onModuleFilter,
  onStatusFilter,
  totalWorks,
  filteredCount,
  selectedCount,
}: WorksFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<WorkCategory[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'selected' | 'unselected'>('all');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleCategoryToggle = (category: WorkCategory) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    onCategoryFilter(newCategories);
  };

  const handleModuleToggle = (module: string) => {
    const newModules = selectedModules.includes(module)
      ? selectedModules.filter((m) => m !== module)
      : [...selectedModules, module];
    
    setSelectedModules(newModules);
    onModuleFilter(newModules);
  };

  const handleStatusChange = (status: 'all' | 'selected' | 'unselected') => {
    setStatusFilter(status);
    onStatusFilter(status);
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedModules([]);
    setStatusFilter('all');
    onSearchChange('');
    onCategoryFilter([]);
    onModuleFilter([]);
    onStatusFilter('all');
  };

  const hasActiveFilters =
    searchTerm.length > 0 ||
    selectedCategories.length > 0 ||
    selectedModules.length > 0 ||
    statusFilter !== 'all';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden">
      {/* Основная панель */}
      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
        <div className="flex items-center gap-4">
          {/* Поиск */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Поиск работ по названию..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Кнопка фильтров */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
              hasActiveFilters
                ? "bg-amber-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            )}
          >
            <Filter className="w-4 h-4" />
            Фильтры
            {hasActiveFilters && (
              <span className="ml-1 px-1.5 py-0.5 bg-white bg-opacity-30 rounded text-xs font-semibold">
                {[
                  selectedCategories.length,
                  selectedModules.length,
                  statusFilter !== 'all' ? 1 : 0,
                  searchTerm ? 1 : 0,
                ]
                  .filter((n) => n > 0)
                  .reduce((a, b) => a + b, 0)}
              </span>
            )}
          </button>

          {/* Сброс */}
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Сбросить
            </button>
          )}
        </div>

        {/* Статистика */}
        <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
          <span>
            Показано: <strong className="text-gray-900">{filteredCount}</strong> из {totalWorks}
          </span>
          <span>•</span>
          <span>
            Выбрано: <strong className="text-amber-600">{selectedCount}</strong>
          </span>
        </div>
      </div>

      {/* Расширенные фильтры */}
      {isExpanded && (
        <div className="p-4 space-y-6 border-b border-gray-200">
          {/* Быстрые пресеты */}
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-3">
              Быстрый выбор
            </div>
            <div className="flex flex-wrap gap-2">
              <PresetButton
                label="Все обязательные"
                onClick={() => {
                  setSelectedCategories(['mandatory']);
                  onCategoryFilter(['mandatory']);
                }}
                active={
                  selectedCategories.length === 1 &&
                  selectedCategories.includes('mandatory')
                }
              />
              <PresetButton
                label="Полевые работы"
                onClick={() => {
                  setSelectedModules(['буровые', 'горные-выработки', 'полевые-испытания']);
                  onModuleFilter(['буровые', 'горные-выработки', 'полевые-испытания']);
                }}
                active={selectedModules.length === 3}
              />
              <PresetButton
                label="Только выбранные"
                onClick={() => handleStatusChange('selected')}
                active={statusFilter === 'selected'}
              />
            </div>
          </div>

          {/* Фильтр по категориям */}
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-3">
              Категория работ
            </div>
            <div className="flex flex-wrap gap-2">
              <CategoryChip
                icon={<AlertCircle className="w-3 h-3" />}
                label="Обязательные"
                count={0}
                color="red"
                active={selectedCategories.includes('mandatory')}
                onClick={() => handleCategoryToggle('mandatory')}
              />
              <CategoryChip
                icon={<Info className="w-3 h-3" />}
                label="Рекомендуемые"
                count={0}
                color="yellow"
                active={selectedCategories.includes('recommended')}
                onClick={() => handleCategoryToggle('recommended')}
              />
              <CategoryChip
                icon={<CheckCircle className="w-3 h-3" />}
                label="Опциональные"
                count={0}
                color="gray"
                active={selectedCategories.includes('optional')}
                onClick={() => handleCategoryToggle('optional')}
              />
            </div>
          </div>

          {/* Фильтр по модулям */}
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-3">
              Виды работ
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                'буровые',
                'лабораторные',
                'камеральные',
                'топографо-геодезические',
                'горные-выработки',
                'полевые-испытания',
                'гидрогеологические',
                'геофизические',
              ].map((module) => (
                <ModuleChip
                  key={module}
                  label={module}
                  active={selectedModules.includes(module)}
                  onClick={() => handleModuleToggle(module)}
                />
              ))}
            </div>
          </div>

          {/* Статус работ */}
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-3">
              Статус выбора
            </div>
            <div className="flex gap-2">
              <StatusButton
                label="Все"
                active={statusFilter === 'all'}
                onClick={() => handleStatusChange('all')}
              />
              <StatusButton
                label="Выбранные"
                active={statusFilter === 'selected'}
                onClick={() => handleStatusChange('selected')}
              />
              <StatusButton
                label="Не выбранные"
                active={statusFilter === 'unselected'}
                onClick={() => handleStatusChange('unselected')}
              />
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

interface PresetButtonProps {
  label: string;
  onClick: () => void;
  active: boolean;
}

function PresetButton({ label, onClick, active }: PresetButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
        active
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      )}
    >
      {label}
    </button>
  );
}

interface CategoryChipProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  color: 'red' | 'yellow' | 'gray';
  active: boolean;
  onClick: () => void;
}

function CategoryChip({ icon, label, count, color, active, onClick }: CategoryChipProps) {
  const colorClasses = {
    red: active ? 'bg-red-100 border-red-500 text-red-700' : 'bg-red-50 border-red-200 text-red-600',
    yellow: active ? 'bg-yellow-100 border-yellow-500 text-yellow-700' : 'bg-yellow-50 border-yellow-200 text-yellow-600',
    gray: active ? 'bg-gray-200 border-gray-500 text-gray-800' : 'bg-gray-100 border-gray-300 text-gray-600',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all text-sm font-medium",
        colorClasses[color],
        active && "ring-2 ring-offset-2 ring-opacity-50"
      )}
    >
      {icon}
      {label}
      {count > 0 && (
        <span className="ml-1 px-1.5 py-0.5 bg-white bg-opacity-50 rounded text-xs">
          {count}
        </span>
      )}
    </button>
  );
}

interface ModuleChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function ModuleChip({ label, active, onClick }: ModuleChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 text-sm rounded-lg border transition-colors",
        active
          ? "bg-amber-100 border-amber-500 text-amber-800 font-medium"
          : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
      )}
    >
      {label}
    </button>
  );
}

interface StatusButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function StatusButton({ label, active, onClick }: StatusButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
        active
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      )}
    >
      {label}
    </button>
  );
}

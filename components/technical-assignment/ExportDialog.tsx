/**
 * Путь: /components/technical-assignment/ExportDialog.tsx
 * Название: ExportDialog
 * Назначение: Диалог экспорта технического задания с настройками форматирования
 * 
 * Особенности:
 * - Выбор формата (PDF/DOCX/Excel)
 * - Настройки экспорта (размер страницы, ориентация, шрифт)
 * - Предпросмотр перед экспортом
 * - Прогресс экспорта
 */

'use client';

import { useState } from 'react';
import { 
  FileText, Download, Settings, Eye, Check, X, 
  Loader2, AlertCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => Promise<void>;
  projectName: string;
}

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'excel';
  paperSize: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
  includeSignatures: boolean;
  includeNormatives: boolean;
  includeStatistics: boolean;
  fontSize: number;
  margins: 'normal' | 'narrow' | 'wide';
}

export function ExportDialog({
  isOpen,
  onClose,
  onExport,
  projectName,
}: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'docx' | 'excel'>('pdf');
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    paperSize: 'A4',
    orientation: 'portrait',
    includeSignatures: true,
    includeNormatives: true,
    includeStatistics: false,
    fontSize: 12,
    margins: 'normal',
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportError, setExportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportError(null);

    try {
      // Симуляция прогресса
      const progressInterval = setInterval(() => {
        setExportProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await onExport({ ...options, format: selectedFormat });

      clearInterval(progressInterval);
      setExportProgress(100);

      // Закрыть диалог через 1 секунду
      setTimeout(() => {
        onClose();
        setIsExporting(false);
        setExportProgress(0);
      }, 1000);
    } catch (error) {
      setExportError(
        error instanceof Error ? error.message : 'Ошибка при экспорте документа'
      );
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Заголовок */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Download className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Экспорт технического задания
                </h3>
                <p className="text-sm text-gray-500">{projectName}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isExporting}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Контент */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Выбор формата */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-3 block">
              Формат документа
            </label>
            <div className="grid grid-cols-3 gap-3">
              <FormatCard
                icon="📄"
                title="PDF"
                description="Универсальный формат"
                selected={selectedFormat === 'pdf'}
                onClick={() => setSelectedFormat('pdf')}
                disabled={isExporting}
              />
              <FormatCard
                icon="📝"
                title="DOCX"
                description="Microsoft Word"
                selected={selectedFormat === 'docx'}
                onClick={() => setSelectedFormat('docx')}
                disabled={isExporting}
              />
              <FormatCard
                icon="📊"
                title="Excel"
                description="Смета работ"
                selected={selectedFormat === 'excel'}
                onClick={() => setSelectedFormat('excel')}
                disabled={isExporting}
              />
            </div>
          </div>

          {/* Настройки для PDF/DOCX */}
          {(selectedFormat === 'pdf' || selectedFormat === 'docx') && (
            <>
              {/* Размер и ориентация */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Размер страницы
                  </label>
                  <select
                    value={options.paperSize}
                    onChange={(e) =>
                      setOptions({
                        ...options,
                        paperSize: e.target.value as 'A4' | 'Letter',
                      })
                    }
                    disabled={isExporting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="A4">A4 (210 × 297 мм)</option>
                    <option value="Letter">Letter (216 × 279 мм)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Ориентация
                  </label>
                  <select
                    value={options.orientation}
                    onChange={(e) =>
                      setOptions({
                        ...options,
                        orientation: e.target.value as 'portrait' | 'landscape',
                      })
                    }
                    disabled={isExporting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="portrait">Книжная</option>
                    <option value="landscape">Альбомная</option>
                  </select>
                </div>
              </div>

              {/* Размер шрифта и поля */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Размер шрифта
                  </label>
                  <select
                    value={options.fontSize}
                    onChange={(e) =>
                      setOptions({ ...options, fontSize: Number(e.target.value) })
                    }
                    disabled={isExporting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value={10}>10 pt (мелкий)</option>
                    <option value={11}>11 pt</option>
                    <option value={12}>12 pt (стандарт)</option>
                    <option value={14}>14 pt (крупный)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Поля страницы
                  </label>
                  <select
                    value={options.margins}
                    onChange={(e) =>
                      setOptions({
                        ...options,
                        margins: e.target.value as 'normal' | 'narrow' | 'wide',
                      })
                    }
                    disabled={isExporting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="narrow">Узкие (1.5 см)</option>
                    <option value="normal">Обычные (2.5 см)</option>
                    <option value="wide">Широкие (3 см)</option>
                  </select>
                </div>
              </div>

              {/* Дополнительные опции */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 block">
                  Включить в документ
                </label>

                <CheckboxOption
                  label="Поля для подписей"
                  description="Блоки для подписи заказчика и исполнителя"
                  checked={options.includeSignatures}
                  onChange={(checked) =>
                    setOptions({ ...options, includeSignatures: checked })
                  }
                  disabled={isExporting}
                />

                <CheckboxOption
                  label="Нормативные документы"
                  description="Полный список СП РК, ГОСТ и других нормативов"
                  checked={options.includeNormatives}
                  onChange={(checked) =>
                    setOptions({ ...options, includeNormatives: checked })
                  }
                  disabled={isExporting}
                />

                <CheckboxOption
                  label="Статистика работ"
                  description="Диаграммы и таблицы по объёмам работ"
                  checked={options.includeStatistics}
                  onChange={(checked) =>
                    setOptions({ ...options, includeStatistics: checked })
                  }
                  disabled={isExporting}
                />
              </div>
            </>
          )}

          {/* Прогресс экспорта */}
          {isExporting && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="text-sm font-medium text-blue-900">
                  Экспортируем документ...
                </span>
                <span className="text-sm text-blue-700 ml-auto">
                  {exportProgress}%
                </span>
              </div>
              <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Ошибка экспорта */}
          {exportError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-red-900 mb-1">
                    Ошибка экспорта
                  </h4>
                  <p className="text-sm text-red-700">{exportError}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Футер */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {exportProgress === 100 ? (
              <span className="flex items-center gap-2 text-green-600">
                <Check className="w-4 h-4" />
                Экспорт завершён
              </span>
            ) : (
              `Формат: ${selectedFormat.toUpperCase()} • ${options.paperSize} • ${
                options.orientation === 'portrait' ? 'Книжная' : 'Альбомная'
              }`
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isExporting}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Отмена
            </button>
            
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Экспорт...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Экспортировать
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ
// ============================================================================

interface FormatCardProps {
  icon: string;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function FormatCard({
  icon,
  title,
  description,
  selected,
  onClick,
  disabled,
}: FormatCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "p-4 rounded-lg border-2 transition-all text-left disabled:opacity-50",
        selected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300 bg-white"
      )}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-sm font-semibold text-gray-900 mb-1">{title}</div>
      <div className="text-xs text-gray-500">{description}</div>
      {selected && (
        <div className="mt-2 flex items-center gap-1 text-blue-600">
          <Check className="w-4 h-4" />
          <span className="text-xs font-medium">Выбрано</span>
        </div>
      )}
    </button>
  );
}

interface CheckboxOptionProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

function CheckboxOption({
  label,
  description,
  checked,
  onChange,
  disabled,
}: CheckboxOptionProps) {
  return (
    <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      />
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900">{label}</div>
        <div className="text-xs text-gray-500 mt-0.5">{description}</div>
      </div>
    </label>
  );
}

/**
 * Путь: /components/technical-assignment/AssignmentPreview.tsx
 * Название: AssignmentPreview
 * Назначение: Предпросмотр технического задания в формате, близком к финальному документу
 * 
 * Особенности:
 * - Режим печати (print-friendly)
 * - Переключение масштаба
 * - Постраничный просмотр
 * - Подготовка к экспорту в PDF/DOCX
 */

'use client';

import { useState } from 'react';
import { 
  ZoomIn, ZoomOut, Printer, Download, Eye, 
  FileText, ChevronLeft, ChevronRight 
} from 'lucide-react';
import type { TechnicalAssignment } from '@/types/technical-assignment';

interface AssignmentPreviewProps {
  assignment: TechnicalAssignment;
  onExport?: (format: 'pdf' | 'docx') => void;
  onClose?: () => void;
}

export function AssignmentPreview({
  assignment,
  onExport,
  onClose,
}: AssignmentPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 15; // Примерное количество страниц

  const handlePrint = () => {
    window.print();
  };

  const handleZoomIn = () => {
    if (zoom < 150) setZoom(zoom + 10);
  };

  const handleZoomOut = () => {
    if (zoom > 50) setZoom(zoom - 10);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex flex-col">
      {/* Панель инструментов */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Название документа */}
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Техническое задание
              </h3>
              <p className="text-xs text-gray-500">
                {assignment.generalInfo.projectName}
              </p>
            </div>
          </div>
        </div>

        {/* Инструменты */}
        <div className="flex items-center gap-2">
          {/* Масштаб */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="p-2 hover:bg-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ZoomOut className="w-4 h-4 text-gray-700" />
            </button>
            
            <span className="px-3 text-sm font-medium text-gray-700 min-w-[60px] text-center">
              {zoom}%
            </span>
            
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 150}
              className="p-2 hover:bg-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ZoomIn className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* Печать */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Печать</span>
          </button>

          {/* Экспорт */}
          {onExport && (
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Скачать</span>
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button
                  onClick={() => onExport('pdf')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                >
                  📄 PDF документ
                </button>
                <button
                  onClick={() => onExport('docx')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg"
                >
                  📝 Word документ
                </button>
              </div>
            </div>
          )}

          {/* Закрыть */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Область просмотра */}
      <div className="flex-1 overflow-auto bg-gray-100 p-8">
        <div
          className="max-w-4xl mx-auto bg-white shadow-2xl"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        >
          {/* Документ в стиле A4 */}
          <div className="print-content p-16 space-y-8">
            {/* Титульная страница */}
            <div className="text-center space-y-4 pb-12 border-b-2 border-gray-300">
              <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Утверждаю
              </div>
              <div className="h-16" /> {/* Место для подписи */}
              
              <h1 className="text-3xl font-bold text-gray-900 mt-12">
                ТЕХНИЧЕСКОЕ ЗАДАНИЕ
              </h1>
              <h2 className="text-xl text-gray-700">
                на выполнение инженерно-геологических изысканий
              </h2>
              
              <div className="mt-12 text-lg font-medium text-gray-800">
                {assignment.generalInfo.projectName}
              </div>
            </div>

            {/* Разделы документа */}
            <DocumentSection
              number="1"
              title="ОБЩИЕ СВЕДЕНИЯ"
              content={
                <div className="space-y-3 text-sm">
                  <InfoRow
                    label="Наименование объекта"
                    value={assignment.generalInfo.projectName}
                  />
                  <InfoRow
                    label="Вид строительства"
                    value={assignment.generalInfo.constructionType}
                  />
                  <InfoRow
                    label="Стадия проектирования"
                    value={assignment.generalInfo.designStage}
                  />
                  {assignment.generalInfo.workDeadline && (
                    <InfoRow
                      label="Срок выполнения работ"
                      value={new Date(assignment.generalInfo.workDeadline).toLocaleDateString('ru-RU')}
                    />
                  )}
                  {assignment.generalInfo.userNotes && (
                    <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500">
                      <div className="text-xs font-semibold text-blue-900 mb-1">
                        Дополнения заказчика:
                      </div>
                      <div className="text-xs text-blue-800">
                        {assignment.generalInfo.userNotes}
                      </div>
                    </div>
                  )}
                </div>
              }
            />

            <DocumentSection
              number="2"
              title="ХАРАКТЕРИСТИКА ОБЪЕКТА"
              content={
                <div className="space-y-3 text-sm">
                  <InfoRow
                    label="Геотехническая категория"
                    value={assignment.objectCharacteristics.geotechnicalCategory}
                  />
                  <InfoRow
                    label="Уровень ответственности"
                    value={assignment.objectCharacteristics.responsibilityLevel}
                  />
                  <InfoRow
                    label="Категория сложности ИГУ"
                    value={assignment.objectCharacteristics.complexityCategory}
                  />
                  {assignment.objectCharacteristics.constructiveFeatures.length > 0 && (
                    <div>
                      <div className="font-semibold text-gray-700 mb-1">
                        Конструктивные особенности:
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {assignment.objectCharacteristics.constructiveFeatures.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              }
            />

            {/* Добавьте остальные разделы аналогично */}
            
            {/* Подпись */}
            <div className="mt-16 pt-8 border-t-2 border-gray-300 grid grid-cols-2 gap-8">
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-4">
                  Заказчик
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                  <div>{assignment.customer.organization}</div>
                  <div className="h-12 border-b border-gray-400" />
                  <div className="text-xs text-gray-500">(подпись, печать)</div>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-4">
                  Исполнитель
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="h-12 border-b border-gray-400" />
                  <div className="text-xs text-gray-500">(подпись, печать)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Навигация по страницам */}
      <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-center gap-4">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        
        <span className="text-sm text-gray-600">
          Страница {currentPage} из {totalPages}
        </span>
        
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Стили для печати */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content,
          .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ
// ============================================================================

interface DocumentSectionProps {
  number: string;
  title: string;
  content: React.ReactNode;
}

function DocumentSection({ number, title, content }: DocumentSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900">
        {number}. {title}
      </h3>
      <div className="pl-6">{content}</div>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string | number;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex">
      <div className="w-1/3 font-semibold text-gray-700">{label}:</div>
      <div className="w-2/3 text-gray-600">{value}</div>
    </div>
  );
}

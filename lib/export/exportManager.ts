/**
 * Путь: /lib/export/index.ts
 * Название: Export Manager
 * Назначение: Главный модуль для экспорта ТЗ во все форматы
 * 
 * Объединяет:
 * - PDF Generator
 * - DOCX Generator  
 * - Excel Generator
 */

import { generateTechnicalAssignmentPDF, downloadBlob } from './pdfGenerator';
import { generateTechnicalAssignmentDOCX } from './docxGenerator';
import { generateWorksEstimateExcel, generateDetailedWorksReport } from './excelGenerator';
import type { TechnicalAssignment } from '@/types/technical-assignment';
import type { ExportOptions } from '@/components/technical-assignment/ExportDialog';

/**
 * Экспорт технического задания
 */
export async function exportTechnicalAssignment(
  assignment: TechnicalAssignment,
  options: ExportOptions
): Promise<void> {
  try {
    let blob: Blob;
    let filename: string;

    const projectName = sanitizeFilename(assignment.generalInfo.projectName);
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    switch (options.format) {
      case 'pdf':
        blob = await generateTechnicalAssignmentPDF(assignment, options);
        filename = `TZ_${projectName}_${timestamp}.pdf`;
        break;

      case 'docx':
        blob = await generateTechnicalAssignmentDOCX(assignment, options);
        filename = `TZ_${projectName}_${timestamp}.docx`;
        break;

      case 'excel':
        blob = await generateWorksEstimateExcel(assignment);
        filename = `Смета_${projectName}_${timestamp}.xlsx`;
        break;

      default:
        throw new Error(`Неподдерживаемый формат: ${options.format}`);
    }

    // Скачиваем файл
    downloadBlob(blob, filename);
  } catch (error) {
    console.error('Ошибка экспорта:', error);
    throw new Error(
      `Не удалось экспортировать документ: ${
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      }`
    );
  }
}

/**
 * Экспорт детального отчёта по работам (только Excel)
 */
export async function exportDetailedReport(
  assignment: TechnicalAssignment
): Promise<void> {
  try {
    const blob = await generateDetailedWorksReport(assignment);
    const projectName = sanitizeFilename(assignment.generalInfo.projectName);
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `Отчёт_детальный_${projectName}_${timestamp}.xlsx`;

    downloadBlob(blob, filename);
  } catch (error) {
    console.error('Ошибка экспорта детального отчёта:', error);
    throw new Error('Не удалось экспортировать детальный отчёт');
  }
}

/**
 * Пакетный экспорт (все форматы сразу)
 */
export async function exportAllFormats(
  assignment: TechnicalAssignment,
  options: ExportOptions
): Promise<void> {
  const formats: Array<'pdf' | 'docx' | 'excel'> = ['pdf', 'docx', 'excel'];

  for (const format of formats) {
    await exportTechnicalAssignment(assignment, { ...options, format });
    
    // Небольшая задержка между загрузками (чтобы браузер не заблокировал)
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

/**
 * Предпросмотр (генерация URL для просмотра)
 */
export async function generatePreviewUrl(
  assignment: TechnicalAssignment,
  format: 'pdf' | 'docx'
): Promise<string> {
  try {
    let blob: Blob;

    if (format === 'pdf') {
      blob = await generateTechnicalAssignmentPDF(assignment, {
        format: 'pdf',
        paperSize: 'A4',
        orientation: 'portrait',
        includeSignatures: false,
        includeNormatives: true,
        includeStatistics: false,
        fontSize: 12,
        margins: 'normal',
      });
    } else {
      blob = await generateTechnicalAssignmentDOCX(assignment, {
        format: 'docx',
        paperSize: 'A4',
        orientation: 'portrait',
        includeSignatures: false,
        includeNormatives: true,
        includeStatistics: false,
        fontSize: 12,
        margins: 'normal',
      });
    }

    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Ошибка генерации предпросмотра:', error);
    throw error;
  }
}

/**
 * Очистка названия файла от недопустимых символов
 */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Zа-яА-ЯёЁ0-9_\-\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 100); // Ограничение длины
}

/**
 * Получить размер документа (в байтах)
 */
export async function getDocumentSize(
  assignment: TechnicalAssignment,
  format: 'pdf' | 'docx' | 'excel'
): Promise<number> {
  try {
    let blob: Blob;

    switch (format) {
      case 'pdf':
        blob = await generateTechnicalAssignmentPDF(assignment, {
          format: 'pdf',
          paperSize: 'A4',
          orientation: 'portrait',
          includeSignatures: true,
          includeNormatives: true,
          includeStatistics: false,
          fontSize: 12,
          margins: 'normal',
        });
        break;

      case 'docx':
        blob = await generateTechnicalAssignmentDOCX(assignment, {
          format: 'docx',
          paperSize: 'A4',
          orientation: 'portrait',
          includeSignatures: true,
          includeNormatives: true,
          includeStatistics: false,
          fontSize: 12,
          margins: 'normal',
        });
        break;

      case 'excel':
        blob = await generateWorksEstimateExcel(assignment);
        break;

      default:
        throw new Error(`Неподдерживаемый формат: ${format}`);
    }

    return blob.size;
  } catch (error) {
    console.error('Ошибка получения размера документа:', error);
    return 0;
  }
}

/**
 * Форматирование размера файла
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Math.round(bytes / Math.pow(k, i) * 100) / 100} ${sizes[i]}`;
}

// Экспорт всех функций
export {
  generateTechnicalAssignmentPDF,
  generateTechnicalAssignmentDOCX,
  generateWorksEstimateExcel,
  generateDetailedWorksReport,
  downloadBlob,
};

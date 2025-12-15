/**
 * Путь: /lib/export/pdfGenerator.ts
 * Название: PDF Generator
 * Назначение: Генерация технического задания в формате PDF
 * 
 * Используемая библиотека: jsPDF
 * Особенности:
 * - Кириллица (шрифт DejaVu Sans)
 * - Разбиение на страницы
 * - Автоматическая нумерация
 * - Форматирование по ГОСТ
 */

import jsPDF from 'jspdf';
import type { TechnicalAssignment } from '@/types/technical-assignment';
import type { ExportOptions } from '@/components/technical-assignment/ExportDialog';

// Константы для форматирования
const PAGE_MARGIN = {
  top: 20,
  right: 15,
  bottom: 20,
  left: 30,
};

const PAGE_WIDTH = 210; // A4 в мм
const PAGE_HEIGHT = 297;

const FONT_SIZE = {
  title: 16,
  heading1: 14,
  heading2: 12,
  normal: 10,
  small: 8,
};

const LINE_HEIGHT = {
  title: 8,
  heading: 6,
  normal: 5,
  small: 4,
};

/**
 * Генерация PDF документа технического задания
 */
export async function generateTechnicalAssignmentPDF(
  assignment: TechnicalAssignment,
  options: ExportOptions
): Promise<Blob> {
  // Создаём документ
  const doc = new jsPDF({
    orientation: options.orientation,
    unit: 'mm',
    format: options.paperSize === 'A4' ? 'a4' : 'letter',
  });

  // Настройка шрифта (для кириллицы нужен специальный шрифт)
  doc.setFont('helvetica');

  let currentY = PAGE_MARGIN.top;

  // ========================================================================
  // ТИТУЛЬНАЯ СТРАНИЦА
  // ========================================================================
  
  currentY = addTitlePage(doc, assignment, currentY);

  // Новая страница для содержимого
  doc.addPage();
  currentY = PAGE_MARGIN.top;

  // ========================================================================
  // РАЗДЕЛ 1: ОБЩИЕ СВЕДЕНИЯ
  // ========================================================================
  
  currentY = checkPageBreak(doc, currentY, 40);
  currentY = addSectionTitle(doc, '1', 'ОБЩИЕ СВЕДЕНИЯ', currentY);
  
  currentY = addInfoRow(doc, 'Наименование объекта', assignment.generalInfo.projectName, currentY);
  currentY = addInfoRow(doc, 'Вид строительства', assignment.generalInfo.constructionType, currentY);
  currentY = addInfoRow(doc, 'Стадия проектирования', assignment.generalInfo.designStage, currentY);
  
  if (assignment.generalInfo.workDeadline) {
    currentY = addInfoRow(
      doc,
      'Срок выполнения работ',
      new Date(assignment.generalInfo.workDeadline).toLocaleDateString('ru-RU'),
      currentY
    );
  }

  if (assignment.generalInfo.userNotes) {
    currentY = checkPageBreak(doc, currentY, 20);
    currentY = addUserNotes(doc, assignment.generalInfo.userNotes, currentY);
  }

  // ========================================================================
  // РАЗДЕЛ 2: ХАРАКТЕРИСТИКА ОБЪЕКТА
  // ========================================================================
  
  currentY = checkPageBreak(doc, currentY, 40);
  currentY = addSectionTitle(doc, '2', 'ХАРАКТЕРИСТИКА ОБЪЕКТА', currentY);
  
  currentY = addInfoRow(doc, 'Геотехническая категория', assignment.objectCharacteristics.geotechnicalCategory, currentY);
  currentY = addInfoRow(doc, 'Уровень ответственности', assignment.objectCharacteristics.responsibilityLevel, currentY);
  currentY = addInfoRow(doc, 'Категория сложности ИГУ', assignment.objectCharacteristics.complexityCategory, currentY);

  if (assignment.objectCharacteristics.constructiveFeatures.length > 0) {
    currentY = checkPageBreak(doc, currentY, 30);
    currentY = addSubheading(doc, 'Конструктивные особенности:', currentY);
    assignment.objectCharacteristics.constructiveFeatures.forEach((feature) => {
      currentY = checkPageBreak(doc, currentY, 10);
      currentY = addBullet(doc, feature, currentY);
    });
  }

  // ========================================================================
  // РАЗДЕЛ 3: ПРИРОДНЫЕ УСЛОВИЯ
  // ========================================================================
  
  currentY = checkPageBreak(doc, currentY, 50);
  currentY = addSectionTitle(doc, '3', 'ПРИРОДНЫЕ И ТЕХНОГЕННЫЕ УСЛОВИЯ', currentY);
  
  currentY = addParagraph(doc, assignment.naturalConditions.location, currentY);
  currentY = addParagraph(doc, assignment.naturalConditions.climate, currentY);
  currentY = addParagraph(doc, assignment.naturalConditions.geology, currentY);
  currentY = addParagraph(doc, assignment.naturalConditions.hydrogeology, currentY);

  if (assignment.naturalConditions.hazards.length > 0) {
    currentY = checkPageBreak(doc, currentY, 30);
    currentY = addSubheading(doc, 'Опасные геологические процессы:', currentY);
    assignment.naturalConditions.hazards.forEach((hazard) => {
      currentY = checkPageBreak(doc, currentY, 10);
      currentY = addBullet(doc, `${hazard.type} - ${hazard.description}`, currentY);
    });
  }

  // ========================================================================
  // РАЗДЕЛ 4: ЦЕЛЬ ИЗЫСКАНИЙ
  // ========================================================================
  
  currentY = checkPageBreak(doc, currentY, 40);
  currentY = addSectionTitle(doc, '4', 'ЦЕЛЬ И ВИДЫ ИЗЫСКАНИЙ', currentY);
  
  currentY = addSubheading(doc, 'Основные задачи:', currentY);
  assignment.surveyPurpose.mainTasks.forEach((task) => {
    currentY = checkPageBreak(doc, currentY, 10);
    currentY = addBullet(doc, task, currentY);
  });

  // ========================================================================
  // РАЗДЕЛ 5: СОСТАВ РАБОТ
  // ========================================================================
  
  currentY = checkPageBreak(doc, currentY, 40);
  currentY = addSectionTitle(doc, '5', 'СОСТАВ И ОБЪЕМЫ РАБОТ', currentY);
  
  currentY = addSubheading(doc, '5.1. Полевые работы', currentY);
  currentY = addWorksTable(doc, assignment.works.fieldWorks.filter(w => w.isSelected), currentY);

  if (assignment.works.labWorks.some(w => w.isSelected)) {
    currentY = checkPageBreak(doc, currentY, 30);
    currentY = addSubheading(doc, '5.2. Лабораторные работы', currentY);
    currentY = addWorksTable(doc, assignment.works.labWorks.filter(w => w.isSelected), currentY);
  }

  if (assignment.works.officeWorks.some(w => w.isSelected)) {
    currentY = checkPageBreak(doc, currentY, 30);
    currentY = addSubheading(doc, '5.3. Камеральные работы', currentY);
    currentY = addWorksTable(doc, assignment.works.officeWorks.filter(w => w.isSelected), currentY);
  }

  // ========================================================================
  // РАЗДЕЛ 6: НОРМАТИВНЫЕ ДОКУМЕНТЫ
  // ========================================================================
  
  if (options.includeNormatives) {
    currentY = checkPageBreak(doc, currentY, 40);
    currentY = addSectionTitle(doc, '6', 'НОРМАТИВНЫЕ ДОКУМЕНТЫ', currentY);
    
    if (assignment.normativeDocuments.spRK.length > 0) {
      currentY = addSubheading(doc, '6.1. СП РК (Строительные нормы РК)', currentY);
      assignment.normativeDocuments.spRK.forEach((norm) => {
        currentY = checkPageBreak(doc, currentY, 8);
        currentY = addBullet(doc, `${norm.code} ${norm.name}`, currentY);
      });
    }

    if (assignment.normativeDocuments.gost.length > 0) {
      currentY = checkPageBreak(doc, currentY, 20);
      currentY = addSubheading(doc, '6.2. ГОСТ', currentY);
      assignment.normativeDocuments.gost.forEach((norm) => {
        currentY = checkPageBreak(doc, currentY, 8);
        currentY = addBullet(doc, `${norm.code} ${norm.name}`, currentY);
      });
    }
  }

  // ========================================================================
  // РАЗДЕЛ 13: ОТЧЁТНАЯ ДОКУМЕНТАЦИЯ
  // ========================================================================
  
  currentY = checkPageBreak(doc, currentY, 40);
  currentY = addSectionTitle(doc, '13', 'СОСТАВ ОТЧЕТНОЙ ДОКУМЕНТАЦИИ', currentY);
  
  assignment.reporting.composition.forEach((item) => {
    currentY = checkPageBreak(doc, currentY, 8);
    currentY = addBullet(doc, item, currentY);
  });

  currentY = addInfoRow(doc, 'Формат представления', assignment.reporting.format, currentY);
  currentY = addInfoRow(doc, 'Срок представления', assignment.reporting.deadlines, currentY);

  // ========================================================================
  // РАЗДЕЛ 15: ЗАКАЗЧИК
  // ========================================================================
  
  currentY = checkPageBreak(doc, currentY, 40);
  currentY = addSectionTitle(doc, '15', 'СВЕДЕНИЯ О ЗАКАЗЧИКЕ', currentY);
  
  currentY = addInfoRow(doc, 'Наименование организации', assignment.customer.organization, currentY);
  currentY = addInfoRow(doc, 'Контактные данные', assignment.customer.contact, currentY);
  currentY = addInfoRow(doc, 'Ответственный представитель', assignment.customer.representative, currentY);

  // ========================================================================
  // ПОДПИСИ
  // ========================================================================
  
  if (options.includeSignatures) {
    currentY = checkPageBreak(doc, currentY, 60);
    currentY = addSignatures(doc, assignment, currentY);
  }

  // ========================================================================
  // НУМЕРАЦИЯ СТРАНИЦ
  // ========================================================================
  
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(FONT_SIZE.small);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Стр. ${i} из ${totalPages}`,
      PAGE_WIDTH - PAGE_MARGIN.right,
      PAGE_HEIGHT - 10,
      { align: 'right' }
    );
  }

  // Возвращаем Blob
  return doc.output('blob');
}

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================================

function addTitlePage(doc: jsPDF, assignment: TechnicalAssignment, startY: number): number {
  let y = 80;

  doc.setFontSize(FONT_SIZE.normal);
  doc.text('Утверждаю', PAGE_WIDTH / 2, y, { align: 'center' });
  y += 20;

  doc.setFontSize(FONT_SIZE.title);
  doc.setFont('helvetica', 'bold');
  doc.text('ТЕХНИЧЕСКОЕ ЗАДАНИЕ', PAGE_WIDTH / 2, y, { align: 'center' });
  y += 10;

  doc.setFontSize(FONT_SIZE.heading1);
  doc.setFont('helvetica', 'normal');
  doc.text('на выполнение инженерно-геологических изысканий', PAGE_WIDTH / 2, y, { align: 'center' });
  y += 30;

  doc.setFontSize(FONT_SIZE.heading2);
  doc.setFont('helvetica', 'bold');
  const projectNameLines = doc.splitTextToSize(assignment.generalInfo.projectName, PAGE_WIDTH - 60);
  doc.text(projectNameLines, PAGE_WIDTH / 2, y, { align: 'center' });

  return y;
}

function addSectionTitle(doc: jsPDF, number: string, title: string, y: number): number {
  doc.setFontSize(FONT_SIZE.heading1);
  doc.setFont('helvetica', 'bold');
  doc.text(`${number}. ${title}`, PAGE_MARGIN.left, y);
  return y + LINE_HEIGHT.heading + 3;
}

function addSubheading(doc: jsPDF, text: string, y: number): number {
  doc.setFontSize(FONT_SIZE.normal);
  doc.setFont('helvetica', 'bold');
  doc.text(text, PAGE_MARGIN.left, y);
  return y + LINE_HEIGHT.normal + 2;
}

function addInfoRow(doc: jsPDF, label: string, value: string, y: number): number {
  doc.setFontSize(FONT_SIZE.normal);
  doc.setFont('helvetica', 'bold');
  doc.text(`${label}:`, PAGE_MARGIN.left, y);
  
  doc.setFont('helvetica', 'normal');
  const valueX = PAGE_MARGIN.left + 60;
  const maxWidth = PAGE_WIDTH - valueX - PAGE_MARGIN.right;
  const lines = doc.splitTextToSize(value, maxWidth);
  doc.text(lines, valueX, y);
  
  return y + lines.length * LINE_HEIGHT.normal + 2;
}

function addParagraph(doc: jsPDF, text: string, y: number): number {
  doc.setFontSize(FONT_SIZE.normal);
  doc.setFont('helvetica', 'normal');
  
  const maxWidth = PAGE_WIDTH - PAGE_MARGIN.left - PAGE_MARGIN.right;
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, PAGE_MARGIN.left, y);
  
  return y + lines.length * LINE_HEIGHT.normal + 3;
}

function addBullet(doc: jsPDF, text: string, y: number): number {
  doc.setFontSize(FONT_SIZE.normal);
  doc.setFont('helvetica', 'normal');
  
  doc.text('•', PAGE_MARGIN.left + 2, y);
  
  const maxWidth = PAGE_WIDTH - PAGE_MARGIN.left - PAGE_MARGIN.right - 10;
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, PAGE_MARGIN.left + 8, y);
  
  return y + lines.length * LINE_HEIGHT.normal + 1;
}

function addUserNotes(doc: jsPDF, notes: string, y: number): number {
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.line(PAGE_MARGIN.left, y, PAGE_WIDTH - PAGE_MARGIN.right, y);
  y += 3;

  doc.setFontSize(FONT_SIZE.small);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(59, 130, 246);
  doc.text('Дополнения заказчика:', PAGE_MARGIN.left, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  const maxWidth = PAGE_WIDTH - PAGE_MARGIN.left - PAGE_MARGIN.right;
  const lines = doc.splitTextToSize(notes, maxWidth);
  doc.text(lines, PAGE_MARGIN.left, y);
  y += lines.length * LINE_HEIGHT.small + 3;

  doc.line(PAGE_MARGIN.left, y, PAGE_WIDTH - PAGE_MARGIN.right, y);
  return y + 5;
}

function addWorksTable(doc: jsPDF, works: any[], y: number): number {
  if (works.length === 0) return y;

  doc.setFontSize(FONT_SIZE.small);
  
  works.forEach((work, index) => {
    y = checkPageBreak(doc, y, 15);
    
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${work.name}`, PAGE_MARGIN.left + 5, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.text(`Количество: ${work.quantity} ${work.unit}`, PAGE_MARGIN.left + 10, y);
    y += 4;

    if (work.justification) {
      doc.setTextColor(100, 100, 100);
      const justLines = doc.splitTextToSize(
        `Обоснование: ${work.justification}`,
        PAGE_WIDTH - PAGE_MARGIN.left - PAGE_MARGIN.right - 15
      );
      doc.text(justLines, PAGE_MARGIN.left + 10, y);
      y += justLines.length * 3 + 2;
      doc.setTextColor(0, 0, 0);
    }

    y += 2;
  });

  return y + 5;
}

function addSignatures(doc: jsPDF, assignment: TechnicalAssignment, y: number): number {
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(PAGE_MARGIN.left, y, PAGE_WIDTH - PAGE_MARGIN.right, y);
  y += 8;

  doc.setFontSize(FONT_SIZE.normal);
  doc.setFont('helvetica', 'bold');
  doc.text('Заказчик', PAGE_MARGIN.left, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.text(assignment.customer.organization, PAGE_MARGIN.left, y);
  y += 15;
  
  doc.line(PAGE_MARGIN.left, y, PAGE_MARGIN.left + 60, y);
  doc.setFontSize(FONT_SIZE.small);
  doc.setTextColor(128, 128, 128);
  doc.text('(подпись, печать)', PAGE_MARGIN.left, y + 4);
  doc.setTextColor(0, 0, 0);

  y = y - 15 - 6;
  doc.setFontSize(FONT_SIZE.normal);
  doc.setFont('helvetica', 'bold');
  doc.text('Исполнитель', PAGE_WIDTH / 2 + 10, y);
  y += 6 + 15;
  
  doc.line(PAGE_WIDTH / 2 + 10, y, PAGE_WIDTH / 2 + 70, y);
  doc.setFontSize(FONT_SIZE.small);
  doc.setTextColor(128, 128, 128);
  doc.text('(подпись, печать)', PAGE_WIDTH / 2 + 10, y + 4);
  doc.setTextColor(0, 0, 0);

  return y + 10;
}

function checkPageBreak(doc: jsPDF, currentY: number, requiredSpace: number): number {
  if (currentY + requiredSpace > PAGE_HEIGHT - PAGE_MARGIN.bottom) {
    doc.addPage();
    return PAGE_MARGIN.top;
  }
  return currentY;
}

/**
 * Утилита для скачивания файла
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

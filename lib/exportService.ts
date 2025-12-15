/**
 * Путь: /lib/exportService.ts
 * Название: exportService (Модуль экспорта)
 * Назначение: Генерация и скачивание PDF, DOCX и Excel файлов технического задания
 * 
 * Особенности:
 * - exportToPDF() — создаёт PDF через jsPDF
 * - exportToDOCX() — создаёт DOCX через docx
 * - exportToExcel() — создаёт XLSX через xlsx
 * - Автоматическое скачивание файлов
 * - Русский текст (с базовой поддержкой)
 * 
 * Зависимости:
 * npm install jspdf docx xlsx
 */

import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import type { TechnicalAssignment } from '@/types/technical-assignment';

/**
 * Экспорт в PDF
 */
export async function exportToPDF(assignment: TechnicalAssignment): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Добавляем поддержку русского шрифта (базовый вариант)
  let yPosition = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;

  /**
   * Добавить заголовок
   */
  const addHeading = (text: string, level: 1 | 2 = 1) => {
    const fontSize = level === 1 ? 16 : 14;
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, yPosition);
    yPosition += level === 1 ? 10 : 8;
  };

  /**
   * Добавить текст
   */
  const addText = (text: string) => {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    // Разбиваем длинный текст на строки
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, margin, yPosition);
    yPosition += lines.length * 6;
  };

  /**
   * Добавить новую страницу если нужно
   */
  const checkPageBreak = () => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
  };

  // ТИТУЛЬНАЯ СТРАНИЦА
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('TECHNICAL ASSIGNMENT', pageWidth / 2, 40, { align: 'center' });
  doc.text('(Tekhnicheskoe Zadanie)', pageWidth / 2, 50, { align: 'center' });
  
  yPosition = 70;
  doc.setFontSize(14);
  doc.text(assignment.generalInfo.projectName || 'Project Name', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition = 100;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Customer: ${assignment.customer?.name || 'Not specified'}`, margin, yPosition);
  yPosition += 10;
  doc.text(`Location: ${assignment.generalInfo.location || 'Not specified'}`, margin, yPosition);
  yPosition += 10;
  doc.text(`Date: ${new Date().toLocaleDateString('ru-RU')}`, margin, yPosition);

  // Новая страница для содержимого
  doc.addPage();
  yPosition = 20;

  // 1. ОБЩИЕ СВЕДЕНИЯ
  addHeading('1. GENERAL INFORMATION');
  checkPageBreak();
  
  if (assignment.generalInfo) {
    addText(`Project Name: ${assignment.generalInfo.projectName || 'N/A'}`);
    checkPageBreak();
    addText(`Customer: ${assignment.generalInfo.customerName || 'N/A'}`);
    checkPageBreak();
    addText(`Location: ${assignment.generalInfo.location || 'N/A'}`);
    checkPageBreak();
    addText(`Deadline: ${assignment.generalInfo.workDeadline || 'N/A'}`);
    checkPageBreak();
  }
  yPosition += 5;

  // 2. ХАРАКТЕРИСТИКА ОБЪЕКТА
  addHeading('2. OBJECT CHARACTERISTICS');
  checkPageBreak();
  
  if (assignment.objectCharacteristics) {
    addText(`Object Type: ${assignment.objectCharacteristics.objectType || 'N/A'}`);
    checkPageBreak();
    addText(`Building Type: ${assignment.objectCharacteristics.buildingType || 'N/A'}`);
    checkPageBreak();
    addText(`Floors: ${assignment.objectCharacteristics.floors || 'N/A'}`);
    checkPageBreak();
  }
  yPosition += 5;

  // 3. СОСТАВ РАБОТ
  addHeading('3. SCOPE OF WORKS');
  checkPageBreak();

  if (assignment.fieldWorks && assignment.fieldWorks.length > 0) {
    addHeading('3.1. Field Works', 2);
    checkPageBreak();
    
    assignment.fieldWorks.forEach((work, idx) => {
      addText(`${idx + 1}. ${work.name} - ${work.quantity} ${work.unit}`);
      checkPageBreak();
    });
    yPosition += 3;
  }

  if (assignment.labWorks && assignment.labWorks.length > 0) {
    addHeading('3.2. Laboratory Tests', 2);
    checkPageBreak();
    
    assignment.labWorks.forEach((work, idx) => {
      addText(`${idx + 1}. ${work.name} - ${work.quantity} ${work.unit}`);
      checkPageBreak();
    });
    yPosition += 3;
  }

  // СОХРАНЕНИЕ
  const fileName = `TZ_${assignment.generalInfo.projectName?.replace(/\s+/g, '_') || 'Document'}_${Date.now()}.pdf`;
  doc.save(fileName);
  
  console.log('✅ PDF экспортирован:', fileName);
}

/**
 * Экспорт в DOCX
 */
export async function exportToDOCX(assignment: TechnicalAssignment): Promise<void> {
  const sections = [];

  // ТИТУЛЬНАЯ СТРАНИЦА
  sections.push(
    new Paragraph({
      text: 'ТЕХНИЧЕСКОЕ ЗАДАНИЕ',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: 'на инженерно-геологические изыскания',
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: assignment.generalInfo.projectName || 'Название проекта',
          bold: true,
          size: 28,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 800 },
    }),
  );

  // 1. ОБЩИЕ СВЕДЕНИЯ
  sections.push(
    new Paragraph({
      text: '1. ОБЩИЕ СВЕДЕНИЯ',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    }),
  );

  if (assignment.generalInfo) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Название проекта: ', bold: true }),
          new TextRun({ text: assignment.generalInfo.projectName || 'Не указано' }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Заказчик: ', bold: true }),
          new TextRun({ text: assignment.generalInfo.customerName || 'Не указан' }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Местоположение: ', bold: true }),
          new TextRun({ text: assignment.generalInfo.location || 'Не указано' }),
        ],
        spacing: { after: 100 },
      }),
    );
  }

  // 2. ХАРАКТЕРИСТИКА ОБЪЕКТА
  sections.push(
    new Paragraph({
      text: '2. ХАРАКТЕРИСТИКА ОБЪЕКТА СТРОИТЕЛЬСТВА',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    }),
  );

  if (assignment.objectCharacteristics) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Тип объекта: ', bold: true }),
          new TextRun({ text: assignment.objectCharacteristics.objectType || 'Не указан' }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Тип здания: ', bold: true }),
          new TextRun({ text: assignment.objectCharacteristics.buildingType || 'Не указан' }),
        ],
        spacing: { after: 100 },
      }),
    );
  }

  // 5. СОСТАВ РАБОТ
  sections.push(
    new Paragraph({
      text: '5. СОСТАВ И ОБЪЁМЫ РАБОТ',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    }),
  );

  if (assignment.fieldWorks && assignment.fieldWorks.length > 0) {
    sections.push(
      new Paragraph({
        text: '5.1. Полевые работы',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),
    );

    assignment.fieldWorks.forEach((work, idx) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${idx + 1}. `, bold: true }),
            new TextRun({ text: `${work.name} — ` }),
            new TextRun({ text: `${work.quantity} ${work.unit}`, bold: true }),
          ],
          spacing: { after: 80 },
        }),
      );
    });
  }

  if (assignment.labWorks && assignment.labWorks.length > 0) {
    sections.push(
      new Paragraph({
        text: '5.2. Лабораторные испытания',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),
    );

    assignment.labWorks.forEach((work, idx) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${idx + 1}. `, bold: true }),
            new TextRun({ text: `${work.name} — ` }),
            new TextRun({ text: `${work.quantity} ${work.unit}`, bold: true }),
          ],
          spacing: { after: 80 },
        }),
      );
    });
  }

  // СОЗДАНИЕ ДОКУМЕНТА
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: sections,
      },
    ],
  });

  // СОХРАНЕНИЕ
  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `TZ_${assignment.generalInfo.projectName?.replace(/\s+/g, '_') || 'Document'}_${Date.now()}.docx`;
  link.click();
  window.URL.revokeObjectURL(url);
  
  console.log('✅ DOCX экспортирован');
}

/**
 * Экспорт в Excel
 */
export async function exportToExcel(assignment: TechnicalAssignment): Promise<void> {
  // Упрощённый вариант - экспорт таблицы работ
  const XLSX = await import('xlsx');
  
  const data: any[] = [];
  
  // Заголовок
  data.push(['ТЕХНИЧЕСКОЕ ЗАДАНИЕ']);
  data.push([assignment.generalInfo.projectName || 'Проект']);
  data.push([]);
  
  // Полевые работы
  if (assignment.fieldWorks && assignment.fieldWorks.length > 0) {
    data.push(['ПОЛЕВЫЕ РАБОТЫ']);
    data.push(['№', 'Наименование', 'Количество', 'Единица']);
    
    assignment.fieldWorks.forEach((work, idx) => {
      data.push([idx + 1, work.name, work.quantity, work.unit]);
    });
    data.push([]);
  }
  
  // Лабораторные работы
  if (assignment.labWorks && assignment.labWorks.length > 0) {
    data.push(['ЛАБОРАТОРНЫЕ ИСПЫТАНИЯ']);
    data.push(['№', 'Наименование', 'Количество', 'Единица']);
    
    assignment.labWorks.forEach((work, idx) => {
      data.push([idx + 1, work.name, work.quantity, work.unit]);
    });
  }
  
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Техническое задание');
  
  const fileName = `TZ_${assignment.generalInfo.projectName?.replace(/\s+/g, '_') || 'Document'}_${Date.now()}.xlsx`;
  XLSX.writeFile(wb, fileName);
  
  console.log('✅ Excel экспортирован:', fileName);
}

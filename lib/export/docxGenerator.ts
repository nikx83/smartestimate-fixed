/**
 * Путь: /lib/export/docxGenerator.ts
 * Название: DOCX Generator
 * Назначение: Генерация технического задания в формате Microsoft Word (DOCX)
 * 
 * Используемая библиотека: docx
 * Особенности:
 * - Стили по ГОСТ
 * - Нумерованные заголовки
 * - Таблицы работ
 * - Поля для подписей
 */

import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from 'docx';
import type { TechnicalAssignment } from '@/types/technical-assignment';
import type { ExportOptions } from '@/components/technical-assignment/ExportDialog';

/**
 * Генерация DOCX документа технического задания
 */
export async function generateTechnicalAssignmentDOCX(
  assignment: TechnicalAssignment,
  options: ExportOptions
): Promise<Blob> {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: options.margins === 'narrow' ? 900 : options.margins === 'wide' ? 1440 : 1134,
              right: options.margins === 'narrow' ? 900 : options.margins === 'wide' ? 1440 : 1134,
              bottom: options.margins === 'narrow' ? 900 : options.margins === 'wide' ? 1440 : 1134,
              left: options.margins === 'narrow' ? 900 : options.margins === 'wide' ? 1440 : 1134,
            },
          },
        },
        children: [
          // ================================================================
          // ТИТУЛЬНАЯ СТРАНИЦА
          // ================================================================
          
          ...createTitlePage(assignment),

          // Разрыв страницы
          new Paragraph({ text: '', pageBreakBefore: true }),

          // ================================================================
          // РАЗДЕЛ 1: ОБЩИЕ СВЕДЕНИЯ
          // ================================================================
          
          createSectionHeading('1', 'ОБЩИЕ СВЕДЕНИЯ'),
          
          createInfoParagraph('Наименование объекта', assignment.generalInfo.projectName),
          createInfoParagraph('Вид строительства', assignment.generalInfo.constructionType),
          createInfoParagraph('Стадия проектирования', assignment.generalInfo.designStage),
          
          ...(assignment.generalInfo.workDeadline ? [
            createInfoParagraph(
              'Срок выполнения работ',
              new Date(assignment.generalInfo.workDeadline).toLocaleDateString('ru-RU')
            ),
          ] : []),

          ...(assignment.generalInfo.userNotes ? [
            createUserNotes(assignment.generalInfo.userNotes),
          ] : []),

          // ================================================================
          // РАЗДЕЛ 2: ХАРАКТЕРИСТИКА ОБЪЕКТА
          // ================================================================
          
          createSectionHeading('2', 'ХАРАКТЕРИСТИКА ОБЪЕКТА'),
          
          createInfoParagraph('Геотехническая категория', assignment.objectCharacteristics.geotechnicalCategory),
          createInfoParagraph('Уровень ответственности', assignment.objectCharacteristics.responsibilityLevel),
          createInfoParagraph('Категория сложности ИГУ', assignment.objectCharacteristics.complexityCategory),

          ...(assignment.objectCharacteristics.constructiveFeatures.length > 0 ? [
            createSubheading('Конструктивные особенности:'),
            ...assignment.objectCharacteristics.constructiveFeatures.map(feature => createBullet(feature)),
          ] : []),

          // ================================================================
          // РАЗДЕЛ 3: ПРИРОДНЫЕ УСЛОВИЯ
          // ================================================================
          
          createSectionHeading('3', 'ПРИРОДНЫЕ И ТЕХНОГЕННЫЕ УСЛОВИЯ'),
          
          createParagraph(assignment.naturalConditions.location),
          createParagraph(assignment.naturalConditions.climate),
          createParagraph(assignment.naturalConditions.geology),
          createParagraph(assignment.naturalConditions.hydrogeology),

          ...(assignment.naturalConditions.hazards.length > 0 ? [
            createSubheading('Опасные геологические процессы:'),
            ...assignment.naturalConditions.hazards.map(hazard => 
              createBullet(`${hazard.type} - ${hazard.description}`)
            ),
          ] : []),

          // ================================================================
          // РАЗДЕЛ 4: ЦЕЛЬ ИЗЫСКАНИЙ
          // ================================================================
          
          createSectionHeading('4', 'ЦЕЛЬ И ВИДЫ ИЗЫСКАНИЙ'),
          
          createSubheading('Основные задачи:'),
          ...assignment.surveyPurpose.mainTasks.map(task => createBullet(task)),

          // ================================================================
          // РАЗДЕЛ 5: СОСТАВ РАБОТ
          // ================================================================
          
          createSectionHeading('5', 'СОСТАВ И ОБЪЕМЫ РАБОТ'),
          
          createSubheading('5.1. Полевые работы'),
          ...createWorksTable(assignment.works.fieldWorks.filter(w => w.isSelected)),

          ...(assignment.works.labWorks.some(w => w.isSelected) ? [
            createSubheading('5.2. Лабораторные работы'),
            ...createWorksTable(assignment.works.labWorks.filter(w => w.isSelected)),
          ] : []),

          ...(assignment.works.officeWorks.some(w => w.isSelected) ? [
            createSubheading('5.3. Камеральные работы'),
            ...createWorksTable(assignment.works.officeWorks.filter(w => w.isSelected)),
          ] : []),

          // ================================================================
          // РАЗДЕЛ 6: НОРМАТИВНЫЕ ДОКУМЕНТЫ
          // ================================================================
          
          ...(options.includeNormatives ? [
            createSectionHeading('6', 'НОРМАТИВНЫЕ ДОКУМЕНТЫ'),
            
            ...(assignment.normativeDocuments.spRK.length > 0 ? [
              createSubheading('6.1. СП РК (Строительные нормы РК)'),
              ...assignment.normativeDocuments.spRK.map(norm => 
                createBullet(`${norm.code} ${norm.name}`)
              ),
            ] : []),

            ...(assignment.normativeDocuments.gost.length > 0 ? [
              createSubheading('6.2. ГОСТ'),
              ...assignment.normativeDocuments.gost.map(norm => 
                createBullet(`${norm.code} ${norm.name}`)
              ),
            ] : []),
          ] : []),

          // ================================================================
          // РАЗДЕЛ 13: ОТЧЁТНАЯ ДОКУМЕНТАЦИЯ
          // ================================================================
          
          createSectionHeading('13', 'СОСТАВ ОТЧЕТНОЙ ДОКУМЕНТАЦИИ'),
          
          ...assignment.reporting.composition.map(item => createBullet(item)),
          
          createInfoParagraph('Формат представления', assignment.reporting.format),
          createInfoParagraph('Срок представления', assignment.reporting.deadlines),

          // ================================================================
          // РАЗДЕЛ 15: ЗАКАЗЧИК
          // ================================================================
          
          createSectionHeading('15', 'СВЕДЕНИЯ О ЗАКАЗЧИКЕ'),
          
          createInfoParagraph('Наименование организации', assignment.customer.organization),
          createInfoParagraph('Контактные данные', assignment.customer.contact),
          createInfoParagraph('Ответственный представитель', assignment.customer.representative),

          // ================================================================
          // ПОДПИСИ
          // ================================================================
          
          ...(options.includeSignatures ? createSignatureSection(assignment) : []),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================================

function createTitlePage(assignment: TechnicalAssignment): Paragraph[] {
  return [
    new Paragraph({
      text: 'Утверждаю',
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),

    new Paragraph({
      text: '_____________________',
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: 'ТЕХНИЧЕСКОЕ ЗАДАНИЕ',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { before: 800, after: 200 },
    }),

    new Paragraph({
      text: 'на выполнение инженерно-геологических изысканий',
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }),

    new Paragraph({
      text: assignment.generalInfo.projectName,
      alignment: AlignmentType.CENTER,
      bold: true,
      spacing: { after: 400 },
    }),
  ];
}

function createSectionHeading(number: string, title: string): Paragraph {
  return new Paragraph({
    text: `${number}. ${title}`,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
  });
}

function createSubheading(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 100 },
  });
}

function createInfoParagraph(label: string, value: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true }),
      new TextRun({ text: value }),
    ],
    spacing: { after: 100 },
  });
}

function createParagraph(text: string): Paragraph {
  return new Paragraph({
    text,
    spacing: { after: 150 },
  });
}

function createBullet(text: string): Paragraph {
  return new Paragraph({
    text,
    bullet: { level: 0 },
    spacing: { after: 80 },
  });
}

function createUserNotes(notes: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: 'Дополнения заказчика: ', bold: true, color: '3B82F6' }),
      new TextRun({ text: notes, italics: true }),
    ],
    border: {
      top: { style: BorderStyle.SINGLE, size: 1, color: '3B82F6' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: '3B82F6' },
    },
    spacing: { before: 200, after: 200 },
  });
}

function createWorksTable(works: any[]): Paragraph[] {
  if (works.length === 0) return [];

  return works.map((work, index) => 
    new Paragraph({
      children: [
        new TextRun({ text: `${index + 1}. ${work.name}`, bold: true }),
        new TextRun({ text: '\n' }),
        new TextRun({ text: `Количество: ${work.quantity} ${work.unit}` }),
        ...(work.justification ? [
          new TextRun({ text: '\n' }),
          new TextRun({ text: `Обоснование: ${work.justification}`, italics: true, size: 20 }),
        ] : []),
      ],
      spacing: { after: 150 },
    })
  );
}

function createSignatureSection(assignment: TechnicalAssignment): Paragraph[] {
  return [
    new Paragraph({
      text: '',
      border: {
        top: { style: BorderStyle.SINGLE, size: 2 },
      },
      spacing: { before: 600, after: 200 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: 'Заказчик', bold: true }),
      ],
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: assignment.customer.organization,
      spacing: { after: 300 },
    }),

    new Paragraph({
      text: '_____________________ / _______________ /',
      spacing: { after: 50 },
    }),

    new Paragraph({
      text: '(подпись)                    (Ф.И.О.)',
      italics: true,
      size: 20,
      spacing: { after: 400 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: 'Исполнитель', bold: true }),
      ],
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: '_____________________ / _______________ /',
      spacing: { after: 50 },
    }),

    new Paragraph({
      text: '(подпись)                    (Ф.И.О.)',
      italics: true,
      size: 20,
    }),
  ];
}

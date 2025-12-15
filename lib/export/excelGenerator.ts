/**
 * Путь: /lib/export/excelGenerator.ts
 * Название: Excel Generator
 * Назначение: Генерация сметы работ в формате Microsoft Excel (XLSX)
 * 
 * Используемая библиотека: xlsx (SheetJS)
 * Особенности:
 * - Смета работ с расчётами
 * - Формулы Excel
 * - Форматирование ячеек
 * - Итоговые суммы
 */

import * as XLSX from 'xlsx';
import type { TechnicalAssignment } from '@/types/technical-assignment';

/**
 * Генерация Excel документа со сметой работ
 */
export async function generateWorksEstimateExcel(
  assignment: TechnicalAssignment
): Promise<Blob> {
  // Собираем все выбранные работы
  const allWorks = [
    ...assignment.works.fieldWorks.filter(w => w.isSelected).map(w => ({ ...w, category: 'Полевые' })),
    ...assignment.works.labWorks.filter(w => w.isSelected).map(w => ({ ...w, category: 'Лабораторные' })),
    ...assignment.works.officeWorks.filter(w => w.isSelected).map(w => ({ ...w, category: 'Камеральные' })),
  ];

  // Создаём данные для листа
  const data: any[][] = [
    // Заголовок документа
    ['СМЕТА РАБОТ'],
    [assignment.generalInfo.projectName],
    [''],
    
    // Шапка таблицы
    [
      '№',
      'Категория',
      'Наименование работ',
      'Единица измерения',
      'Количество',
      'Цена за единицу, ₸',
      'Стоимость, ₸',
      'Обоснование',
    ],
  ];

  // Добавляем работы
  let rowIndex = 5; // Начинаем с 5-й строки (после заголовков)
  allWorks.forEach((work, index) => {
    data.push([
      index + 1,
      work.category,
      work.name,
      work.unit,
      work.quantity,
      work.unitPrice || 0,
      { f: `E${rowIndex}*F${rowIndex}` }, // Формула: количество * цена
      work.justification || '',
    ]);
    rowIndex++;
  });

  // Итоговая строка
  data.push([
    '',
    '',
    '',
    '',
    '',
    'ИТОГО:',
    { f: `SUM(G5:G${rowIndex - 1})` }, // Сумма всех стоимостей
    '',
  ]);

  // Создаём worksheet
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Настройка ширины колонок
  ws['!cols'] = [
    { wch: 5 },  // №
    { wch: 15 }, // Категория
    { wch: 50 }, // Наименование
    { wch: 15 }, // Единица
    { wch: 12 }, // Количество
    { wch: 18 }, // Цена
    { wch: 18 }, // Стоимость
    { wch: 40 }, // Обоснование
  ];

  // Форматирование ячеек
  
  // Заголовок (A1) - жирный, крупный
  if (ws['A1']) {
    ws['A1'].s = {
      font: { bold: true, sz: 16 },
      alignment: { horizontal: 'center' },
    };
  }

  // Название проекта (A2) - жирный
  if (ws['A2']) {
    ws['A2'].s = {
      font: { bold: true, sz: 12 },
      alignment: { horizontal: 'center' },
    };
  }

  // Шапка таблицы (A4:H4) - жирный, серый фон
  for (let col = 0; col < 8; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 3, c: col });
    if (ws[cellAddress]) {
      ws[cellAddress].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: 'D3D3D3' } },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
        border: {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        },
      };
    }
  }

  // Данные работ - границы и выравнивание
  for (let row = 4; row < rowIndex; row++) {
    for (let col = 0; col < 8; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      if (ws[cellAddress]) {
        ws[cellAddress].s = {
          alignment: { 
            horizontal: col === 2 || col === 7 ? 'left' : 'center', // Название и обоснование - слева
            vertical: 'center',
            wrapText: true,
          },
          border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
          },
        };

        // Форматирование чисел (цена и стоимость)
        if (col === 5 || col === 6) {
          ws[cellAddress].z = '#,##0.00 ₸';
        }
      }
    }
  }

  // Итоговая строка - жирный, жёлтый фон
  for (let col = 0; col < 8; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: col });
    if (ws[cellAddress]) {
      ws[cellAddress].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: 'FFFF00' } },
        alignment: { horizontal: col === 6 ? 'right' : 'center', vertical: 'center' },
        border: {
          top: { style: 'double' },
          bottom: { style: 'double' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        },
      };

      if (col === 6) {
        ws[cellAddress].z = '#,##0.00 ₸';
      }
    }
  }

  // Объединение ячеек для заголовка
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, // A1:H1
    { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } }, // A2:H2
  ];

  // Создаём workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Смета работ');

  // Добавляем второй лист со статистикой
  const statsWs = createStatisticsSheet(assignment);
  XLSX.utils.book_append_sheet(wb, statsWs, 'Статистика');

  // Конвертируем в Blob
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

/**
 * Создать лист со статистикой
 */
function createStatisticsSheet(assignment: TechnicalAssignment): XLSX.WorkSheet {
  const stats = assignment.statistics;

  const data: any[][] = [
    ['СТАТИСТИКА ПРОЕКТА'],
    [''],
    ['Общие сведения'],
    ['Название проекта', assignment.generalInfo.projectName],
    ['Дата создания', new Date(assignment.metadata.generatedAt).toLocaleDateString('ru-RU')],
    [''],
    ['Работы'],
    ['Всего работ', stats.totalWorks],
    ['Выбрано работ', stats.selectedWorks],
    ['Обязательных', stats.mandatoryWorks],
    ['Рекомендуемых', stats.recommendedWorks],
    ['Опциональных', stats.optionalWorks],
    [''],
    ['Объёмы'],
    ['Бурение, п.м.', stats.totalVolume.drilling],
    ['Отбор проб, шт', stats.totalVolume.samples],
    ['Лабораторные испытания, опр.', stats.totalVolume.tests],
    [''],
    ['Стоимость'],
    ['Общая стоимость, ₸', { f: `'Смета работ'!G${assignment.works.fieldWorks.length + assignment.works.labWorks.length + assignment.works.officeWorks.length + 5}` }],
    [''],
    ['Нормативы'],
    ['СП РК', assignment.normativeDocuments.spRK.length],
    ['ГОСТ', assignment.normativeDocuments.gost.length],
    ['Прочие', assignment.normativeDocuments.other.length],
    ['Всего уникальных', stats.normativeReferences],
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);

  // Ширина колонок
  ws['!cols'] = [
    { wch: 40 },
    { wch: 60 },
  ];

  // Форматирование
  if (ws['A1']) {
    ws['A1'].s = {
      font: { bold: true, sz: 14 },
      alignment: { horizontal: 'center' },
    };
  }

  // Заголовки разделов (A3, A7, A14, A19, A22)
  [2, 6, 13, 18, 21].forEach(row => {
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 });
    if (ws[cellAddress]) {
      ws[cellAddress].s = {
        font: { bold: true, sz: 12 },
        fill: { fgColor: { rgb: 'E0E0E0' } },
      };
    }
  });

  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
  ];

  return ws;
}

/**
 * Генерация детального отчёта по работам (с нормативными ссылками)
 */
export async function generateDetailedWorksReport(
  assignment: TechnicalAssignment
): Promise<Blob> {
  const allWorks = [
    ...assignment.works.fieldWorks.filter(w => w.isSelected),
    ...assignment.works.labWorks.filter(w => w.isSelected),
    ...assignment.works.officeWorks.filter(w => w.isSelected),
  ];

  const data: any[][] = [
    ['ДЕТАЛЬНЫЙ ОТЧЁТ ПО РАБОТАМ'],
    [assignment.generalInfo.projectName],
    [''],
    ['№', 'Название', 'Категория', 'Количество', 'Обоснование', 'Нормативные ссылки'],
  ];

  allWorks.forEach((work, index) => {
    const normRefs = work.normativeQuotes
      ?.map(q => `${q.source} (${q.clause})`)
      .join('; ') || '';

    data.push([
      index + 1,
      work.name,
      work.category,
      `${work.quantity} ${work.unit}`,
      work.justification || '',
      normRefs,
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(data);

  ws['!cols'] = [
    { wch: 5 },
    { wch: 50 },
    { wch: 15 },
    { wch: 15 },
    { wch: 60 },
    { wch: 80 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Детальный отчёт');

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

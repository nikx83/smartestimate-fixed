/**
 * Файл: section48-report-preparation.ts
 * Назначение: Составление технического отчёта
 */

import type { InstructionBlock } from './types';

export const block_48_01_report: InstructionBlock = {
  id: 'block-48-01-report',
  section: 'Раздел 48: Технический отчёт',
  title: 'Составление технического отчёта по результатам ИГИ',
  description: 'Подготовка отчётной документации',
  priority: 91,
  tags: ['отчёт', 'документация', 'оформление'],
  
  condition: () => true,
  
  variants: [{
    id: 'variant-report',
    priority: 'ОБЯЗАТЕЛЬНЫЙ',
    normative: {
      document: 'СП РК 1.02-102-2014',
      section: 'Состав отчёта',
      priority: 'ОБЯЗАТЕЛЬНЫЙ'
    },
    recommendation:
      '**ТЕХНИЧЕСКИЙ ОТЧЁТ:**\n\n' +
      '**Состав отчёта:**\n' +
      '1. Введение\n' +
      '2. Физико-географические и геологические условия\n' +
      '3. Грунтовые условия\n' +
      '4. Гидрогеологические условия\n' +
      '5. Геологические процессы\n' +
      '6. Расчётные характеристики грунтов\n' +
      '7. Рекомендации по проектированию\n' +
      '8. Приложения (колонки, разрезы, графики)\n\n' +
      'Входит в стоимость изысканий.'
  }],
  
  calculateValues: () => ({}),
  generateWorks: () => []
};

export const section48_blocks: InstructionBlock[] = [block_48_01_report];
export default section48_blocks;

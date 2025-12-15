/**
 * Файл: section50-archiving.ts
 * Назначение: Архивирование материалов
 */

import type { InstructionBlock } from './types';

export const block_50_01_archive: InstructionBlock = {
  id: 'block-50-01-archive',
  section: 'Раздел 50: Архивирование',
  title: 'Передача материалов в архив и фонды',
  description: 'Архивное хранение материалов изысканий',
  priority: 93,
  tags: ['архив', 'хранение', 'передача'],
  
  condition: () => true,
  
  variants: [{
    id: 'variant-archive',
    priority: 'ОБЯЗАТЕЛЬНЫЙ',
    normative: {
      document: 'Правила РК №509',
      section: 'Архивирование',
      priority: 'ОБЯЗАТЕЛЬНЫЙ'
    },
    recommendation:
      '**АРХИВИРОВАНИЕ:**\n\n' +
      '**1. Передача в территориальный фонд**\n' +
      '**2. Электронный архив**\n' +
      '**3. Хранение образцов грунтов (6 месяцев)**\n' +
      '**4. Передача заказчику (2 экземпляра)**\n\n' +
      'Срок хранения: 75 лет.'
  }],
  
  calculateValues: () => ({}),
  generateWorks: () => []
};

export const section50_blocks: InstructionBlock[] = [block_50_01_archive];
export default section50_blocks;

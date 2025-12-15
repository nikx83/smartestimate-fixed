/**
 * Файл: section51-safety.ts
 * Назначение: Техника безопасности и охрана труда
 */

import type { InstructionBlock } from './types';

export const block_51_01_safety: InstructionBlock = {
  id: 'block-51-01-safety',
  section: 'Раздел 51: Техника безопасности',
  title: 'Охрана труда при выполнении инженерно-геологических изысканий',
  description: 'Требования безопасности при полевых и лабораторных работах',
  priority: 94,
  tags: ['безопасность', 'охрана-труда'],
  
  condition: () => true,
  
  variants: [{
    id: 'variant-safety',
    priority: 'ОБЯЗАТЕЛЬНЫЙ',
    normative: {
      document: 'СНиП 12-03-2001',
      section: 'Безопасность труда в строительстве',
      priority: 'ОБЯЗАТЕЛЬНЫЙ'
    },
    recommendation:
      '**ТЕХНИКА БЕЗОПАСНОСТИ:**\n\n' +
      '**1. При бурении:**\n' +
      '- Ограждение скважин\n' +
      '- Безопасное расстояние\n' +
      '- Средства защиты\n\n' +
      '**2. При горных работах:**\n' +
      '- Крепление выработок\n' +
      '- Вентиляция\n' +
      '- Контроль газов\n\n' +
      '**3. При лабораторных работах:**\n' +
      '- Вытяжка\n' +
      '- Защитная одежда\n' +
      '- Утилизация реактивов\n\n' +
      'Обязательный инструктаж перед работами.'
  }],
  
  calculateValues: () => ({}),
  generateWorks: () => []
};

export const section51_blocks: InstructionBlock[] = [block_51_01_safety];
export default section51_blocks;

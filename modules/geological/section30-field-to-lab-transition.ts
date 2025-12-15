/**
 * Файл: section30-field-to-lab-transition.ts
 * Назначение: Переход от полевых к лабораторным испытаниям
 */

import type { InstructionBlock } from './types';

/**
 * Блок 30.1: Связь полевых и лабораторных работ
 */
export const block_30_01_transition: InstructionBlock = {
  id: 'block-30-01-transition',
  section: 'Раздел 30: Связь полевых и лабораторных',
  title: 'Координация полевых и лабораторных работ',
  description: 'Методика перехода от полевых к лабораторным испытаниям',
  priority: 45,
  tags: ['организация', 'координация', 'методика'],
  
  condition: () => true,
  
  variants: [
    {
      id: 'variant-transition',
      priority: 'РЕКОМЕНДУЕМЫЙ',
      normative: {
        document: 'СП РК 1.02-102-2014',
        section: 'Общие требования',
        priority: 'РЕКОМЕНДУЕМЫЙ'
      },
      recommendation:
        '**СВЯЗЬ ПОЛЕВЫХ И ЛАБОРАТОРНЫХ РАБОТ:**\n\n' +
        '**1. Отбор проб в полевых условиях**\n' +
        '**2. Транспортировка и хранение**\n' +
        '**3. Регистрация образцов**\n' +
        '**4. Программа лабораторных испытаний**\n' +
        '**5. Корреляция полевых и лабораторных данных**\n\n' +
        'Обеспечивает единство методологии изысканий.'
    }
  ],
  
  calculateValues: () => ({}),
  generateWorks: () => []
};

export const section30_blocks: InstructionBlock[] = [block_30_01_transition];
export default section30_blocks;

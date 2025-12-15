/**
 * Файл: /modules/technical-assignment/geological/rules-engine/work-generator.ts
 * Назначение: Генерация списка работ из применённых блоков
 * 
 * Описание:
 * Генерирует WorkItem[] на основе применённых блоков и выбранных вариантов.
 * Удаляет дубликаты, объединяет однотипные работы.
 */

import type { 
  InstructionBlock, 
  InstructionVariant, 
  GeologicalInput, 
  WorkItem,
  AppliedBlock 
} from './types';

// ============================================================================
// ГЕНЕРАЦИЯ РАБОТ ИЗ БЛОКА
// ============================================================================

/**
 * Сгенерировать работы из одного блока
 */
export function generateWorksFromBlock(
  block: InstructionBlock,
  selectedVariant: InstructionVariant,
  input: GeologicalInput
): WorkItem[] {
  // Если у блока нет функции генерации работ, возвращаем пустой массив
  if (!block.generateWorks) {
    return [];
  }
  
  try {
    const works = block.generateWorks(input, selectedVariant);
    
    // Валидация сгенерированных работ
    return works.filter(work => validateWorkItem(work));
  } catch (error) {
    console.error(`Ошибка генерации работ из блока ${block.id}:`, error);
    return [];
  }
}

/**
 * Валидация WorkItem
 */
function validateWorkItem(work: WorkItem): boolean {
  if (!work.workId || typeof work.workId !== 'string') {
    console.warn('WorkItem без workId:', work);
    return false;
  }
  
  if (!work.name || typeof work.name !== 'string') {
    console.warn('WorkItem без name:', work);
    return false;
  }
  
  if (typeof work.quantity !== 'number' || work.quantity < 0) {
    console.warn('WorkItem с невалидным quantity:', work);
    return false;
  }
  
  return true;
}

// ============================================================================
// ОБЪЕДИНЕНИЕ И ДЕДУПЛИКАЦИЯ
// ============================================================================

/**
 * Удалить дубликаты работ (по workId)
 */
export function deduplicateWorks(works: WorkItem[]): WorkItem[] {
  const seen = new Map<string, WorkItem>();
  
  for (const work of works) {
    if (!seen.has(work.workId)) {
      seen.set(work.workId, work);
    } else {
      // Если дубликат, суммируем количество
      const existing = seen.get(work.workId)!;
      existing.quantity += work.quantity;
    }
  }
  
  return Array.from(seen.values());
}

/**
 * Объединить однотипные работы
 */
export function mergeSimilarWorks(works: WorkItem[]): WorkItem[] {
  const groups = new Map<string, WorkItem[]>();
  
  // Группируем по комбинации name + unit
  for (const work of works) {
    const key = `${work.name}|${work.unit}`;
    
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(work);
  }
  
  // Объединяем группы
  const merged: WorkItem[] = [];
  
  for (const [, group] of groups) {
    if (group.length === 1) {
      merged.push(group[0]);
    } else {
      // Суммируем количество
      const first = group[0];
      const totalQuantity = group.reduce((sum, w) => sum + w.quantity, 0);
      
      merged.push({
        ...first,
        quantity: totalQuantity,
        description: `${first.description || ''} (объединено ${group.length} работ)`
      });
    }
  }
  
  return merged;
}

// ============================================================================
// СОРТИРОВКА РАБОТ
// ============================================================================

/**
 * Отсортировать работы по приоритету и модулю
 */
export function sortWorks(works: WorkItem[]): WorkItem[] {
  const priorityOrder: Record<string, number> = {
    'ОБЯЗАТЕЛЬНЫЙ': 1,
    'РЕКОМЕНДУЕМЫЙ': 2,
    'СПРАВОЧНЫЙ': 3
  };
  
  const moduleOrder: Record<string, number> = {
    'geological': 1,
    'geodetic': 2,
    'hydrographic': 3,
    'inspection': 4
  };
  
  return [...works].sort((a, b) => {
    // 1. Сортировка по приоритету
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // 2. Сортировка по модулю
    const moduleDiff = moduleOrder[a.module] - moduleOrder[b.module];
    if (moduleDiff !== 0) return moduleDiff;
    
    // 3. Сортировка по названию
    return a.name.localeCompare(b.name, 'ru');
  });
}

// ============================================================================
// ФИЛЬТРАЦИЯ РАБОТ
// ============================================================================

/**
 * Фильтровать работы по категории
 */
export function filterWorksByCategory(
  works: WorkItem[],
  category: 'mandatory' | 'recommended' | 'optional'
): WorkItem[] {
  return works.filter(w => w.category === category);
}

/**
 * Фильтровать работы по модулю
 */
export function filterWorksByModule(
  works: WorkItem[],
  module: 'geological' | 'geodetic' | 'hydrographic' | 'inspection'
): WorkItem[] {
  return works.filter(w => w.module === module);
}

/**
 * Фильтровать работы по тегу
 */
export function filterWorksByTag(works: WorkItem[], tag: string): WorkItem[] {
  return works.filter(w => w.tags?.includes(tag));
}

// ============================================================================
// СТАТИСТИКА ПО РАБОТАМ
// ============================================================================

/**
 * Статистика по сгенерированным работам
 */
export interface WorksStatistics {
  total: number;
  byCategory: {
    mandatory: number;
    recommended: number;
    optional: number;
  };
  byModule: {
    geological: number;
    geodetic: number;
    hydrographic: number;
    inspection: number;
  };
  byPriority: {
    obligatory: number;
    recommended: number;
    reference: number;
  };
}

/**
 * Подсчитать статистику по работам
 */
export function calculateWorksStatistics(works: WorkItem[]): WorksStatistics {
  return {
    total: works.length,
    byCategory: {
      mandatory: works.filter(w => w.category === 'mandatory').length,
      recommended: works.filter(w => w.category === 'recommended').length,
      optional: works.filter(w => w.category === 'optional').length
    },
    byModule: {
      geological: works.filter(w => w.module === 'geological').length,
      geodetic: works.filter(w => w.module === 'geodetic').length,
      hydrographic: works.filter(w => w.module === 'hydrographic').length,
      inspection: works.filter(w => w.module === 'inspection').length
    },
    byPriority: {
      obligatory: works.filter(w => w.priority === 'ОБЯЗАТЕЛЬНЫЙ').length,
      recommended: works.filter(w => w.priority === 'РЕКОМЕНДУЕМЫЙ').length,
      reference: works.filter(w => w.priority === 'СПРАВОЧНЫЙ').length
    }
  };
}

// ============================================================================
// ЭКСПОРТ В РАЗЛИЧНЫЕ ФОРМАТЫ
// ============================================================================

/**
 * Экспортировать работы в формат таблицы
 */
export function exportWorksToTable(works: WorkItem[]): Array<{
  [key: string]: string | number;
}> {
  return works.map(work => ({
    '№': work.workId,
    'Наименование работ': work.name,
    'Единица измерения': work.unit,
    'Количество': work.quantity,
    'Категория': work.category,
    'Модуль': work.module,
    'Приоритет': work.priority,
    'Нормативное основание': work.normativeBase
  }));
}

/**
 * Экспортировать работы в текстовый список
 */
export function exportWorksToText(works: WorkItem[]): string {
  let text = '# ТЕХНИЧЕСКОЕ ЗАДАНИЕ\n\n';
  
  // Группируем по модулям
  const modules = ['geological', 'geodetic', 'hydrographic', 'inspection'] as const;
  const moduleNames = {
    geological: 'Инженерно-геологические изыскания',
    geodetic: 'Инженерно-геодезические изыскания',
    hydrographic: 'Инженерно-гидрографические работы',
    inspection: 'Обследования зданий и сооружений'
  };
  
  for (const module of modules) {
    const moduleWorks = filterWorksByModule(works, module);
    
    if (moduleWorks.length === 0) continue;
    
    text += `## ${moduleNames[module]}\n\n`;
    
    moduleWorks.forEach((work, index) => {
      text += `${index + 1}. **${work.name}**\n`;
      text += `   - Количество: ${work.quantity} ${work.unit}\n`;
      text += `   - Нормативное основание: ${work.normativeBase}\n`;
      if (work.description) {
        text += `   - Описание: ${work.description}\n`;
      }
      text += '\n';
    });
  }
  
  return text;
}

// ============================================================================
// ОСНОВНАЯ ФУНКЦИЯ ГЕНЕРАЦИИ РАБОТ
// ============================================================================

/**
 * Основная функция генерации работ из применённых блоков
 */
export function generateWorksFromAppliedBlocks(
  appliedBlocks: AppliedBlock[],
  input: GeologicalInput
): WorkItem[] {
  let allWorks: WorkItem[] = [];
  
  for (const appliedBlock of appliedBlocks) {
    const blockWorks = generateWorksFromBlock(
      appliedBlock.block,
      appliedBlock.selectedVariant,
      input
    );
    
    allWorks = [...allWorks, ...blockWorks];
  }
  
  // Обработка работ: дедупликация → объединение → сортировка
  const deduplicated = deduplicateWorks(allWorks);
  const merged = mergeSimilarWorks(deduplicated);
  const sorted = sortWorks(merged);
  
  return sorted;
}

// ============================================================================
// ЭКСПОРТЫ
// ============================================================================

export default {
  generateWorksFromBlock,
  generateWorksFromAppliedBlocks,
  deduplicateWorks,
  mergeSimilarWorks,
  sortWorks,
  filterWorksByCategory,
  filterWorksByModule,
  filterWorksByTag,
  calculateWorksStatistics,
  exportWorksToTable,
  exportWorksToText
};

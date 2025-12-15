/**
 * Файл: /modules/technical-assignment/geological/rules-engine/condition-evaluator.ts
 * Назначение: Оценка условий применимости блоков инструкции
 * 
 * Описание:
 * Проверяет, применим ли блок инструкции к конкретному проекту на основе условий.
 * Обрабатывает зависимости между блоками и проверяет конфликты.
 */

import type { InstructionBlock, GeologicalInput, AppliedBlock } from './types';

// ============================================================================
// ОЦЕНКА УСЛОВИЙ
// ============================================================================

/**
 * Проверить, применим ли блок к входным данным
 */
export function evaluateBlockCondition(
  block: InstructionBlock,
  input: GeologicalInput
): boolean {
  try {
    return block.condition(input);
  } catch (error) {
    console.error(`Ошибка оценки условия блока ${block.id}:`, error);
    return false;
  }
}

/**
 * Проверить, применим ли вариант блока
 */
export function evaluateVariantCondition(
  block: InstructionBlock,
  variantId: string,
  input: GeologicalInput
): boolean {
  const variant = block.variants.find(v => v.id === variantId);
  
  if (!variant) {
    console.warn(`Вариант ${variantId} не найден в блоке ${block.id}`);
    return false;
  }
  
  // Если у варианта нет своего условия, он применим всегда (при условии что блок применим)
  if (!variant.condition) {
    return true;
  }
  
  try {
    return variant.condition(input);
  } catch (error) {
    console.error(`Ошибка оценки условия варианта ${variantId}:`, error);
    return false;
  }
}

// ============================================================================
// ПРОВЕРКА ЗАВИСИМОСТЕЙ
// ============================================================================

/**
 * Проверить, выполнены ли все зависимости блока
 */
export function checkDependencies(
  block: InstructionBlock,
  appliedBlocks: AppliedBlock[]
): {
  satisfied: boolean;
  missing: string[];
} {
  if (!block.dependencies || block.dependencies.length === 0) {
    return { satisfied: true, missing: [] };
  }
  
  const appliedBlockIds = new Set(appliedBlocks.map(ab => ab.block.id));
  const missing = block.dependencies.filter(depId => !appliedBlockIds.has(depId));
  
  return {
    satisfied: missing.length === 0,
    missing
  };
}

/**
 * Проверить наличие конфликтов с уже применёнными блоками
 */
export function checkConflicts(
  block: InstructionBlock,
  appliedBlocks: AppliedBlock[]
): {
  hasConflicts: boolean;
  conflicts: string[];
} {
  if (!block.conflicts || block.conflicts.length === 0) {
    return { hasConflicts: false, conflicts: [] };
  }
  
  const appliedBlockIds = new Set(appliedBlocks.map(ab => ab.block.id));
  const conflicts = block.conflicts.filter(conflictId => appliedBlockIds.has(conflictId));
  
  return {
    hasConflicts: conflicts.length > 0,
    conflicts
  };
}

// ============================================================================
// ФИЛЬТРАЦИЯ БЛОКОВ
// ============================================================================

/**
 * Результат фильтрации блоков
 */
export interface BlockFilterResult {
  applicable: InstructionBlock[];
  skipped: Array<{
    block: InstructionBlock;
    reason: 'condition' | 'dependency' | 'conflict';
    details: string;
  }>;
}

/**
 * Фильтровать блоки по применимости к проекту
 */
export function filterApplicableBlocks(
  blocks: InstructionBlock[],
  input: GeologicalInput,
  appliedBlocks: AppliedBlock[] = []
): BlockFilterResult {
  const result: BlockFilterResult = {
    applicable: [],
    skipped: []
  };
  
  for (const block of blocks) {
    // 1. Проверка условия
    if (!evaluateBlockCondition(block, input)) {
      result.skipped.push({
        block,
        reason: 'condition',
        details: 'Условие блока не выполнено'
      });
      continue;
    }
    
    // 2. Проверка зависимостей
    const depCheck = checkDependencies(block, appliedBlocks);
    if (!depCheck.satisfied) {
      result.skipped.push({
        block,
        reason: 'dependency',
        details: `Отсутствуют зависимости: ${depCheck.missing.join(', ')}`
      });
      continue;
    }
    
    // 3. Проверка конфликтов
    const conflictCheck = checkConflicts(block, appliedBlocks);
    if (conflictCheck.hasConflicts) {
      result.skipped.push({
        block,
        reason: 'conflict',
        details: `Конфликты с блоками: ${conflictCheck.conflicts.join(', ')}`
      });
      continue;
    }
    
    // Блок применим
    result.applicable.push(block);
  }
  
  return result;
}

// ============================================================================
// СОРТИРОВКА ПО ПРИОРИТЕТУ
// ============================================================================

/**
 * Отсортировать блоки по приоритету (меньше = раньше)
 */
export function sortBlocksByPriority(blocks: InstructionBlock[]): InstructionBlock[] {
  return [...blocks].sort((a, b) => a.priority - b.priority);
}

/**
 * Отсортировать блоки с учётом зависимостей (топологическая сортировка)
 */
export function sortBlocksWithDependencies(blocks: InstructionBlock[]): InstructionBlock[] {
  const sorted: InstructionBlock[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();
  
  // Создаём карту блоков по ID
  const blockMap = new Map<string, InstructionBlock>();
  blocks.forEach(block => blockMap.set(block.id, block));
  
  // Рекурсивная функция обхода
  function visit(blockId: string) {
    if (visited.has(blockId)) return;
    
    if (visiting.has(blockId)) {
      console.warn(`Обнаружена циклическая зависимость для блока ${blockId}`);
      return;
    }
    
    visiting.add(blockId);
    
    const block = blockMap.get(blockId);
    if (!block) return;
    
    // Сначала обрабатываем все зависимости
    if (block.dependencies) {
      for (const depId of block.dependencies) {
        visit(depId);
      }
    }
    
    visiting.delete(blockId);
    visited.add(blockId);
    sorted.push(block);
  }
  
  // Обходим все блоки
  for (const block of blocks) {
    visit(block.id);
  }
  
  return sorted;
}

// ============================================================================
// УТИЛИТЫ
// ============================================================================

/**
 * Получить применимые варианты блока
 */
export function getApplicableVariants(
  block: InstructionBlock,
  input: GeologicalInput
): typeof block.variants {
  return block.variants.filter(variant => {
    // Если у варианта нет условия, он всегда применим
    if (!variant.condition) return true;
    
    // Иначе проверяем условие
    return evaluateVariantCondition(block, variant.id, input);
  });
}

/**
 * Проверить, есть ли у блока обязательные варианты
 */
export function hasObligatoryVariants(block: InstructionBlock): boolean {
  return block.variants.some(v => v.priority === 'ОБЯЗАТЕЛЬНЫЙ');
}

/**
 * Получить описание причины пропуска блока
 */
export function getSkipReason(
  block: InstructionBlock,
  input: GeologicalInput,
  appliedBlocks: AppliedBlock[]
): string | null {
  if (!evaluateBlockCondition(block, input)) {
    return 'Условие блока не выполнено';
  }
  
  const depCheck = checkDependencies(block, appliedBlocks);
  if (!depCheck.satisfied) {
    return `Отсутствуют зависимости: ${depCheck.missing.join(', ')}`;
  }
  
  const conflictCheck = checkConflicts(block, appliedBlocks);
  if (conflictCheck.hasConflicts) {
    return `Конфликты с блоками: ${conflictCheck.conflicts.join(', ')}`;
  }
  
  return null; // Блок применим
}

// ============================================================================
// ЭКСПОРТЫ
// ============================================================================

export default {
  evaluateBlockCondition,
  evaluateVariantCondition,
  checkDependencies,
  checkConflicts,
  filterApplicableBlocks,
  sortBlocksByPriority,
  sortBlocksWithDependencies,
  getApplicableVariants,
  hasObligatoryVariants,
  getSkipReason
};

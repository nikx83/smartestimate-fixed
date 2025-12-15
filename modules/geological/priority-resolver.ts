/**
 * Файл: /modules/technical-assignment/geological/rules-engine/priority-resolver.ts
 * Назначение: Разрешение приоритетов и выбор оптимального варианта
 * 
 * Описание:
 * Выбирает наилучший вариант из нескольких применимых вариантов блока
 * на основе приоритетов нормативных документов РК.
 * 
 * Иерархия приоритетов:
 * 1. ОБЯЗАТЕЛЬНЫЙ > РЕКОМЕНДУЕМЫЙ > СПРАВОЧНЫЙ
 * 2. Правила РК > СН РК > СП РК > СТ РК > ГОСТ > ВСН
 */

import type { InstructionBlock, InstructionVariant, GeologicalInput, Priority } from './types';
import { getApplicableVariants } from './condition-evaluator';

// ============================================================================
// ИЕРАРХИЯ ПРИОРИТЕТОВ
// ============================================================================

/**
 * Числовой приоритет для типа рекомендации
 */
const PRIORITY_LEVELS: Record<Priority, number> = {
  'ОБЯЗАТЕЛЬНЫЙ': 100,
  'РЕКОМЕНДУЕМЫЙ': 50,
  'СПРАВОЧНЫЙ': 10
};

/**
 * Иерархия нормативных документов РК (чем меньше, тем выше приоритет)
 */
const NORMATIVE_HIERARCHY: Record<string, number> = {
  'Правила осуществления': 1, // Правила осуществления ИГИ (2020)
  'СН РК': 2,                 // Строительные нормы
  'СП РК': 3,                 // Своды правил
  'СТ РК': 4,                 // Стандарты
  'ГОСТ': 5,                  // ГОСТы
  'ВСН': 6                    // Ведомственные строительные нормы
};

/**
 * Определить приоритет нормативного документа
 */
function getNormativeHierarchyLevel(documentName: string): number {
  for (const [key, level] of Object.entries(NORMATIVE_HIERARCHY)) {
    if (documentName.includes(key)) {
      return level;
    }
  }
  return 99; // Неизвестный документ - самый низкий приоритет
}

// ============================================================================
// ВЫБОР ВАРИАНТА
// ============================================================================

/**
 * Результат выбора варианта
 */
export interface VariantSelectionResult {
  selectedVariant: InstructionVariant;
  allApplicableVariants: InstructionVariant[];
  selectionReason: string;
}

/**
 * Автоматически выбрать наилучший вариант из применимых
 */
export function selectBestVariant(
  block: InstructionBlock,
  input: GeologicalInput
): VariantSelectionResult | null {
  // Получить все применимые варианты
  const applicableVariants = getApplicableVariants(block, input);
  
  if (applicableVariants.length === 0) {
    return null; // Нет применимых вариантов
  }
  
  if (applicableVariants.length === 1) {
    return {
      selectedVariant: applicableVariants[0],
      allApplicableVariants: applicableVariants,
      selectionReason: 'Единственный применимый вариант'
    };
  }
  
  // Сортируем варианты по приоритету
  const sorted = sortVariantsByPriority(applicableVariants);
  const best = sorted[0];
  
  return {
    selectedVariant: best,
    allApplicableVariants: applicableVariants,
    selectionReason: `Выбран по приоритету: ${best.priority}, документ: ${best.normative.document}`
  };
}

/**
 * Отсортировать варианты по приоритету (от высшего к низшему)
 */
export function sortVariantsByPriority(variants: InstructionVariant[]): InstructionVariant[] {
  return [...variants].sort((a, b) => {
    // 1. Сравнить уровень приоритета (ОБЯЗАТЕЛЬНЫЙ > РЕКОМЕНДУЕМЫЙ > СПРАВОЧНЫЙ)
    const priorityDiff = PRIORITY_LEVELS[b.priority] - PRIORITY_LEVELS[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // 2. Если уровни равны, сравнить по иерархии нормативов
    const hierarchyA = getNormativeHierarchyLevel(a.normative.document);
    const hierarchyB = getNormativeHierarchyLevel(b.normative.document);
    return hierarchyA - hierarchyB;
  });
}

// ============================================================================
// ФИЛЬТРАЦИЯ ВАРИАНТОВ
// ============================================================================

/**
 * Получить только обязательные варианты
 */
export function getObligatoryVariants(
  block: InstructionBlock,
  input: GeologicalInput
): InstructionVariant[] {
  const applicableVariants = getApplicableVariants(block, input);
  return applicableVariants.filter(v => v.priority === 'ОБЯЗАТЕЛЬНЫЙ');
}

/**
 * Получить только рекомендуемые варианты
 */
export function getRecommendedVariants(
  block: InstructionBlock,
  input: GeologicalInput
): InstructionVariant[] {
  const applicableVariants = getApplicableVariants(block, input);
  return applicableVariants.filter(v => v.priority === 'РЕКОМЕНДУЕМЫЙ');
}

/**
 * Получить только справочные варианты
 */
export function getReferenceVariants(
  block: InstructionBlock,
  input: GeologicalInput
): InstructionVariant[] {
  const applicableVariants = getApplicableVariants(block, input);
  return applicableVariants.filter(v => v.priority === 'СПРАВОЧНЫЙ');
}

// ============================================================================
// СРАВНЕНИЕ ВАРИАНТОВ
// ============================================================================

/**
 * Результат сравнения двух вариантов
 */
export interface VariantComparison {
  winner: InstructionVariant;
  reason: string;
  priorityDifference: number;
}

/**
 * Сравнить два варианта и выбрать лучший
 */
export function compareVariants(
  variantA: InstructionVariant,
  variantB: InstructionVariant
): VariantComparison {
  const priorityA = PRIORITY_LEVELS[variantA.priority];
  const priorityB = PRIORITY_LEVELS[variantB.priority];
  const priorityDiff = priorityB - priorityA;
  
  // Если приоритеты разные
  if (priorityDiff !== 0) {
    const winner = priorityDiff > 0 ? variantA : variantB;
    return {
      winner,
      reason: `${winner.priority} > ${winner === variantA ? variantB.priority : variantA.priority}`,
      priorityDifference: Math.abs(priorityDiff)
    };
  }
  
  // Если приоритеты равны, сравниваем по иерархии нормативов
  const hierarchyA = getNormativeHierarchyLevel(variantA.normative.document);
  const hierarchyB = getNormativeHierarchyLevel(variantB.normative.document);
  
  if (hierarchyA !== hierarchyB) {
    const winner = hierarchyA < hierarchyB ? variantA : variantB;
    return {
      winner,
      reason: `Документ ${winner.normative.document} выше в иерархии`,
      priorityDifference: Math.abs(hierarchyA - hierarchyB)
    };
  }
  
  // Если всё равно, возвращаем первый
  return {
    winner: variantA,
    reason: 'Одинаковый приоритет и иерархия, выбран первый',
    priorityDifference: 0
  };
}

// ============================================================================
// ПРЕДОСТАВЛЕНИЕ ВЫБОРА ПОЛЬЗОВАТЕЛЮ
// ============================================================================

/**
 * Опция для выбора пользователем
 */
export interface VariantOption {
  variant: InstructionVariant;
  rank: number; // Место в рейтинге (1 = лучший)
  score: number; // Общий балл
  isRecommended: boolean; // Рекомендуется ли система
  description: string; // Описание для пользователя
}

/**
 * Подготовить варианты для выбора пользователем
 */
export function prepareVariantOptions(
  block: InstructionBlock,
  input: GeologicalInput
): VariantOption[] {
  const applicableVariants = getApplicableVariants(block, input);
  
  if (applicableVariants.length === 0) {
    return [];
  }
  
  // Сортируем по приоритету
  const sorted = sortVariantsByPriority(applicableVariants);
  
  // Формируем опции
  return sorted.map((variant, index) => {
    const priorityScore = PRIORITY_LEVELS[variant.priority];
    const hierarchyScore = 100 - getNormativeHierarchyLevel(variant.normative.document) * 10;
    const totalScore = priorityScore + hierarchyScore;
    
    return {
      variant,
      rank: index + 1,
      score: totalScore,
      isRecommended: index === 0, // Первый = рекомендуемый
      description: `${variant.priority} - ${variant.normative.document} (${variant.normative.section})`
    };
  });
}

// ============================================================================
// ВАЛИДАЦИЯ ВЫБОРА
// ============================================================================

/**
 * Проверить, является ли выбор варианта обоснованным
 */
export function validateVariantChoice(
  block: InstructionBlock,
  chosenVariantId: string,
  input: GeologicalInput
): {
  valid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  // Проверяем, что вариант существует
  const variant = block.variants.find(v => v.id === chosenVariantId);
  if (!variant) {
    return {
      valid: false,
      warnings: [`Вариант ${chosenVariantId} не найден в блоке ${block.id}`]
    };
  }
  
  // Проверяем, что вариант применим
  const applicableVariants = getApplicableVariants(block, input);
  const isApplicable = applicableVariants.some(v => v.id === chosenVariantId);
  
  if (!isApplicable) {
    warnings.push(`Вариант ${chosenVariantId} не применим к текущим условиям`);
  }
  
  // Проверяем, есть ли варианты с более высоким приоритетом
  const higherPriorityVariants = applicableVariants.filter(v => 
    PRIORITY_LEVELS[v.priority] > PRIORITY_LEVELS[variant.priority]
  );
  
  if (higherPriorityVariants.length > 0) {
    warnings.push(
      `Существуют варианты с более высоким приоритетом: ${
        higherPriorityVariants.map(v => v.id).join(', ')
      }`
    );
  }
  
  return {
    valid: warnings.length === 0,
    warnings
  };
}

// ============================================================================
// ЭКСПОРТЫ
// ============================================================================

export default {
  selectBestVariant,
  sortVariantsByPriority,
  getObligatoryVariants,
  getRecommendedVariants,
  getReferenceVariants,
  compareVariants,
  prepareVariantOptions,
  validateVariantChoice,
  PRIORITY_LEVELS,
  NORMATIVE_HIERARCHY
};

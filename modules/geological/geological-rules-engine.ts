/**
 * Файл: geological-rules-engine.ts
 * Назначение: Главный API для работы с Rules Engine
 * 
 * Описание:
 * Упрощённый интерфейс для использования Rules Engine со всеми блоками инструкции
 */

import { RulesEngine } from './engine';
import ALL_INSTRUCTION_BLOCKS, { 
  INSTRUCTION_STATISTICS,
  getBlocksByTag,
  getMandatoryBlocks
} from './instruction-blocks-registry';

import type { 
  GeologicalInput, 
  RulesEngineResult,
  RulesEngineConfig 
} from './types';

// ============================================================================
// ГЛАВНЫЕ ФУНКЦИИ API
// ============================================================================

/**
 * Обработать входные данные и сгенерировать техническое задание
 * 
 * @example
 * const result = await generateTechnicalAssignment({
 *   projectName: 'Жилой комплекс',
 *   designStage: 'рабочая',
 *   responsibilityLevel: 'II',
 *   geotechnicalCategory: 'II',
 *   buildingArea: 2000,
 *   numberOfFloors: 5,
 *   foundationType: 'ленточный'
 * });
 */
export async function generateTechnicalAssignment(
  input: GeologicalInput,
  config?: RulesEngineConfig
): Promise<RulesEngineResult> {
  // Создаём engine со всеми блоками
  const engine = new RulesEngine(ALL_INSTRUCTION_BLOCKS, config);
  
  // Обрабатываем
  const result = await engine.process(input);
  
  return result;
}

/**
 * Создать экземпляр Rules Engine (для продвинутого использования)
 */
export function createGeologicalRulesEngine(
  config?: RulesEngineConfig
): RulesEngine {
  return new RulesEngine(ALL_INSTRUCTION_BLOCKS, config);
}

/**
 * Получить статистику по блокам инструкции
 */
export function getInstructionStatistics() {
  return {
    ...INSTRUCTION_STATISTICS,
    newSections: {
      section01: 'Общие положения - ДОБАВЛЕН ✅',
      section02: 'Рекогносцировка - ДОБАВЛЕН ✅'
    },
    coverage: {
      implemented: 16,
      total: 52,
      percentage: Math.round((16 / 52) * 100)
    }
  };
}

/**
 * Получить обязательные блоки для минимального ТЗ
 */
export function getMinimalTechnicalAssignment(): string[] {
  const mandatory = getMandatoryBlocks();
  return mandatory.map(block => `${block.id}: ${block.title}`);
}

/**
 * Получить блоки по категории сложности
 */
export function getBlocksByComplexity(category: 'I' | 'II' | 'III') {
  return getBlocksByTag(`категория-${category}`);
}

// ============================================================================
// ЭКСПОРТЫ
// ============================================================================

// Главная функция
export { generateTechnicalAssignment as default };

// Типы
export type {
  GeologicalInput,
  RulesEngineResult,
  RulesEngineConfig
} from './types';

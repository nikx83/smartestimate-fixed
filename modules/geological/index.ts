/**
 * Файл: /modules/geological/index.ts
 * Назначение: Главная точка входа Rules Engine для геологических изысканий
 * 
 * Описание:
 * Экспортирует все компоненты Rules Engine для использования в приложении.
 * Это единственный файл, который нужно импортировать для работы с движком.
 */

// ============================================================================
// ГЛАВНЫЙ ДВИЖОК
// ============================================================================

export { default as GeologicalRulesEngine } from './geological-rules-engine';

// Экспорт класса и функций из engine.ts
export { 
  RulesEngine, 
  createRulesEngine, 
  processGeologicalInput 
} from './engine';

// ============================================================================
// ТИПЫ ДАННЫХ
// ============================================================================

export type {
  // Входные данные
  GeologicalInput,
  
  // Блоки и варианты
  InstructionBlock,
  InstructionVariant,
  
  // Работы
  WorkItem,
  
  // Результаты
  AppliedBlock,
  RulesEngineResult,
  RulesEngineConfig,
  
  // Нормативы
  NormativeReference,
  RecommendedValue,
  RecommendedValues,
  
  // Enums
  Priority,
  WorkCategory,
  SurveyModule
} from './types';

// ============================================================================
// ОЦЕНКА УСЛОВИЙ
// ============================================================================

export {
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
} from './condition-evaluator';

export type { BlockFilterResult } from './condition-evaluator';

// ============================================================================
// РАЗРЕШЕНИЕ ПРИОРИТЕТОВ
// ============================================================================

export {
  selectBestVariant,
  sortVariantsByPriority,
  getObligatoryVariants,
  getRecommendedVariants,
  getReferenceVariants,
  compareVariants,
  prepareVariantOptions,
  validateVariantChoice
} from './priority-resolver';

export type {
  VariantSelectionResult,
  VariantComparison,
  VariantOption
} from './priority-resolver';

// ============================================================================
// ГЕНЕРАЦИЯ РАБОТ
// ============================================================================

export {
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
} from './work-generator';

export type { WorksStatistics } from './work-generator';

// ============================================================================
// РЕЕСТР БЛОКОВ ИНСТРУКЦИИ
// ============================================================================

export {
  ALL_INSTRUCTION_BLOCKS,
  INSTRUCTION_BLOCKS_BY_SECTION,
  INSTRUCTION_STATISTICS,
  getBlocksByTag,
  getMandatoryBlocks,
  getBlocksByPriority
} from './instruction-blocks-registry';

// ============================================================================
// ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ
// ============================================================================

export {
  runAllExamples,
  exampleBasic,
  exampleWithConfig,
  exampleComplex,
  exampleExport
} from './example';

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

// По умолчанию экспортируем главный движок и все блоки
export { default } from './geological-rules-engine';

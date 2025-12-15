/**
 * Файл: /modules/technical-assignment/geological/rules-engine/engine.ts
 * Назначение: Главный движок Rules Engine для генерации технических заданий
 * 
 * Описание:
 * Объединяет все компоненты Rules Engine для автоматической генерации
 * технических заданий на основе входных данных проекта и блоков инструкции.
 * 
 * Алгоритм работы:
 * 1. Принять входные данные проекта (GeologicalInput)
 * 2. Загрузить все блоки инструкции
 * 3. Отфильтровать применимые блоки по условиям
 * 4. Отсортировать по приоритету и зависимостям
 * 5. Для каждого блока выбрать оптимальный вариант
 * 6. Сгенерировать работы (WorkItem[])
 * 7. Удалить дубликаты и объединить
 * 8. Вернуть результат с метаданными
 */

import type {
  GeologicalInput,
  InstructionBlock,
  AppliedBlock,
  RulesEngineResult,
  RulesEngineConfig,
  WorkItem
} from './types';

import {
  filterApplicableBlocks,
  sortBlocksWithDependencies,
  evaluateBlockCondition,
  getApplicableVariants
} from './condition-evaluator';

import {
  selectBestVariant,
  prepareVariantOptions
} from './priority-resolver';

import {
  generateWorksFromBlock,
  deduplicateWorks,
  sortWorks,
  calculateWorksStatistics
} from './work-generator';

// ============================================================================
// ГЛАВНЫЙ КЛАСС RULES ENGINE
// ============================================================================

export class RulesEngine {
  private config: Required<RulesEngineConfig>;
  private blocks: InstructionBlock[];
  
  /**
   * Конструктор Rules Engine
   */
  constructor(
    blocks: InstructionBlock[],
    config: RulesEngineConfig = {}
  ) {
    this.blocks = blocks;
    this.config = {
      autoSelectVariant: config.autoSelectVariant ?? true,
      includeReferenceBlocks: config.includeReferenceBlocks ?? true,
      verboseLogging: config.verboseLogging ?? false,
      maxDependencyDepth: config.maxDependencyDepth ?? 10
    };
  }
  
  /**
   * ГЛАВНЫЙ МЕТОД: Обработать входные данные и сгенерировать ТЗ
   */
  async process(input: GeologicalInput): Promise<RulesEngineResult> {
    const startTime = Date.now();
    
    this.log('🚀 Начало обработки Rules Engine');
    this.log(`Входные данные:`, input);
    
    // Шаг 1: Фильтрация применимых блоков
    this.log('\n📋 Шаг 1: Фильтрация применимых блоков...');
    const filterResult = filterApplicableBlocks(this.blocks, input);
    
    this.log(`✅ Применимо блоков: ${filterResult.applicable.length}`);
    this.log(`⏭️  Пропущено блоков: ${filterResult.skipped.length}`);
    
    if (this.config.verboseLogging) {
      filterResult.skipped.forEach(s => {
        this.log(`  ⚠️ ${s.block.id}: ${s.details}`);
      });
    }
    
    // Шаг 2: Сортировка по зависимостям
    this.log('\n🔄 Шаг 2: Сортировка блоков по зависимостям...');
    const sortedBlocks = sortBlocksWithDependencies(filterResult.applicable);
    
    // Шаг 3: Применение блоков
    this.log('\n⚙️ Шаг 3: Применение блоков и выбор вариантов...');
    const appliedBlocks: AppliedBlock[] = [];
    const warnings: string[] = [];
    const conflicts: string[] = [];
    
    for (const block of sortedBlocks) {
      this.log(`\n  📦 Обработка блока: ${block.id}`);
      
      // Выбор варианта
      let selectedVariant;
      
      if (this.config.autoSelectVariant) {
        // Автоматический выбор
        const selection = selectBestVariant(block, input);
        
        if (!selection) {
          warnings.push(`Блок ${block.id}: нет применимых вариантов`);
          continue;
        }
        
        selectedVariant = selection.selectedVariant;
        this.log(`    ✓ Выбран вариант: ${selectedVariant.id} (${selection.selectionReason})`);
        
        // Если есть альтернативы, добавляем предупреждение
        if (selection.allApplicableVariants.length > 1) {
          warnings.push(
            `Блок ${block.id}: доступны альтернативные варианты (${
              selection.allApplicableVariants.length - 1
            } шт.)`
          );
        }
      } else {
        // Ручной выбор - берём первый применимый вариант
        const applicableVariants = getApplicableVariants(block, input);
        
        if (applicableVariants.length === 0) {
          warnings.push(`Блок ${block.id}: нет применимых вариантов`);
          continue;
        }
        
        selectedVariant = applicableVariants[0];
        this.log(`    ✓ Выбран первый вариант: ${selectedVariant.id}`);
      }
      
      // Расчёт значений (если есть функция)
      let calculatedValues;
      if (block.calculateValues) {
        try {
          calculatedValues = block.calculateValues(input);
          this.log(`    📊 Расчётные значения:`, calculatedValues);
        } catch (error) {
          warnings.push(`Блок ${block.id}: ошибка расчёта значений - ${error}`);
        }
      }
      
      // Генерация работ
      let generatedWorks: WorkItem[] = [];
      if (block.generateWorks) {
        try {
          generatedWorks = generateWorksFromBlock(block, selectedVariant, input);
          this.log(`    🔨 Сгенерировано работ: ${generatedWorks.length}`);
        } catch (error) {
          warnings.push(`Блок ${block.id}: ошибка генерации работ - ${error}`);
        }
      }
      
      // Добавляем в результат
      appliedBlocks.push({
        block,
        selectedVariant,
        calculatedValues,
        generatedWorks,
        appliedAt: new Date()
      });
    }
    
    // Шаг 4: Объединение всех работ
    this.log('\n🔧 Шаг 4: Объединение и дедупликация работ...');
    let allWorks: WorkItem[] = [];
    
    for (const applied of appliedBlocks) {
      if (applied.generatedWorks) {
        allWorks.push(...applied.generatedWorks);
      }
    }
    
    this.log(`  📝 Всего работ до дедупликации: ${allWorks.length}`);
    
    // Дедупликация
    allWorks = deduplicateWorks(allWorks);
    this.log(`  ✅ После дедупликации: ${allWorks.length}`);
    
    // Сортировка
    allWorks = sortWorks(allWorks);
    
    // Шаг 5: Статистика
    this.log('\n📊 Шаг 5: Подсчёт статистики...');
    const stats = calculateWorksStatistics(allWorks);
    
    // Финальный результат
    const executionTime = Date.now() - startTime;
    
    const result: RulesEngineResult = {
      input,
      appliedBlocks,
      allWorks,
      statistics: {
        totalBlocksEvaluated: this.blocks.length,
        blocksApplied: appliedBlocks.length,
        blocksSkipped: filterResult.skipped.length,
        mandatoryWorks: stats.byCategory.mandatory,
        recommendedWorks: stats.byCategory.recommended,
        optionalWorks: stats.byCategory.optional
      },
      warnings,
      conflicts,
      executionTime
    };
    
    this.log(`\n✅ Обработка завершена за ${executionTime} мс`);
    this.log(`📦 Применено блоков: ${appliedBlocks.length}`);
    this.log(`🔨 Всего работ: ${allWorks.length}`);
    
    return result;
  }
  
  /**
   * Логирование (если включено)
   */
  private log(message: string, data?: any) {
    if (this.config.verboseLogging) {
      if (data) {
        console.log(message, data);
      } else {
        console.log(message);
      }
    }
  }
}

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================================

/**
 * Создать экземпляр Rules Engine с блоками инструкции
 */
export function createRulesEngine(
  blocks: InstructionBlock[],
  config?: RulesEngineConfig
): RulesEngine {
  return new RulesEngine(blocks, config);
}

/**
 * Быстрый способ: обработать входные данные одной функцией
 */
export async function processGeologicalInput(
  input: GeologicalInput,
  blocks: InstructionBlock[],
  config?: RulesEngineConfig
): Promise<RulesEngineResult> {
  const engine = createRulesEngine(blocks, config);
  return engine.process(input);
}

// ============================================================================
// ЭКСПОРТЫ
// ============================================================================

export default RulesEngine;

export type {
  GeologicalInput,
  InstructionBlock,
  AppliedBlock,
  RulesEngineResult,
  RulesEngineConfig,
  WorkItem
} from './types';

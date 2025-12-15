/**
 * Файл: /modules/geological/example.ts
 * Примеры использования Rules Engine
 * 
 * Описание:
 * Демонстрирует, как использовать Rules Engine для генерации
 * технического задания на геологические изыскания.
 */

import { RulesEngine, createRulesEngine, processGeologicalInput } from './engine';
import type { GeologicalInput, RulesEngineConfig } from './types';
import { ALL_INSTRUCTION_BLOCKS } from './instruction-blocks-registry';

// ============================================================================
// ПРИМЕР 1: БАЗОВОЕ ИСПОЛЬЗОВАНИЕ
// ============================================================================

/**
 * Простейший пример: жилое здание на простых грунтах
 */
async function exampleBasic() {
  console.log('=== ПРИМЕР 1: Базовое использование ===\n');
  
  // Входные данные проекта
  const input: GeologicalInput = {
    projectName: 'Жилой комплекс "Алатау"',
    projectLocation: 'г. Алматы, мкр. Алатау',
    designStage: 'рабочая',
    
    objectType: 'площадной',
    geotechnicalCategory: 'II',
    responsibilityLevel: 'II',
    
    buildingArea: 1200,
    numberOfFloors: 9,
    foundationType: 'свайный',
    pileLength: 12,
    
    seismicity: 8
  };
  
  // Обработка
  const result = await processGeologicalInput(input, allInstructionBlocks);
  
  // Вывод результатов
  console.log(`✅ Применено блоков: ${result.appliedBlocks.length}`);
  console.log(`🔨 Всего работ: ${result.allWorks.length}`);
  console.log(`⏱️  Время выполнения: ${result.executionTime} мс\n`);
  
  // Первые 5 работ
  console.log('Первые 5 работ:');
  result.allWorks.slice(0, 5).forEach((work, i) => {
    console.log(`${i + 1}. ${work.name} - ${work.quantity} ${work.unit}`);
  });
}

// ============================================================================
// ПРИМЕР 2: С НАСТРОЙКАМИ
// ============================================================================

/**
 * Пример с кастомными настройками Rules Engine
 */
async function exampleWithConfig() {
  console.log('\n\n=== ПРИМЕР 2: С настройками ===\n');
  
  const input: GeologicalInput = {
    projectName: 'Автомобильная дорога Алматы-Талгар',
    objectType: 'линейный',
    objectSubtype: 'автодорога',
    
    geotechnicalCategory: 'II',
    linearLength: 45.5,
    roadCategory: 'II',
    
    specialSoils: ['просадочные'],
    hazards: ['оползни']
  };
  
  // Настройки Rules Engine
  const config: RulesEngineConfig = {
    autoSelectVariant: true,
    includeReferenceBlocks: false, // Не включать справочные блоки
    verboseLogging: true, // Детальное логирование
    maxDependencyDepth: 10
  };
  
  // Создание движка с настройками
  const engine = createRulesEngine(allInstructionBlocks, config);
  const result = await engine.process(input);
  
  console.log(`\n📊 Статистика:`);
  console.log(`  Всего оценено: ${result.statistics.totalBlocksEvaluated}`);
  console.log(`  Применено: ${result.statistics.blocksApplied}`);
  console.log(`  Пропущено: ${result.statistics.blocksSkipped}`);
  console.log(`  Обязательных работ: ${result.statistics.mandatoryWorks}`);
  console.log(`  Рекомендуемых работ: ${result.statistics.recommendedWorks}`);
}

// ============================================================================
// ПРИМЕР 3: СЛОЖНЫЙ ОБЪЕКТ
// ============================================================================

/**
 * Пример со сложным объектом: ГЭС в сейсмоопасном районе
 */
async function exampleComplex() {
  console.log('\n\n=== ПРИМЕР 3: Сложный объект (ГЭС) ===\n');
  
  const input: GeologicalInput = {
    projectName: 'Мойнакская ГЭС',
    projectLocation: 'Алматинская область',
    designStage: 'ТЭО',
    
    objectType: 'плотина',
    geotechnicalCategory: 'III',
    responsibilityLevel: 'повышенная',
    
    seismicity: 9,
    terrain: 'горный',
    
    specialSoils: ['скальные', 'трещиноватые'],
    hazards: ['оползни', 'карст'],
    
    groundwaterDepth: 5,
    groundwaterAggressiveness: true,
    
    geophysicsMethods: ['ВЭЗ', 'сейсморазведка']
  };
  
  const result = await processGeologicalInput(input, allInstructionBlocks, {
    verboseLogging: false,
    includeReferenceBlocks: true
  });
  
  console.log(`✅ Применено блоков: ${result.appliedBlocks.length}`);
  console.log(`🔨 Всего работ: ${result.allWorks.length}`);
  
  // Вывод работ по модулям
  console.log('\nРабот по модулям:');
  console.log(`  Геология: ${result.statistics.mandatoryWorks}`);
  
  // Предупреждения
  if (result.warnings.length > 0) {
    console.log(`\n⚠️ Предупреждения (${result.warnings.length}):`);
    result.warnings.forEach(w => console.log(`  - ${w}`));
  }
}

// ============================================================================
// ПРИМЕР 4: ЭКСПОРТ РЕЗУЛЬТАТОВ
// ============================================================================

/**
 * Пример экспорта результатов в различные форматы
 */
async function exampleExport() {
  console.log('\n\n=== ПРИМЕР 4: Экспорт результатов ===\n');
  
  const input: GeologicalInput = {
    projectName: 'Офисное здание',
    objectType: 'площадной',
    geotechnicalCategory: 'I',
    responsibilityLevel: 'II',
    
    buildingArea: 800,
    numberOfFloors: 5,
    foundationType: 'ленточный',
    foundationDepth: 2.5
  };
  
  const result = await processGeologicalInput(input, allInstructionBlocks);
  
  // Экспорт в текстовый формат
  const { exportWorksToText } = await import('./work-generator');
  const textOutput = exportWorksToText(result.allWorks);
  
  console.log('Текстовый экспорт:');
  console.log(textOutput.substring(0, 500) + '...\n');
  
  // Экспорт в табличный формат
  const { exportWorksToTable } = await import('./work-generator');
  const tableOutput = exportWorksToTable(result.allWorks);
  
  console.log('Табличный экспорт (первые 3 строки):');
  console.table(tableOutput.slice(0, 3));
}

// ============================================================================
// ЗАПУСК ПРИМЕРОВ
// ============================================================================

/**
 * Запустить все примеры
 */
export async function runAllExamples() {
  try {
    await exampleBasic();
    await exampleWithConfig();
    await exampleComplex();
    await exampleExport();
    
    console.log('\n\n✅ Все примеры выполнены успешно!');
  } catch (error) {
    console.error('❌ Ошибка при выполнении примеров:', error);
  }
}

// Запуск, если файл выполняется напрямую
if (require.main === module) {
  runAllExamples();
}

export {
  exampleBasic,
  exampleWithConfig,
  exampleComplex,
  exampleExport
};

/**
 * Путь: /tests/calculations/geodetic.test.ts
 * Назначение: Тесты расчётов геодезических работ
 * Описание: Проверка корректности всех расчётных модулей
 */

import {
  calculateTopographicSurvey,
  calculateLayoutWorks,
  calculateDeformationMonitoring
} from '@/modules/calculations/geodetic';

/**
 * ТЕСТ 1: Простая топографическая съёмка
 */
async function test1_SimpleTopographicSurvey() {
  console.log('\n=== ТЕСТ 1: Топосъёмка М 1:500, категория I ===');

  const result = await calculateTopographicSurvey({
    scale: '1:500',
    area: 10, // 10 га
    category: 'I',
    season: 'summer'
  });

  console.log('Базовая цена:', result.basePrice, '₸/га');
  console.log('Площадь:', result.items[0].quantity, 'га');
  console.log('Коэффициент:', result.items[0].coefficient);
  console.log('Итоговая стоимость:', result.totalCost, '₸');

  // Проверка: 8750 × 10 × 0.95 (скидка за объём) = 83,125 ₸
  const expected = 8750 * 10 * 0.95;
  console.log('Ожидаемая стоимость:', expected, '₸');
  console.log('Совпадение:', Math.abs(result.totalCost - expected) < 10 ? '✅' : '❌');
}

/**
 * ТЕСТ 2: Топосъёмка с коэффициентами
 */
async function test2_TopographicWithCoefficients() {
  console.log('\n=== ТЕСТ 2: Топосъёмка с коэффициентами ===');

  const result = await calculateTopographicSurvey({
    scale: '1:1000',
    area: 5,
    category: 'II',
    season: 'winter', // × 1.3
    terrain: 'hilly', // × 1.2
    vegetation: 'bushes', // × 1.2
    developmentDensity: 'low_density' // × 1.15
  });

  console.log('\n📊 Детальная разбивка:');
  console.log('Базовая цена:', result.basePrice, '₸/га');
  console.log('\nПрименённые коэффициенты:');
  Object.entries(result.coefficients).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  console.log('\nОбщий коэффициент:', result.items[0].coefficient);
  console.log('Площадь:', result.items[0].quantity, 'га');
  console.log('\n💰 ИТОГОВАЯ СТОИМОСТЬ:', result.totalCost, '₸');

  // Расчёт: 8750 × 5 × 1.0 (объём) × 1.3 × 1.2 × 1.2 × 1.15 = 79,313 ₸
  const manualCalc = 8750 * 5 * 1.0 * 1.3 * 1.2 * 1.2 * 1.15;
  console.log('Ручной расчёт:', manualCalc.toFixed(2), '₸');
  console.log('Совпадение:', Math.abs(result.totalCost - manualCalc) < 10 ? '✅' : '❌');
}

/**
 * ТЕСТ 3: Разбивка геодезической сетки
 */
async function test3_ConstructionGrid() {
  console.log('\n=== ТЕСТ 3: Разбивка геодезической сетки ===');

  const result = await calculateLayoutWorks({
    workType: 'construction_grid',
    category: 'II',
    quantity: 4, // 4 пункта
    season: 'summer',
    accuracyRequirement: 'standard'
  });

  console.log('Базовая цена:', result.basePrice, '₸/пункт');
  console.log('Количество пунктов:', result.items[0].quantity);
  console.log('Коэффициент:', result.items[0].coefficient);
  console.log('Итоговая стоимость:', result.totalCost, '₸');

  // Проверка: 156250 × 4 = 625,000 ₸
  const expected = 156250 * 4;
  console.log('Ожидаемая стоимость:', expected, '₸');
  console.log('Совпадение:', Math.abs(result.totalCost - expected) < 10 ? '✅' : '❌');
}

/**
 * ТЕСТ 4: Вынос осей здания
 */
async function test4_BuildingAxes() {
  console.log('\n=== ТЕСТ 4: Вынос осей здания ===');

  const result = await calculateLayoutWorks({
    workType: 'building_axes',
    category: 'III',
    quantity: 2, // 2 здания
    season: 'winter', // × 1.3
    developmentDensity: 'high_density' // × 1.5
  });

  console.log('Базовая цена:', result.basePrice, '₸/здание');
  console.log('Применённые коэффициенты:', result.coefficients);
  console.log('Общий коэффициент:', result.items[0].coefficient);
  console.log('Количество зданий:', result.items[0].quantity);
  console.log('Итоговая стоимость:', result.totalCost, '₸');

  // Проверка: 56250 × 2 × 1.3 × 1.5 = 219,375 ₸
  const expected = 56250 * 2 * 1.3 * 1.5;
  console.log('Ожидаемая стоимость:', expected, '₸');
  console.log('Совпадение:', Math.abs(result.totalCost - expected) < 10 ? '✅' : '❌');
}

/**
 * ТЕСТ 5: Мониторинг деформаций
 */
async function test5_DeformationMonitoring() {
  console.log('\n=== ТЕСТ 5: Мониторинг деформаций ===');

  const result = await calculateDeformationMonitoring({
    category: 'II',
    marksCount: 20, // 20 марок
    cyclesCount: 4, // 4 цикла
    season: 'summer',
    accuracyRequirement: 'increased' // × 1.3
  });

  console.log('Базовая цена:', result.basePrice, '₸/марка');
  console.log('Количество марок:', result.marksCount);
  console.log('Количество циклов:', result.cyclesCount);
  console.log('Применённые коэффициенты:', result.coefficients);
  console.log('Общее количество измерений:', result.items[0].quantity);
  console.log('Итоговая стоимость:', result.totalCost, '₸');

  // Проверка: 8125 × (20 × 4) × 1.3 = 845,000 ₸
  const expected = 8125 * (20 * 4) * 1.3;
  console.log('Ожидаемая стоимость:', expected, '₸');
  console.log('Совпадение:', Math.abs(result.totalCost - expected) < 10 ? '✅' : '❌');
}

/**
 * ТЕСТ 6: Сравнение масштабов топосъёмки
 */
async function test6_ScaleComparison() {
  console.log('\n=== ТЕСТ 6: Сравнение масштабов ===');

  const scales = ['1:500', '1:1000', '1:2000', '1:5000'] as const;
  const area = 10;

  for (const scale of scales) {
    const result = await calculateTopographicSurvey({
      scale,
      area,
      category: 'II',
      season: 'summer'
    });

    console.log(`\nМасштаб ${scale}:`);
    console.log('  Базовая цена:', result.basePrice, '₸/га');
    console.log('  Итого:', result.totalCost, '₸');
  }
}

/**
 * ТЕСТ 7: Комплексный расчёт (все модули)
 */
async function test7_ComplexCalculation() {
  console.log('\n=== ТЕСТ 7: Комплексный проект ===');

  // Топографическая съёмка
  const topoResult = await calculateTopographicSurvey({
    scale: '1:500',
    area: 15,
    category: 'III',
    season: 'winter',
    terrain: 'hilly',
    vegetation: 'bushes',
    developmentDensity: 'medium_density',
    utilitiesDensity: 'medium',
    accuracyRequirement: 'increased'
  });

  console.log('\n1. Топографическая съёмка:');
  console.log('   Стоимость:', topoResult.totalCost.toLocaleString('ru-RU'), '₸');

  // Разбивка сетки
  const gridResult = await calculateLayoutWorks({
    workType: 'construction_grid',
    category: 'III',
    quantity: 6,
    season: 'winter',
    accuracyRequirement: 'increased',
    developmentDensity: 'medium_density'
  });

  console.log('\n2. Разбивка геодезической сетки:');
  console.log('   Стоимость:', gridResult.totalCost.toLocaleString('ru-RU'), '₸');

  // Вынос осей
  const axesResult = await calculateLayoutWorks({
    workType: 'building_axes',
    category: 'II',
    quantity: 3,
    season: 'winter',
    developmentDensity: 'medium_density'
  });

  console.log('\n3. Вынос осей зданий:');
  console.log('   Стоимость:', axesResult.totalCost.toLocaleString('ru-RU'), '₸');

  // Мониторинг
  const monitoringResult = await calculateDeformationMonitoring({
    category: 'II',
    marksCount: 30,
    cyclesCount: 6,
    season: 'winter',
    accuracyRequirement: 'high',
    buildingHeight: 45
  });

  console.log('\n4. Мониторинг деформаций:');
  console.log('   Стоимость:', monitoringResult.totalCost.toLocaleString('ru-RU'), '₸');

  // Итого
  const totalProjectCost = 
    topoResult.totalCost +
    gridResult.totalCost +
    axesResult.totalCost +
    monitoringResult.totalCost;

  console.log('\n' + '='.repeat(50));
  console.log('💰 ИТОГО ПО ПРОЕКТУ:', totalProjectCost.toLocaleString('ru-RU'), '₸');
  console.log('='.repeat(50));
}

/**
 * ЗАПУСК ВСЕХ ТЕСТОВ
 */
export async function runGeodeticTests() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   ТЕСТИРОВАНИЕ ГЕОДЕЗИЧЕСКИХ МОДУЛЕЙ (СЦИ РК 2025)    ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  try {
    await test1_SimpleTopographicSurvey();
    await test2_TopographicWithCoefficients();
    await test3_ConstructionGrid();
    await test4_BuildingAxes();
    await test5_DeformationMonitoring();
    await test6_ScaleComparison();
    await test7_ComplexCalculation();

    console.log('\n✅ Все тесты геодезии завершены!\n');
  } catch (error) {
    console.error('\n❌ Ошибка при выполнении тестов:', error);
  }
}

// Если запускается напрямую
if (require.main === module) {
  runGeodeticTests();
}

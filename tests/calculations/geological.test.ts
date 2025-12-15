/**
 * Путь: /tests/calculations/geological.test.ts
 * Назначение: Тесты расчётов геологических работ
 */

import {
  calculateDrilling,
  calculateLaboratory,
  calculateFieldTesting
} from '@/modules/calculations/geological';

/**
 * ТЕСТ 1: Бурение ручным способом
 */
async function test1_ManualDrilling() {
  console.log('\n=== ТЕСТ 1: Бурение ручным способом ===');

  const result = await calculateDrilling({
    drillingMethod: 'manual',
    soilCategory: 'II',
    wellsCount: 5,
    depthPerWell: 10,
    season: 'summer'
  });

  console.log('Базовая цена:', result.basePrice, '₸/м');
  console.log('Количество скважин:', 5);
  console.log('Глубина каждой:', 10, 'м');
  console.log('Общая глубина:', result.items[0].quantity, 'м');
  console.log('Коэффициент:', result.items[0].coefficient);
  console.log('Итоговая стоимость:', result.totalCost, '₸');

  // Проверка: 875 × 50 × 0.95 (скидка за объём) = 41,562.5 ₸
  const expected = 875 * 50 * 0.95;
  console.log('Ожидаемая стоимость:', expected, '₸');
  console.log('Совпадение:', Math.abs(result.totalCost - expected) < 10 ? '✅' : '❌');
}

/**
 * ТЕСТ 2: Бурение с коэффициентами
 */
async function test2_DrillingWithCoefficients() {
  console.log('\n=== ТЕСТ 2: Бурение с коэффициентами ===');

  const result = await calculateDrilling({
    drillingMethod: 'light_mechanical',
    soilCategory: 'IV',
    wellsCount: 3,
    depthPerWell: 15,
    season: 'winter', // × 1.3
    waterSaturation: 'saturated', // × 1.2
    developmentDensity: 'high_density', // × 1.5
    urgency: 'urgent' // × 1.3
  });

  console.log('\n📊 Детальная разбивка:');
  console.log('Базовая цена:', result.basePrice, '₸/м');
  console.log('\nПрименённые коэффициенты:');
  Object.entries(result.coefficients).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  console.log('\nОбщий коэффициент:', result.items[0].coefficient);
  console.log('Общая глубина:', result.items[0].quantity, 'м');
  console.log('\n💰 ИТОГОВАЯ СТОИМОСТЬ:', result.totalCost, '₸');

  // Расчёт: 2875 × 45 × 1.0 × 1.3 × 1.2 × 1.5 × 1.3 = 391,162.5 ₸
  const manualCalc = 2875 * 45 * 1.0 * 1.3 * 1.2 * 1.5 * 1.3;
  console.log('Ручной расчёт:', manualCalc.toFixed(2), '₸');
  console.log('Совпадение:', Math.abs(result.totalCost - manualCalc) < 10 ? '✅' : '❌');
}

/**
 * ТЕСТ 3: Проходка шурфов
 */
async function test3_Pits() {
  console.log('\n=== ТЕСТ 3: Проходка шурфов ===');

  const result = await calculateDrilling({
    drillingMethod: 'pit',
    soilCategory: 'III',
    pitsCount: 4,
    volumePerPit: 6, // 1×2×3м = 6 м³
    season: 'summer'
  });

  console.log('Базовая цена:', result.basePrice, '₸/м³');
  console.log('Количество шурфов:', 4);
  console.log('Объём каждого:', 6, 'м³');
  console.log('Общий объём:', result.items[0].quantity, 'м³');
  console.log('Итоговая стоимость:', result.totalCost, '₸');

  // Проверка: 31250 × 24 = 750,000 ₸
  const expected = 31250 * 24;
  console.log('Ожидаемая стоимость:', expected, '₸');
  console.log('Совпадение:', Math.abs(result.totalCost - expected) < 10 ? '✅' : '❌');
}

/**
 * ТЕСТ 4: Лабораторные испытания
 */
async function test4_Laboratory() {
  console.log('\n=== ТЕСТ 4: Лабораторные испытания ===');

  const result = await calculateLaboratory({
    tests: [
      { testType: 'moisture', samplesCount: 20 },
      { testType: 'density', samplesCount: 20 },
      { testType: 'grain_size_sieve', samplesCount: 10 },
      { testType: 'compression', samplesCount: 5 },
      { testType: 'shear', samplesCount: 5 }
    ],
    urgency: 'normal'
  });

  console.log('\n📋 Перечень испытаний:');
  result.items.forEach(item => {
    console.log(`  ${item.workType}: ${item.quantity} проб × ${item.unitPrice} ₸ = ${item.cost} ₸`);
  });

  console.log('\nОбщее количество проб:', 60);
  console.log('Коэффициент объёма:', result.coefficients.volume);
  console.log('\n💰 ИТОГОВАЯ СТОИМОСТЬ:', result.totalCost, '₸');

  // Расчёт вручную:
  // (625×20 + 938×20 + 1875×10 + 6250×5 + 8750×5) × 0.9 = 127,935 ₸
  const manualCalc = (625*20 + 938*20 + 1875*10 + 6250*5 + 8750*5) * 0.9;
  console.log('Ручной расчёт:', manualCalc.toFixed(2), '₸');
  console.log('Совпадение:', Math.abs(result.totalCost - manualCalc) < 10 ? '✅' : '❌');
}

/**
 * ТЕСТ 5: Полевые испытания (зондирование)
 */
async function test5_FieldTesting() {
  console.log('\n=== ТЕСТ 5: Статическое зондирование ===');

  const result = await calculateFieldTesting({
    testType: 'static_penetration',
    soilCategory: 'II',
    pointsCount: 10,
    depthPerPoint: 12,
    season: 'summer',
    developmentDensity: 'medium_density'
  });

  console.log('Базовая цена:', result.basePrice, '₸/м');
  console.log('Количество точек:', 10);
  console.log('Глубина каждой:', 12, 'м');
  console.log('Общая глубина:', result.items[0].quantity, 'м');
  console.log('Применённые коэффициенты:', result.coefficients);
  console.log('Итоговая стоимость:', result.totalCost, '₸');

  // Проверка: 750 × 120 × 1.3 = 117,000 ₸
  const expected = 750 * 120 * 1.3;
  console.log('Ожидаемая стоимость:', expected, '₸');
  console.log('Совпадение:', Math.abs(result.totalCost - expected) < 10 ? '✅' : '❌');
}

/**
 * ТЕСТ 6: Комплексные геологические изыскания
 */
async function test6_ComplexProject() {
  console.log('\n=== ТЕСТ 6: Комплексный проект ===');

  // 1. Бурение скважин
  const drillingResult = await calculateDrilling({
    drillingMethod: 'light_mechanical',
    soilCategory: 'III',
    wellsCount: 8,
    depthPerWell: 20,
    season: 'summer',
    waterSaturation: 'moist',
    complexity: 'medium'
  });

  console.log('\n1. Бурение скважин:');
  console.log('   Стоимость:', drillingResult.totalCost.toLocaleString('ru-RU'), '₸');

  // 2. Проходка шурфов
  const pitsResult = await calculateDrilling({
    drillingMethod: 'pit',
    soilCategory: 'II',
    pitsCount: 3,
    volumePerPit: 6,
    season: 'summer'
  });

  console.log('\n2. Проходка шурфов:');
  console.log('   Стоимость:', pitsResult.totalCost.toLocaleString('ru-RU'), '₸');

  // 3. Полевые испытания
  const fieldResult = await calculateFieldTesting({
    testType: 'static_penetration',
    soilCategory: 'II',
    pointsCount: 12,
    depthPerPoint: 15,
    season: 'summer'
  });

  console.log('\n3. Статическое зондирование:');
  console.log('   Стоимость:', fieldResult.totalCost.toLocaleString('ru-RU'), '₸');

  // 4. Лабораторные испытания
  const labResult = await calculateLaboratory({
    tests: [
      { testType: 'moisture', samplesCount: 30 },
      { testType: 'density', samplesCount: 30 },
      { testType: 'plasticity_index', samplesCount: 20 },
      { testType: 'grain_size_sieve', samplesCount: 15 },
      { testType: 'compression', samplesCount: 10 },
      { testType: 'shear', samplesCount: 10 },
      { testType: 'ph', samplesCount: 10 },
      { testType: 'water_aggressiveness', samplesCount: 5 }
    ]
  });

  console.log('\n4. Лабораторные испытания:');
  console.log('   Стоимость:', labResult.totalCost.toLocaleString('ru-RU'), '₸');

  // Итого
  const totalProjectCost =
    drillingResult.totalCost +
    pitsResult.totalCost +
    fieldResult.totalCost +
    labResult.totalCost;

  console.log('\n' + '='.repeat(50));
  console.log('💰 ИТОГО ПО ПРОЕКТУ:', totalProjectCost.toLocaleString('ru-RU'), '₸');
  console.log('='.repeat(50));

  console.log('\n📊 Структура затрат:');
  console.log(`  Бурение: ${((drillingResult.totalCost / totalProjectCost) * 100).toFixed(1)}%`);
  console.log(`  Шурфы: ${((pitsResult.totalCost / totalProjectCost) * 100).toFixed(1)}%`);
  console.log(`  Зондирование: ${((fieldResult.totalCost / totalProjectCost) * 100).toFixed(1)}%`);
  console.log(`  Лаборатория: ${((labResult.totalCost / totalProjectCost) * 100).toFixed(1)}%`);
}

/**
 * ТЕСТ 7: Особые условия
 */
async function test7_SpecialConditions() {
  console.log('\n=== ТЕСТ 7: Особые геологические условия ===');

  const result = await calculateDrilling({
    drillingMethod: 'heavy_mechanical',
    soilCategory: 'V',
    wellsCount: 3,
    depthPerWell: 40,
    season: 'winter',
    hasPermafrost: true, // × 1.5
    seismicity: 9, // × 1.4
    complexity: 'very_complex' // × 1.6
  });

  console.log('\n📊 Особо сложные условия:');
  console.log('Базовая цена:', result.basePrice, '₸/м');
  console.log('\nПрименённые коэффициенты:');
  Object.entries(result.coefficients).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  console.log('\nОбщий коэффициент:', result.items[0].coefficient);
  console.log('Общая глубина:', result.items[0].quantity, 'м');
  console.log('\n💰 ИТОГОВАЯ СТОИМОСТЬ:', result.totalCost.toLocaleString('ru-RU'), '₸');
}

/**
 * ЗАПУСК ВСЕХ ТЕСТОВ
 */
export async function runGeologicalTests() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   ТЕСТИРОВАНИЕ ГЕОЛОГИЧЕСКИХ МОДУЛЕЙ (СЦИ РК 2025)    ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  try {
    await test1_ManualDrilling();
    await test2_DrillingWithCoefficients();
    await test3_Pits();
    await test4_Laboratory();
    await test5_FieldTesting();
    await test6_ComplexProject();
    await test7_SpecialConditions();

    console.log('\n✅ Все тесты геологии завершены!\n');
  } catch (error) {
    console.error('\n❌ Ошибка при выполнении тестов:', error);
  }
}

// Если запускается напрямую
if (require.main === module) {
  runGeologicalTests();
}

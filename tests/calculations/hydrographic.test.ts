/**
 * Путь: /tests/calculations/hydrographic.test.ts
 * Назначение: Тесты расчётов гидрографических работ
 */

import {
  calculateDepthSounding,
  calculateHydrologicalObservations,
  calculateWaterSampling,
  calculateMeteoObservations
} from '@/modules/calculations/hydrographic';

/**
 * ТЕСТ 1: Промеры глубин эхолотом
 */
async function test1_EchoSounderSounding() {
  console.log('\n=== ТЕСТ 1: Промеры глубин эхолотом ===');

  const result = await calculateDepthSounding({
    method: 'echo_sounder',
    category: 'II',
    distance: 25,
    season: 'summer'
  });

  console.log('Базовая цена:', result.basePrice, '₸/км');
  console.log('Расстояние профилей:', result.items[0].quantity, 'км');
  console.log('Коэффициент:', result.items[0].coefficient);
  console.log('Итоговая стоимость:', result.totalCost, '₸');

  // Проверка: 4063 × 25 × 0.95 = 96,498 ₸
  const expected = 4063 * 25 * 0.95;
  console.log('Ожидаемая стоимость:', expected, '₸');
  console.log('Совпадение:', Math.abs(result.totalCost - expected) < 10 ? '✅' : '❌');
}

/**
 * ТЕСТ 2: Промеры с коэффициентами
 */
async function test2_DepthSoundingWithCoefficients() {
  console.log('\n=== ТЕСТ 2: Промеры в сложных условиях ===');

  const result = await calculateDepthSounding({
    method: 'echo_sounder',
    category: 'III',
    distance: 50,
    season: 'winter', // × 1.4
    iceConditions: 'thick_ice', // × 1.5
    weatherConditions: 'moderate', // × 1.3
    remoteness: 'remote' // × 1.3
  });

  console.log('\n📊 Детальная разбивка:');
  console.log('Базовая цена:', result.basePrice, '₸/км');
  console.log('\nПрименённые коэффициенты:');
  Object.entries(result.coefficients).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  console.log('\nОбщий коэффициент:', result.items[0].coefficient);
  console.log('Расстояние:', result.items[0].quantity, 'км');
  console.log('\n💰 ИТОГОВАЯ СТОИМОСТЬ:', result.totalCost.toLocaleString('ru-RU'), '₸');

  // Расчёт: 5313 × 50 × 0.9 × 1.4 × 1.5 × 1.3 × 1.3
  const manualCalc = 5313 * 50 * 0.9 * 1.4 * 1.5 * 1.3 * 1.3;
  console.log('Ручной расчёт:', manualCalc.toFixed(2), '₸');
  console.log('Совпадение:', Math.abs(result.totalCost - manualCalc) < 10 ? '✅' : '❌');
}

/**
 * ТЕСТ 3: Наблюдения за уровнем воды
 */
async function test3_WaterLevelObservations() {
  console.log('\n=== ТЕСТ 3: Наблюдения за уровнем воды ===');

  const result = await calculateHydrologicalObservations({
    observationType: 'water_level',
    category: 'II',
    durationMonths: 6,
    season: 'summer'
  });

  console.log('Базовая цена:', result.basePrice, '₸/месяц');
  console.log('Длительность:', result.items[0].quantity, 'месяцев');
  console.log('Коэффициент объёма:', result.coefficients.volume);
  console.log('Итоговая стоимость:', result.totalCost.toLocaleString('ru-RU'), '₸');

  // Проверка: 37500 × 6 × 0.9 = 202,500 ₸
  const expected = 37500 * 6 * 0.9;
  console.log('Ожидаемая стоимость:', expected.toLocaleString('ru-RU'), '₸');
  console.log('Совпадение:', Math.abs(result.totalCost - expected) < 10 ? '✅' : '❌');
}

/**
 * ТЕСТ 4: Измерение течений
 */
async function test4_CurrentVelocity() {
  console.log('\n=== ТЕСТ 4: Измерение скоростей течения ===');

  const result = await calculateHydrologicalObservations({
    observationType: 'current_velocity',
    category: 'III',
    crossSectionsCount: 8,
    season: 'spring',
    remoteness: 'moderate'
  });

  console.log('Базовая цена:', result.basePrice, '₸/створ');
  console.log('Количество створов:', result.items[0].quantity);
  console.log('Применённые коэффициенты:', result.coefficients);
  console.log('Итоговая стоимость:', result.totalCost.toLocaleString('ru-RU'), '₸');

  // Проверка: 10625 × 8 × 1.2 × 1.15 = 117,300 ₸
  const expected = 10625 * 8 * 1.2 * 1.15;
  console.log('Ожидаемая стоимость:', expected.toLocaleString('ru-RU'), '₸');
  console.log('Совпадение:', Math.abs(result.totalCost - expected) < 10 ? '✅' : '❌');
}

/**
 * ТЕСТ 5: Отбор проб воды
 */
async function test5_WaterSampling() {
  console.log('\n=== ТЕСТ 5: Отбор проб воды ===');

  const result = await calculateWaterSampling({
    samples: [
      { sampleType: 'surface', samplesCount: 15 },
      { sampleType: 'depth', samplesCount: 10 },
      { sampleType: 'bottom_sediment', samplesCount: 5 }
    ],
    season: 'summer',
    remoteness: 'nearby'
  });

  console.log('\n📋 Перечень проб:');
  result.items.forEach(item => {
    console.log(`  ${item.workType}: ${item.quantity} проб × ${item.unitPrice} ₸ = ${item.cost.toLocaleString('ru-RU')} ₸`);
  });

  console.log('\n💰 ИТОГОВАЯ СТОИМОСТЬ:', result.totalCost.toLocaleString('ru-RU'), '₸');

  // Расчёт: (938×15 + 1563×10 + 2188×5) × 1.0 = 40,645 ₸
  const manualCalc = (938 * 15 + 1563 * 10 + 2188 * 5) * 1.0;
  console.log('Ручной расчёт:', manualCalc.toFixed(2), '₸');
  console.log('Совпадение:', Math.abs(result.totalCost - manualCalc) < 10 ? '✅' : '❌');
}

/**
 * ТЕСТ 6: Метеорологические наблюдения
 */
async function test6_MeteoObservations() {
  console.log('\n=== ТЕСТ 6: Метеорологические наблюдения ===');

  const result = await calculateMeteoObservations({
    observationType: 'auto_station',
    duration: 3,
    remoteness: 'moderate'
  });

  console.log('Базовая цена:', result.basePrice.toLocaleString('ru-RU'), '₸/месяц');
  console.log('Длительность:', result.items[0].quantity, 'месяцев');
  console.log('Применённые коэффициенты:', result.coefficients);
  console.log('Итоговая стоимость:', result.totalCost.toLocaleString('ru-RU'), '₸');

  // Проверка: 62500 × 3 × 1.15 = 215,625 ₸
  const expected = 62500 * 3 * 1.15;
  console.log('Ожидаемая стоимость:', expected.toLocaleString('ru-RU'), '₸');
  console.log('Совпадение:', Math.abs(result.totalCost - expected) < 10 ? '✅' : '❌');
}

/**
 * ТЕСТ 7: Комплексные гидрографические изыскания
 */
async function test7_ComplexProject() {
  console.log('\n=== ТЕСТ 7: Комплексный проект ===');

  // 1. Промеры глубин
  const soundingResult = await calculateDepthSounding({
    method: 'echo_sounder',
    category: 'III',
    distance: 75,
    season: 'summer',
    weatherConditions: 'light',
    waterDepth: 'deep'
  });

  console.log('\n1. Промеры глубин эхолотом:');
  console.log('   Стоимость:', soundingResult.totalCost.toLocaleString('ru-RU'), '₸');

  // 2. Наблюдения за уровнем
  const levelResult = await calculateHydrologicalObservations({
    observationType: 'water_level',
    category: 'II',
    durationMonths: 12,
    season: 'summer'
  });

  console.log('\n2. Наблюдения за уровнем воды:');
  console.log('   Стоимость:', levelResult.totalCost.toLocaleString('ru-RU'), '₸');

  // 3. Измерение течений
  const currentResult = await calculateHydrologicalObservations({
    observationType: 'current_velocity',
    category: 'III',
    crossSectionsCount: 12,
    season: 'summer'
  });

  console.log('\n3. Измерение скоростей течения:');
  console.log('   Стоимость:', currentResult.totalCost.toLocaleString('ru-RU'), '₸');

  // 4. Отбор проб
  const samplingResult = await calculateWaterSampling({
    samples: [
      { sampleType: 'surface', samplesCount: 20 },
      { sampleType: 'depth', samplesCount: 15 },
      { sampleType: 'bottom_sediment', samplesCount: 10 }
    ],
    season: 'summer'
  });

  console.log('\n4. Отбор проб воды:');
  console.log('   Стоимость:', samplingResult.totalCost.toLocaleString('ru-RU'), '₸');

  // 5. Метеонаблюдения
  const meteoResult = await calculateMeteoObservations({
    observationType: 'auto_station',
    duration: 6,
    remoteness: 'nearby'
  });

  console.log('\n5. Метеорологические наблюдения:');
  console.log('   Стоимость:', meteoResult.totalCost.toLocaleString('ru-RU'), '₸');

  // Итого
  const totalProjectCost =
    soundingResult.totalCost +
    levelResult.totalCost +
    currentResult.totalCost +
    samplingResult.totalCost +
    meteoResult.totalCost;

  console.log('\n' + '='.repeat(50));
  console.log('💰 ИТОГО ПО ПРОЕКТУ:', totalProjectCost.toLocaleString('ru-RU'), '₸');
  console.log('='.repeat(50));

  console.log('\n📊 Структура затрат:');
  console.log(`  Промеры: ${((soundingResult.totalCost / totalProjectCost) * 100).toFixed(1)}%`);
  console.log(`  Уровень: ${((levelResult.totalCost / totalProjectCost) * 100).toFixed(1)}%`);
  console.log(`  Течения: ${((currentResult.totalCost / totalProjectCost) * 100).toFixed(1)}%`);
  console.log(`  Пробы: ${((samplingResult.totalCost / totalProjectCost) * 100).toFixed(1)}%`);
  console.log(`  Метео: ${((meteoResult.totalCost / totalProjectCost) * 100).toFixed(1)}%`);
}

/**
 * ЗАПУСК ВСЕХ ТЕСТОВ
 */
export async function runHydrographicTests() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║  ТЕСТИРОВАНИЕ ГИДРОГРАФИЧЕСКИХ МОДУЛЕЙ (СЦИ РК 2025)  ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  try {
    await test1_EchoSounderSounding();
    await test2_DepthSoundingWithCoefficients();
    await test3_WaterLevelObservations();
    await test4_CurrentVelocity();
    await test5_WaterSampling();
    await test6_MeteoObservations();
    await test7_ComplexProject();

    console.log('\n✅ Все тесты гидрографии завершены!\n');
  } catch (error) {
    console.error('\n❌ Ошибка при выполнении тестов:', error);
  }
}

// Если запускается напрямую
if (require.main === module) {
  runHydrographicTests();
}

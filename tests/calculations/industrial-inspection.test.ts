/**
 * Путь: /tests/calculations/industrial-inspection.test.ts
 * Назначение: Тесты расчёта обследований промышленных зданий
 * Описание: Проверка корректности расчётов по СЦИ РК
 */

import { calculateIndustrialInspection } from '@/modules/calculations/inspection/industrial';

/**
 * ТЕСТ 1: Простое одноэтажное здание I категории
 * Ожидаемый результат: базовая цена × количество единиц
 */
async function test1_SimpleBuilding() {
  console.log('\n=== ТЕСТ 1: Простое одноэтажное здание I категории ===');

  const result = await calculateIndustrialInspection({
    buildingCategory: 'I',
    floors: 1,
    heightCategory: 'до 4.5м',
    volume: 1000, // 10 единиц по 100 м³
    workComplexity: 'I'
  });

  console.log('Базовая цена:', result.basePrice, '₸');
  console.log('Количество единиц:', result.items[0].quantity);
  console.log('Коэффициент:', result.items[0].coefficient);
  console.log('Итоговая стоимость:', result.totalCost, '₸');

  // Проверка: 3893 × 10 = 38,930 ₸
  const expected = 3893 * 10;
  console.log('Ожидаемая стоимость:', expected, '₸');
  console.log('Совпадение:', Math.abs(result.totalCost - expected) < 1 ? '✅' : '❌');
}

/**
 * ТЕСТ 2: Здание с коэффициентом малого объёма
 * Объём 500 м³ → коэффициент 2.8
 */
async function test2_SmallVolume() {
  console.log('\n=== ТЕСТ 2: Малый объём (500 м³) ===');

  const result = await calculateIndustrialInspection({
    buildingCategory: 'I',
    floors: 1,
    heightCategory: 'до 4.5м',
    volume: 500, // 5 единиц × коэффициент 2.8
    workComplexity: 'I'
  });

  console.log('Базовая цена:', result.basePrice, '₸');
  console.log('Коэффициент малого объёма:', result.coefficients.smallVolume);
  console.log('Количество единиц:', result.items[0].quantity);
  console.log('Итоговая стоимость:', result.totalCost, '₸');

  // Проверка: 3893 × 5 × 2.8 = 54,502 ₸
  const expected = 3893 * 5 * 2.8;
  console.log('Ожидаемая стоимость:', expected, '₸');
  console.log('Совпадение:', Math.abs(result.totalCost - expected) < 1 ? '✅' : '❌');
}

/**
 * ТЕСТ 3: Здание с несколькими коэффициентами
 * Зимние условия (1.25) + Сейсмичность 8 баллов (1.30)
 */
async function test3_MultipleCoefficients() {
  console.log('\n=== ТЕСТ 3: Несколько коэффициентов ===');

  const result = await calculateIndustrialInspection({
    buildingCategory: 'I',
    floors: 1,
    heightCategory: 'до 4.5м',
    volume: 5000, // Большой объём, коэффициент малого объёма = 1.0
    workComplexity: 'II',
    isWinterConditions: true, // 1.25
    seismicity: 8 // 1.30
  });

  console.log('Базовая цена:', result.basePrice, '₸');
  console.log('Применённые коэффициенты:', result.coefficients);
  console.log('Общий коэффициент:', result.items[0].coefficient);
  console.log('Итоговая стоимость:', result.totalCost, '₸');

  // Проверка: 19551 × 50 × 1.25 × 1.30 = 1,588,206.25 ₸
  const expected = 19551 * 50 * 1.25 * 1.3;
  console.log('Ожидаемая стоимость:', expected.toFixed(2), '₸');
  console.log('Совпадение:', Math.abs(result.totalCost - expected) < 1 ? '✅' : '❌');
}

/**
 * ТЕСТ 4: Многоэтажное здание
 */
async function test4_MultiStorey() {
  console.log('\n=== ТЕСТ 4: Многоэтажное здание ===');

  const result = await calculateIndustrialInspection({
    buildingCategory: 'II',
    floors: 5,
    heightCategory: 'до 4.5м',
    volume: 2000,
    workComplexity: 'II'
  });

  console.log('Базовая цена:', result.basePrice, '₸');
  console.log('Тип здания: многоэтажное');
  console.log('Таблица:', result.items[0].tableReference);
  console.log('Итоговая стоимость:', result.totalCost, '₸');

  // Проверка: используется таблица 1604-0305-01
  // Цена 25648 × 20 = 512,960 ₸
  const expected = 25648 * 20;
  console.log('Ожидаемая стоимость:', expected, '₸');
  console.log('Совпадение:', Math.abs(result.totalCost - expected) < 1 ? '✅' : '❌');
}

/**
 * ТЕСТ 5: Комплексный расчёт (все коэффициенты)
 */
async function test5_ComplexCalculation() {
  console.log('\n=== ТЕСТ 5: Комплексный расчёт ===');

  const result = await calculateIndustrialInspection({
    buildingCategory: 'III',
    floors: 1,
    heightCategory: 'от 6 до 8м',
    volume: 800, // Малый объём: коэффициент 2.0
    workComplexity: 'III',
    hasDifficultSoils: true, // 1.20
    isWinterConditions: true, // 1.25
    seismicity: 9, // 1.40
    isHeritageMonument: true, // 1.20
    structureSpacing: 'до 6м' // 1.15
  });

  console.log('\n📊 Детальная разбивка:');
  console.log('Базовая цена:', result.basePrice, '₸');
  console.log('\nПрименённые коэффициенты:');
  Object.entries(result.coefficients).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  console.log('\nОбщий коэффициент:', result.items[0].coefficient);
  console.log('Количество единиц (100 м³):', result.items[0].quantity);
  console.log('\n💰 ИТОГОВАЯ СТОИМОСТЬ:', result.totalCost, '₸');

  // Расчёт вручную:
  // Базовая цена: 19381 (из таблицы 1604-0303-01, позиция 13)
  // Коэффициенты: 2.0 × 1.20 × 1.25 × 1.40 × 1.20 × 1.15 = 5.796
  // Количество: 800 / 100 = 8
  // Итого: 19381 × 8 × 5.796 = 898,490.688 ₸
  const manualCalc = 19381 * 8 * (2.0 * 1.20 * 1.25 * 1.40 * 1.20 * 1.15);
  console.log('Ручной расчёт:', manualCalc.toFixed(2), '₸');
  console.log('Совпадение:', Math.abs(result.totalCost - manualCalc) < 1 ? '✅' : '❌');
}

/**
 * ТЕСТ 6: Граничные значения высоты
 */
async function test6_HeightCategories() {
  console.log('\n=== ТЕСТ 6: Категории высоты ===');

  const heights = ['до 4.5м', 'от 4.5 до 6м', 'от 6 до 8м', 'от 8 до 10м', 'свыше 10м'];

  for (const height of heights) {
    const result = await calculateIndustrialInspection({
      buildingCategory: 'I',
      floors: 1,
      heightCategory: height,
      volume: 1000,
      workComplexity: 'I'
    });

    console.log(`\n${height}:`);
    console.log('  Базовая цена:', result.basePrice, '₸');
    console.log('  Итого:', result.totalCost, '₸');
  }
}

/**
 * ЗАПУСК ВСЕХ ТЕСТОВ
 */
export async function runAllTests() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║  ТЕСТИРОВАНИЕ РАСЧЁТНОГО МОДУЛЯ (СЦИ РК 8.03-04-2025) ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  try {
    await test1_SimpleBuilding();
    await test2_SmallVolume();
    await test3_MultipleCoefficients();
    await test4_MultiStorey();
    await test5_ComplexCalculation();
    await test6_HeightCategories();

    console.log('\n✅ Все тесты завершены!\n');
  } catch (error) {
    console.error('\n❌ Ошибка при выполнении тестов:', error);
  }
}

// Если запускается напрямую
if (require.main === module) {
  runAllTests();
}

/**
 * Тест расчётного модуля
 */

import { calculateIndustrialInspection } from './modules/calculations/inspection/industrial';

async function testCalculation() {
  console.log('🧪 Тестирование расчётного модуля...\n');

  try {
    const result = await calculateIndustrialInspection({
      buildingCategory: 'I',
      floors: 1,
      heightCategory: 'до 4.5м',
      volume: 5000,
      workComplexity: 'I',
      isWinterConditions: true,
      seismicity: 8
    });

    console.log('✅ Расчёт выполнен успешно!\n');
    console.log('📊 Результаты:');
    console.log('   Базовая цена:', result.basePrice, '₸');
    console.log('   Коэффициенты:', result.coefficients);
    console.log('   Общий коэффициент:', result.items[0].coefficient);
    console.log('   Количество:', result.items[0].quantity, result.items[0].unit);
    console.log('   💰 ИТОГОВАЯ СТОИМОСТЬ:', result.totalCost, '₸');
    console.log('\n📋 Позиции сметы:');
    result.items.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.workType}`);
      console.log(`      Код: ${item.code}`);
      console.log(`      Цена: ${item.unitPrice} ₸ × ${item.quantity} × ${item.coefficient} = ${item.cost} ₸`);
    });

  } catch (error: any) {
    console.error('❌ Ошибка:', error.message);
  }
}

testCalculation();

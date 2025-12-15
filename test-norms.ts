/**
 * Тест нормативной базы
 */

import { normManager } from './modules/norms/normManager';

async function testNorms() {
  console.log('🧪 Тестирование нормативной базы...\n');

  // 1. Проверить версию
  console.log('1️⃣ Активная версия:', normManager.getActiveVersion());

  // 2. Загрузить таблицу
  try {
    const table = await normManager.getTable('4', 'inspection-industrial-cat1');
    console.log('2️⃣ Таблица загружена:', table.length, 'позиций');
    console.log('   Первая позиция:', table[0]);
  } catch (error: any) {
    console.error('❌ Ошибка загрузки таблицы:', error.message);
  }

  // 3. Загрузить коэффициенты
  try {
    const coeffs = await normManager.getCoefficients('4');
    console.log('3️⃣ Коэффициенты загружены');
    console.log('   WINTER_CONDITIONS:', coeffs.WINTER_CONDITIONS);
    console.log('   SEISMICITY[8]:', coeffs.SEISMICITY[8]);
  } catch (error: any) {
    console.error('❌ Ошибка загрузки коэффициентов:', error.message);
  }

  // 4. Проверить доступность
  const isAvailable = await normManager.isTableAvailable('4', 'inspection-industrial-cat1');
  console.log('4️⃣ Таблица доступна:', isAvailable);

  console.log('\n✅ Тест завершён!');
}

testNorms();

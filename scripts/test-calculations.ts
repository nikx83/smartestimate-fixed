/**
 * Путь: /scripts/test-calculations.ts
 * Назначение: Скрипт для быстрого запуска тестов расчётов
 * Использование: npx tsx scripts/test-calculations.ts
 */

import { runAllTests } from '../tests/calculations/industrial-inspection.test';

async function main() {
  console.log('Запуск тестов расчётного модуля...\n');
  await runAllTests();
}

main().catch(console.error);

/**
 * Базовые утилиты для расчётов
 */

/**
 * Найти цену в таблице по критериям
 */
export function findPriceInTable<T extends { [key: string]: any }>(
  table: T[],
  criteria: Partial<T>
): number {
  const match = table.find(row => 
    Object.entries(criteria).every(([key, value]) => 
      row[key] === value
    )
  );
  
  if (!match || !match.pricePerUnit) {
    throw new Error(
      `Цена не найдена в таблице. Критерии: ${JSON.stringify(criteria)}`
    );
  }
  
  return match.pricePerUnit;
}

/**
 * Применить коэффициенты (перемножение)
 */
export function applyCoefficients(
  basePrice: number,
  coefficients: Record<string, number>
): { totalCoefficient: number; finalPrice: number } {
  const totalCoefficient = Object.values(coefficients)
    .reduce((acc, coef) => acc * coef, 1);
  
  return {
    totalCoefficient,
    finalPrice: basePrice * totalCoefficient
  };
}

/**
 * Округлить до 2 знаков
 */
export function roundPrice(price: number): number {
  return Math.round(price * 100) / 100;
}

/**
 * Рассчитать итоговую стоимость
 */
export function calculateTotalCost(
  unitPrice: number,
  quantity: number,
  coefficient: number = 1
): number {
  return roundPrice(unitPrice * quantity * coefficient);
}

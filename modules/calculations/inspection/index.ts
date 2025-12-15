/**
 * Путь: /modules/calculations/inspection/index.ts
 * Назначение: Центральный экспорт всех расчётных модулей обследований
 * Описание: Упрощает импорт в UI компонентах
 */

// Экспорт расчёта промышленных зданий
export {
  calculateIndustrialInspection,
  type IndustrialInspectionParams,
  type CalculationResult,
  type EstimateItem
} from './industrial';

// TODO: Добавить позже
// export { calculateCivilInspection } from './civil';

/**
 * Универсальная функция расчёта обследований
 */
export async function calculateInspection(
  buildingType: 'industrial' | 'civil',
  params: any
) {
  switch (buildingType) {
    case 'industrial':
      return calculateIndustrialInspection(params);
    case 'civil':
      throw new Error('Расчёт жилых зданий будет реализован позже');
    default:
      throw new Error(`Неизвестный тип здания: ${buildingType}`);
  }
}

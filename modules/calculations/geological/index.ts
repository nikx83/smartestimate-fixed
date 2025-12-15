/**
 * Путь: /modules/calculations/geological/index.ts
 * Назначение: Центральный экспорт всех расчётных модулей геологии
 */

// Экспорт модулей расчёта
export {
  calculateDrilling,
  type DrillingParams,
  type DrillingResult
} from './drilling';

export {
  calculateLaboratory,
  type LaboratoryParams,
  type LaboratoryResult,
  type LaboratoryTestType,
  type LaboratoryTest
} from './laboratory';

export {
  calculateFieldTesting,
  type FieldTestingParams,
  type FieldTestingResult
} from './field-testing';

/**
 * Универсальная функция расчёта геологических работ
 */
export async function calculateGeological(
  workType: 'drilling' | 'laboratory' | 'field_testing',
  params: any
) {
  switch (workType) {
    case 'drilling':
      return calculateDrilling(params);
    case 'laboratory':
      return calculateLaboratory(params);
    case 'field_testing':
      return calculateFieldTesting(params);
    default:
      throw new Error(`Неизвестный тип работ: ${workType}`);
  }
}

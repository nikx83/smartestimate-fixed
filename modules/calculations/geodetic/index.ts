/**
 * Путь: /modules/calculations/geodetic/index.ts
 * Назначение: Центральный экспорт всех расчётных модулей геодезии
 * Описание: Упрощает импорт в UI компонентах
 */

// Экспорт модулей расчёта
export {
  calculateTopographicSurvey,
  type TopographicSurveyParams,
  type TopographicSurveyResult
} from './topographic-survey';

export {
  calculateLayoutWorks,
  type LayoutWorksParams,
  type LayoutWorksResult
} from './layout-works';

export {
  calculateDeformationMonitoring,
  type DeformationMonitoringParams,
  type DeformationMonitoringResult
} from './deformation-monitoring';

/**
 * Универсальная функция расчёта геодезических работ
 */
export async function calculateGeodetic(
  workType: 'topographic_survey' | 'layout_works' | 'deformation_monitoring',
  params: any
) {
  switch (workType) {
    case 'topographic_survey':
      return calculateTopographicSurvey(params);
    case 'layout_works':
      return calculateLayoutWorks(params);
    case 'deformation_monitoring':
      return calculateDeformationMonitoring(params);
    default:
      throw new Error(`Неизвестный тип работ: ${workType}`);
  }
}

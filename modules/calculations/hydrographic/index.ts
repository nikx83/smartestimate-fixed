/**
 * Путь: /modules/calculations/hydrographic/index.ts
 * Назначение: Центральный экспорт всех расчётных модулей гидрографии
 */

// Экспорт модулей расчёта
export {
  calculateDepthSounding,
  type DepthSoundingParams,
  type DepthSoundingResult
} from './depth-sounding';

export {
  calculateHydrologicalObservations,
  type HydrologicalObservationsParams,
  type HydrologicalObservationsResult
} from './hydrological-observations';

export {
  calculateWaterSampling,
  type WaterSamplingParams,
  type WaterSamplingResult,
  type SampleType,
  type WaterSample
} from './water-sampling';

export {
  calculateMeteoObservations,
  type MeteoObservationsParams,
  type MeteoObservationsResult,
  type MeteoObservationType
} from './meteorological-observations';

/**
 * Универсальная функция расчёта гидрографических работ
 */
export async function calculateHydrographic(
  workType: 'depth_sounding' | 'hydrological_observations' | 'water_sampling' | 'meteo_observations',
  params: any
) {
  switch (workType) {
    case 'depth_sounding':
      return calculateDepthSounding(params);
    case 'hydrological_observations':
      return calculateHydrologicalObservations(params);
    case 'water_sampling':
      return calculateWaterSampling(params);
    case 'meteo_observations':
      return calculateMeteoObservations(params);
    default:
      throw new Error(`Неизвестный тип работ: ${workType}`);
  }
}

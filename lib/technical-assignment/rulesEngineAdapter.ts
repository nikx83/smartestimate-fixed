/**
 * Файл: /lib/technical-assignment/rulesEngineAdapter.ts
 * Назначение: Адаптер Rules Engine → Technical Assignment
 * 
 * Описание:
 * Преобразует результаты работы Rules Engine в полноценную структуру
 * технического задания с цитатами из нормативов, экономическими обоснованиями
 * и заполненными разделами.
 */

import type { RulesEngineResult, GeologicalInput, WorkItem } from '@/modules/geological/types';
import type { 
  TechnicalAssignment,
  InteractiveWorkItem,
  NormativeQuote,
  EconomicJustification 
} from '@/types/technical-assignment';
import { 
  generateMainTasks,
  generateForecastProcesses,
  generateSafetyText,
  generateEnvironmentalText,
  generateReportingComposition 
} from './utils';

/**
 * ГЛАВНАЯ ФУНКЦИЯ: Преобразование результатов Rules Engine в ТЗ
 */
export function convertToTechnicalAssignment(
  engineResult: RulesEngineResult,
  input: GeologicalInput,
  customerInfo?: {
    organization: string;
    address: string;
    phone: string;
    email: string;
    representative: {
      name: string;
      position: string;
      phone: string;
      email: string;
    };
  }
): TechnicalAssignment {
  
  const now = new Date();
  
  return {
    // Метаданные
    metadata: {
      id: `TZ-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      version: '1.0',
      generatedAt: now,
      lastModified: now,
      projectId: input.projectId,
      status: 'draft',
    },

    // 1. Общие сведения
    generalInfo: {
      projectName: input.projectName,
      constructionType: input.constructionType || 'новое строительство',
      designStage: input.designStage || 'П (проект)',
      workDeadline: input.deadline,
      projectTimeline: input.projectTimeline,
      userNotes: undefined,
    },

    // 2. Характеристика объекта
    objectCharacteristics: {
      geotechnicalCategory: input.geotechnicalCategory!,
      responsibilityLevel: input.responsibilityLevel!,
      complexityCategory: input.complexityCategory!,
      objectType: input.objectType,
      buildingClass: input.buildingClass,
      buildingArea: input.buildingArea,
      buildingVolume: input.buildingVolume,
      floors: input.floors,
      height: input.height,
      constructiveFeatures: extractConstructiveFeatures(input),
      foundationType: input.foundationType,
      foundationDepth: input.foundationDepth,
      expectedLoads: input.expectedLoads,
      userNotes: undefined,
    },

    // 3. Природные условия
    naturalConditions: {
      location: {
        region: input.region || 'Республика Казахстан',
        city: input.city || '',
        address: input.address || '',
        coordinates: input.coordinates,
        boundaries: input.boundaries,
      },
      climate: {
        zone: input.climateZone || 'Резко континентальная',
        temperature: {
          min: input.minTemperature || -40,
          max: input.maxTemperature || 40,
          average: input.avgTemperature || 0,
        },
        precipitation: input.precipitation,
        freezingDepth: input.freezingDepth,
      },
      geology: {
        description: generateGeologyDescription(input),
        soilTypes: input.soilTypes || [],
        lithologicLayers: input.lithologicLayers || 1,
        soilCharacteristics: input.soilCharacteristics || 'выдержанные',
      },
      hydrogeology: {
        aquiferCount: input.aquiferCount || 0,
        waterLevel: input.waterLevel,
        waterAggressiveness: input.waterAggressiveness,
      },
      hazards: extractHazards(input),
      seismicity: input.seismicity,
      userNotes: undefined,
    },

    // 4. Цель изысканий
    surveyPurpose: {
      mainTasks: generateMainTasks(
        input.objectType,
        input.geotechnicalCategory!
      ),
      surveyTypes: ['инженерно-геологические'],
      specificObjectives: extractObjectives(input, engineResult),
      userNotes: undefined,
    },

    // 5. Состав работ (самое важное!)
    works: {
      fieldWorks: convertToInteractiveWorks(
        engineResult.allWorks.filter(w => isFieldWork(w.module))
      ),
      labWorks: convertToInteractiveWorks(
        engineResult.allWorks.filter(w => w.module === 'лабораторные')
      ),
      officeWorks: convertToInteractiveWorks(
        engineResult.allWorks.filter(w => w.module === 'камеральные')
      ),
      userNotes: undefined,
    },

    // 6. Нормативные документы (автозаполнится из работ)
    normativeDocuments: {
      spRK: [],
      gost: [],
      stRK: [],
      other: [],
      userNotes: undefined,
    },

    // 7. Исходные данные
    initialData: {
      previousSurveys: {
        available: !!input.previousSurveysAvailable,
        description: input.previousSurveysDescription,
        year: input.previousSurveysYear,
        organization: input.previousSurveysOrganization,
      },
      complications: {
        observed: !!input.complicationsObserved,
        description: input.complicationsDescription,
        cases: input.complicationCases,
      },
      archiveMaterials: {
        available: !!input.archiveMaterialsAvailable,
        description: input.archiveMaterialsDescription,
        sources: input.archiveSources,
      },
      userNotes: undefined,
    },

    // 8. Требования к производству
    productionRequirements: {
      methods: {
        standard: generateStandardMethods(engineResult),
        special: generateSpecialMethods(input),
      },
      qualityControl: {
        procedures: [
          'Операционный контроль при производстве буровых работ',
          'Контроль качества отбора проб грунтов',
          'Приёмочный контроль законченных работ',
          'Метрологический контроль измерительных приборов',
        ],
        frequency: 'В соответствии с СП РК и программой работ',
        acceptance: 'Поэтапная приёмка выполненных работ заказчиком',
      },
      accuracy: {
        measurements: generateAccuracyRequirements(input),
      },
      userNotes: undefined,
    },

    // 9. Техника безопасности
    safety: {
      generalRequirements: generateSafetyText(),
      specialConditions: extractSafetyConditions(input),
      protectiveEquipment: [
        'Каски защитные',
        'Спецодежда и спецобувь',
        'Защитные перчатки',
        'Средства индивидуальной защиты органов дыхания (при необходимости)',
      ],
      emergencyProcedures: [
        'Наличие средств связи для вызова экстренных служб',
        'Аптечка первой помощи на участке работ',
        'Инструктаж персонала по действиям в чрезвычайных ситуациях',
      ],
      userNotes: undefined,
    },

    // 10. Охрана среды
    environmental: {
      legislation: [
        'Экологический кодекс Республики Казахстан',
        'Закон РК "Об охране окружающей среды"',
        'СанПиН 1.03.001-12',
      ],
      measures: generateEnvironmentalMeasures(input),
      monitoring: [
        'Контроль состояния почв',
        'Контроль качества грунтовых вод',
        'Контроль выбросов в атмосферу',
      ],
      userNotes: undefined,
    },

    // 11. Инженерная защита
    engineeringProtection: {
      measures: generateProtectionMeasures(input, engineResult),
      sanitationNeeded: checkSanitationNeeded(input),
      sanitationDescription: input.sanitationDescription,
      userNotes: undefined,
    },

    // 12. Прогноз
    forecast: {
      naturalProcesses: {
        processes: generateForecastProcesses(
          input.hazards || [],
          (input.aquiferCount || 0) > 0
        ),
        likelihood: assessLikelihood(input),
        timeframe: 'Период эксплуатации объекта (50 лет)',
      },
      technogenicImpacts: {
        impacts: generateTechnogenicImpacts(input),
        severity: assessSeverity(input),
      },
      riskAssessment: {
        level: assessRiskLevel(input),
        description: generateRiskDescription(input),
        mitigation: generateMitigationMeasures(input),
      },
      userNotes: undefined,
    },

    // 13. Отчетность
    reporting: {
      composition: generateReportingComposition().map(name => ({
        name,
        description: '',
        required: true,
      })),
      format: 'оба',
      copies: 3,
      deadlines: {
        preliminary: input.preliminaryDeadline,
        final: input.finalDeadline || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
      userNotes: undefined,
    },

    // 14. Прочие условия
    otherConditions: input.otherConditions || '',

    // 15. Заказчик
    customer: customerInfo || {
      organization: 'Не указано',
      address: 'Не указано',
      contact: {
        phone: 'Не указано',
        email: 'Не указано',
      },
      representative: {
        name: 'Не указано',
        position: 'Не указано',
        phone: 'Не указано',
        email: 'Не указано',
      },
    },

    // Приложения
    attachments: [],

    // Применённые блоки
    appliedBlocks: engineResult.appliedBlocks,

    // Статистика
    statistics: {
      totalWorks: engineResult.allWorks.length,
      selectedWorks: engineResult.allWorks.filter(w => w.category === 'mandatory').length,
      mandatoryWorks: engineResult.statistics.mandatoryWorks,
      recommendedWorks: engineResult.statistics.recommendedWorks,
      optionalWorks: engineResult.statistics.optionalWorks,
      totalVolume: calculateTotalVolume(engineResult.allWorks),
      normativeReferences: engineResult.appliedBlocks.length,
      userModifications: 0,
      completeness: 85, // Базовая заполненность
    },
  };
}

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ПРЕОБРАЗОВАНИЯ
// ============================================================================

/**
 * Преобразовать работы в интерактивный формат
 */
function convertToInteractiveWorks(works: WorkItem[]): InteractiveWorkItem[] {
  return works.map(work => ({
    ...work,
    isSelected: work.category === 'mandatory', // Обязательные автоматически выбраны
    canBeExcluded: work.category !== 'mandatory',
    normativeQuotes: extractNormativeQuotes(work),
    economicJustification: generateEconomicJustification(work),
    userNotes: undefined,
    alternatives: undefined,
    dependencies: work.dependencies,
    warnings: work.warnings,
  }));
}

/**
 * Извлечь цитаты из нормативов для работы
 */
function extractNormativeQuotes(work: WorkItem): NormativeQuote[] {
  const quotes: NormativeQuote[] = [];

  // Если есть обоснование в работе
  if (work.justification) {
    quotes.push({
      document: work.normativeDocument || 'СП РК 1.02-105-2014',
      section: work.normativeSection || 'п. 4.2',
      quote: work.justification,
      relevance: 'Нормативное требование для данного вида работ',
      priority: work.category === 'mandatory' ? 'обязательный' : 'рекомендуемый',
    });
  }

  // Добавляем стандартные цитаты для типовых работ
  if (work.module === 'буровые') {
    quotes.push({
      document: 'СП РК 1.02-105-2014',
      section: 'п. 4.2.1',
      quote: 'Для объектов II геотехнической категории глубина скважин должна быть не менее чем на 5 м ниже подошвы фундамента или до кровли условного скального грунта.',
      relevance: 'Определение необходимой глубины бурения',
      priority: 'обязательный',
    });
  }

  return quotes;
}

/**
 * Генерация экономического обоснования
 */
function generateEconomicJustification(work: WorkItem): EconomicJustification {
  const justifications: Record<string, EconomicJustification> = {
    'буровые': {
      necessity: 'Получение достоверных данных о геологическом строении участка и свойствах грунтов',
      consequences: 'Невозможность проектирования фундаментов, риск аварий при строительстве',
      benefits: [
        'Литологический разрез площадки',
        'Физико-механические характеристики грунтов',
        'Глубина залегания грунтовых вод',
        'Несущая способность грунтов основания',
      ],
      risks: [
        'Ошибки в проектных решениях',
        'Деформации и разрушения конструкций',
        'Дополнительные затраты на усиление фундаментов',
        'Задержка сроков строительства',
      ],
    },
    'лабораторные': {
      necessity: 'Определение нормативных и расчетных характеристик грунтов для проектирования',
      consequences: 'Невозможность расчета оснований и фундаментов согласно СП РК',
      benefits: [
        'Плотность и влажность грунтов',
        'Угол внутреннего трения и сцепление',
        'Модуль деформации',
        'Коэффициент фильтрации',
      ],
      risks: [
        'Недостаточная несущая способность фундаментов',
        'Неравномерные осадки здания',
        'Невозможность согласования проекта',
      ],
    },
    'геодезические': {
      necessity: 'Создание топографической основы для проектирования и строительства',
      consequences: 'Невозможность привязки проекта к местности',
      benefits: [
        'Топографический план участка',
        'Координаты углов зданий',
        'Отметки существующей поверхности',
      ],
      risks: [
        'Ошибки в размещении объектов',
        'Проблемы с отводом поверхностных вод',
      ],
    },
  };

  // Возвращаем обоснование по модулю или стандартное
  return justifications[work.module] || {
    necessity: 'Выполнение нормативных требований для данного типа объекта',
    consequences: 'Неполнота исходных данных для проектирования',
    benefits: ['Необходимые данные для проектирования'],
    risks: ['Возможные проблемы при строительстве'],
  };
}

// ============================================================================
// ОСТАЛЬНЫЕ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================================

function isFieldWork(module: string): boolean {
  return ['топографо-геодезические', 'буровые', 'горные-выработки', 'полевые-испытания', 'гидрогеологические', 'геофизические'].includes(module);
}

function extractConstructiveFeatures(input: GeologicalInput): string[] {
  const features: string[] = [];
  
  if (input.foundationType) features.push(`Тип фундаментов: ${input.foundationType}`);
  if (input.floors) features.push(`Этажность: ${input.floors}`);
  if (input.hasBasement) features.push('Наличие подвала');
  
  return features;
}

function generateGeologyDescription(input: GeologicalInput): string {
  return `Площадка расположена в пределах ${input.geomorphElements || 'одного'} геоморфологического элемента. ` +
    `Геологическое строение характеризуется ${input.lithologicLayers || 'простым'} литологическим разрезом.`;
}

function extractHazards(input: GeologicalInput): any[] {
  return (input.hazards || []).map(hazard => ({
    type: hazard,
    distribution: input.hazardsDistribution || 'отсутствует',
    intensity: 'умеренная',
    description: `Выявлено ${input.hazardsDistribution || 'отсутствие'} проявления процесса "${hazard}"`,
  }));
}

function extractObjectives(input: GeologicalInput, result: RulesEngineResult): string[] {
  const objectives: string[] = [];
  
  if (input.hasBasement) {
    objectives.push('Оценка возможности устройства подземных помещений');
  }
  
  if (input.seismicity && input.seismicity >= 7) {
    objectives.push('Оценка сейсмических свойств грунтов');
  }
  
  return objectives;
}

function generateStandardMethods(result: RulesEngineResult): string[] {
  return [
    'Колонковое бурение скважин',
    'Отбор проб ненарушенной структуры',
    'Лабораторные испытания грунтов по ГОСТ',
    'Геодезическая съёмка участка',
  ];
}

function generateSpecialMethods(input: GeologicalInput): string[] | undefined {
  const methods: string[] = [];
  
  if (input.seismicity && input.seismicity >= 7) {
    methods.push('Определение сейсмических свойств грунтов');
  }
  
  return methods.length > 0 ? methods : undefined;
}

function generateAccuracyRequirements(input: GeologicalInput): any[] {
  return [
    { parameter: 'Плотность грунта', value: 0.01, unit: 'г/см³', standard: 'ГОСТ 5180' },
    { parameter: 'Влажность', value: 0.5, unit: '%', standard: 'ГОСТ 5180' },
  ];
}

function extractSafetyConditions(input: GeologicalInput): string[] {
  const conditions: string[] = [];
  
  if (input.hasUndergroundUtilities) {
    conditions.push('Соблюдать осторожность при бурении вблизи подземных коммуникаций');
  }
  
  return conditions;
}

function generateEnvironmentalMeasures(input: GeologicalInput): any[] {
  return [
    { aspect: 'Почвы', measure: 'Сбор и вывоз буровых отходов', responsibility: 'Подрядчик' },
    { aspect: 'Вода', measure: 'Предотвращение загрязнения водоносных горизонтов', responsibility: 'Подрядчик' },
  ];
}

function generateProtectionMeasures(input: GeologicalInput, result: RulesEngineResult): any[] {
  return [];
}

function checkSanitationNeeded(input: GeologicalInput): boolean {
  return !!input.sanitationNeeded;
}

function assessLikelihood(input: GeologicalInput): 'низкая' | 'средняя' | 'высокая' {
  if ((input.hazards || []).length > 2) return 'высокая';
  if ((input.hazards || []).length > 0) return 'средняя';
  return 'низкая';
}

function generateTechnogenicImpacts(input: GeologicalInput): string[] {
  return [
    'Дополнительная нагрузка на грунты от здания',
    'Изменение гидрогеологического режима',
  ];
}

function assessSeverity(input: GeologicalInput): 'низкая' | 'средняя' | 'высокая' {
  if (input.buildingArea && input.buildingArea > 5000) return 'высокая';
  if (input.buildingArea && input.buildingArea > 1000) return 'средняя';
  return 'низкая';
}

function assessRiskLevel(input: GeologicalInput): 'низкий' | 'средний' | 'высокий' | 'критический' {
  if (input.geotechnicalCategory === 'III') return 'высокий';
  if (input.geotechnicalCategory === 'II') return 'средний';
  return 'низкий';
}

function generateRiskDescription(input: GeologicalInput): string {
  return `Для объекта ${input.geotechnicalCategory} геотехнической категории уровень риска оценивается как ${assessRiskLevel(input)}.`;
}

function generateMitigationMeasures(input: GeologicalInput): string[] {
  return [
    'Выполнение полного объёма инженерных изысканий',
    'Контроль качества проектных решений',
    'Мониторинг состояния основания при строительстве',
  ];
}

function calculateTotalVolume(works: WorkItem[]): any {
  let drilling = 0;
  let samples = 0;
  let tests = 0;
  
  works.forEach(work => {
    if (work.module === 'буровые') drilling += work.quantity || 0;
    if (work.name.includes('отбор проб')) samples += work.quantity || 0;
    if (work.module === 'лабораторные') tests += work.quantity || 0;
  });
  
  return { drilling, samples, tests };
}
